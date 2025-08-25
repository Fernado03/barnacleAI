const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mlModelService = require('../services/mlModelService');
const Vessel = require('../models/Vessel');
const FleetSummary = require('../models/FleetSummary');

// Cache for MongoDB fleet data
let mongoFleetData = null;
let lastMongoLoad = 0;
let lastMongoSave = 0;
const MONGO_CACHE_DURATION = 2 * 60 * 1000; // Cache for 2 minutes (shorter for more dynamic feel)
const MONGO_SAVE_INTERVAL = 5 * 60 * 1000; // Save changes to MongoDB every 5 minutes

// Load fleet data from MongoDB with realistic updates
const loadFleetData = async () => {
  const currentTime = Date.now();
  
  // Return cached data if still fresh
  if (mongoFleetData && (currentTime - lastMongoLoad) < MONGO_CACHE_DURATION) {
    return mongoFleetData;
  }
  
  try {
    console.log('Loading fleet data from MongoDB...');
    
    // Fetch all active vessels from MongoDB
    const vessels = await Vessel.find({ isActive: true }).sort({ vesselId: 1 });
    
    if (vessels.length === 0) {
      console.log('No vessels found in MongoDB. Please run seedFleetData.js first.');
      return {
        vessels: [],
        summary: {
          totalVessels: 0,
          activeVessels: 0,
          idleVessels: 0,
          maintenanceFlags: 0,
          avgFuelPenalty: '+0.0%'
        },
        dataSource: 'MongoDB_Empty'
      };
    }
    
    // Apply realistic time-based updates to simulate fleet evolution
    const updatedVessels = vessels.map((vessel) => {
      // Simulate realistic changes over time
      const timeBasedVariation = Math.sin(Date.now() / 100000) * 5; // Gentle oscillation
      const randomVariation = (Math.random() - 0.5) * 2; // Small random changes
      
      // Update biofouling level slightly (realistic growth over time)
      let newFoulingLevel = vessel.performance.biofoulingLevel + timeBasedVariation + randomVariation;
      newFoulingLevel = Math.max(0, Math.min(100, newFoulingLevel)); // Keep in bounds
      
      // Update fuel penalty based on fouling level
      const newFuelPenalty = Math.min(newFoulingLevel * 0.15, 20);
      
      // Update operational efficiency
      const newEfficiency = Math.max(50, 100 - newFoulingLevel * 0.5);
      
      // Update vessel with new values (but don't save to DB to avoid constant writes)
      const updatedVessel = vessel.toObject();
      updatedVessel.performance.biofoulingLevel = Math.round(newFoulingLevel * 10) / 10;
      updatedVessel.performance.speedReduction = Math.round(newFuelPenalty * 10) / 10;
      updatedVessel.performance.operationalEfficiency = Math.round(newEfficiency * 10) / 10;
      
      // Update maintenance status based on fouling level
      if (newFoulingLevel > 80) {
        updatedVessel.maintenance.status = 'Overdue';
        updatedVessel.maintenance.priority = 'Critical';
        updatedVessel.mlPrediction.riskCategory = 'Critical';
      } else if (newFoulingLevel > 60) {
        updatedVessel.maintenance.status = 'Due';
        updatedVessel.maintenance.priority = 'High';
        updatedVessel.mlPrediction.riskCategory = 'High';
      } else if (newFoulingLevel > 30) {
        updatedVessel.maintenance.status = 'Scheduled';
        updatedVessel.maintenance.priority = 'Medium';
        updatedVessel.mlPrediction.riskCategory = 'Medium';
      } else {
        updatedVessel.maintenance.status = 'Current';
        updatedVessel.maintenance.priority = 'Low';
        updatedVessel.mlPrediction.riskCategory = 'Low';
      }
      
      return updatedVessel;
    });
    
    // Calculate fleet summary from updated vessels
    const totalVessels = updatedVessels.length;
    const statusCounts = {
      enRoute: updatedVessels.filter(v => v.status === 'En Route').length,
      idle: updatedVessels.filter(v => v.status === 'Idle').length,
      docked: updatedVessels.filter(v => v.status === 'Docked').length,
      maintenance: updatedVessels.filter(v => v.status === 'Maintenance').length
    };
    
    const highFoulingVessels = updatedVessels.filter(v => v.performance.biofoulingLevel > 70).length;
    const avgFuelPenalty = updatedVessels.reduce((sum, v) => sum + v.performance.speedReduction, 0) / totalVessels;
    const avgConfidenceScore = updatedVessels.reduce((sum, v) => sum + v.mlPrediction.confidenceScore, 0) / totalVessels;
    
    // Transform to frontend format
    const transformedVessels = updatedVessels.map(vessel => ({
      id: vessel.vesselId,
      imo: vessel.imo,
      mmsi: vessel.mmsi,
      name: vessel.name,
      type: vessel.type,
      
      status: vessel.status,
      currentPort: vessel.currentPort,
      
      performance: {
        biofoulingLevel: vessel.performance.biofoulingLevel,
        fuelConsumption: vessel.performance.fuelConsumption,
        speedReduction: vessel.performance.speedReduction,
        operationalEfficiency: vessel.performance.operationalEfficiency,
        lastUpdate: vessel.lastDataUpdate
      },
      
      maintenance: {
        status: vessel.maintenance.status,
        priority: vessel.maintenance.priority,
        daysSinceClean: vessel.maintenance.daysSinceClean,
        lastCleanDate: vessel.maintenance.lastCleanDate,
        nextScheduledMaintenance: vessel.maintenance.nextScheduledMaintenance
      },
      
      route: {
        current: vessel.destination,
        location: vessel.location
      },
      
      mlPrediction: vessel.mlPrediction
    }));
    
    const fleetData = {
      vessels: transformedVessels,
      summary: {
        totalVessels,
        activeVessels: statusCounts.enRoute,
        idleVessels: statusCounts.idle,
        dockedVessels: statusCounts.docked,
        maintenanceVessels: statusCounts.maintenance,
        maintenanceFlags: highFoulingVessels + statusCounts.maintenance,
        highFoulingVessels,
        avgFuelPenalty: `+${avgFuelPenalty.toFixed(1)}%`,
        avgConfidenceScore: avgConfidenceScore.toFixed(3)
      },
      dataSource: 'MongoDB_Persistent',
      lastUpdate: new Date().toISOString()
    };
    
    // Cache the data
    mongoFleetData = fleetData;
    lastMongoLoad = currentTime;
    
    // Periodically save evolved data back to MongoDB (every 5 minutes)
    if (currentTime - lastMongoSave > MONGO_SAVE_INTERVAL) {
      console.log('💾 Saving evolved vessel data back to MongoDB...');
      try {
        // Update vessels in MongoDB with evolved data (batch operation for performance)
        const bulkOps = updatedVessels.map(vessel => ({
          updateOne: {
            filter: { vesselId: vessel.vesselId },
            update: {
              $set: {
                'performance.biofoulingLevel': vessel.performance.biofoulingLevel,
                'performance.speedReduction': vessel.performance.speedReduction,
                'performance.operationalEfficiency': vessel.performance.operationalEfficiency,
                'maintenance.status': vessel.maintenance.status,
                'maintenance.priority': vessel.maintenance.priority,
                'mlPrediction.riskCategory': vessel.mlPrediction.riskCategory,
                lastDataUpdate: new Date()
              }
            }
          }
        }));
        
        await Vessel.bulkWrite(bulkOps);
        lastMongoSave = currentTime;
        console.log(`✅ Updated ${updatedVessels.length} vessels in MongoDB with evolved data`);
      } catch (saveError) {
        console.error('⚠️ Error saving evolved data to MongoDB:', saveError);
        // Continue execution even if save fails
      }
    }
    
    console.log(`Loaded ${totalVessels} vessels from MongoDB with realistic updates`);
    return fleetData;
    
  } catch (error) {
    console.error('Error loading fleet data from MongoDB:', error);
    
    // Return fallback data if MongoDB fails
    return {
      vessels: [],
      summary: {
        totalVessels: 0,
        activeVessels: 0,
        idleVessels: 0,
        maintenanceFlags: 0,
        avgFuelPenalty: '+0.0%'
      },
      dataSource: 'MongoDB_Error',
      error: error.message
    };
  }
};

// Cache for CSV data
let csvFleetData = null;
let lastCsvLoad = 0;
const CSV_CACHE_DURATION = 10 * 60 * 1000; // Cache for 10 minutes
const CSV_FILE_PATH = path.join(__dirname, '../../demo_biofouling_demo_SEA_all_countries_enriched.csv');

// Load and parse CSV data to extract unique values for dynamic fleet generation
const loadCsvData = async () => {
  const currentTime = Date.now();
  
  // Return cached data if still fresh
  if (csvFleetData && (currentTime - lastCsvLoad) < CSV_CACHE_DURATION) {
    return csvFleetData;
  }
  
  return new Promise((resolve, reject) => {
    const results = [];
    
    console.log('Loading fleet data from CSV:', CSV_FILE_PATH);
    
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        console.log(`Loaded ${results.length} CSV records`);
        
        try {
          // Extract unique values from the dataset for dynamic fleet creation
          const uniquePorts = [...new Set(results.map(row => row.port).filter(Boolean))];
          const uniqueCountries = [...new Set(results.map(row => row.country).filter(Boolean))];
          const vesselTypes = ['Container Ship', 'Bulk Carrier', 'Oil Tanker', 'General Cargo', 'Chemical Tanker'];
          const coatings = ['epoxy', 'silicone', 'copper', 'antifouling', 'biocide'];
          
          console.log(`Found ${uniquePorts.length} unique ports and ${uniqueCountries.length} unique countries`);
          console.log('Unique ports:', uniquePorts);
          
          // Create port-country mapping from actual data
          const portCountryMap = new Map();
          results.forEach(row => {
            if (row.port && row.country) {
              portCountryMap.set(row.port, row.country);
            }
          });
          
          // Sample realistic ranges from the actual data
          const sampleRanges = {
            fouling: { min: 0, max: 100 },
            daysSinceClean: { min: 0, max: 365 },
            fuelConsumption: { min: 0.01, max: 3.5 },
            temperature: { min: 20, max: 30 },
            salinity: { min: 32, max: 38 },
            windSpeed: { min: 0, max: 15 },
            currentSpeed: { min: 0, max: 1.5 },
            lat: { min: -10, max: 25 },
            lon: { min: 90, max: 140 }
          };
          
          // Generate dynamic fleet with port diversity and realistic variety
          const maxVessels = 20;
          const vessels = [];
          
          // Define realistic vessel profiles for variety
          const vesselProfiles = [
            // Clean vessels (recently cleaned)
            { foulingRange: [5, 25], daysRange: [0, 30], statusWeight: 'active', efficiency: [90, 95] },
            // Moderate fouling vessels  
            { foulingRange: [25, 60], daysRange: [30, 90], statusWeight: 'normal', efficiency: [75, 90] },
            // High fouling vessels
            { foulingRange: [60, 85], daysRange: [90, 180], statusWeight: 'maintenance', efficiency: [65, 75] },
            // Critical vessels
            { foulingRange: [85, 100], daysRange: [180, 365], statusWeight: 'critical', efficiency: [50, 65] }
          ];
          
          for (let i = 0; i < maxVessels; i++) {
            const vesselId = `VSL-${String(i + 1).padStart(5, '0')}`;
            
            // Cycle through ports to ensure diversity
            const port = uniquePorts[i % uniquePorts.length];
            const country = portCountryMap.get(port) || uniqueCountries[i % uniqueCountries.length];
            
            // Distribute vessels across profiles for variety (cycle every 4 vessels)
            const profileIndex = i % 4;
            const profile = vesselProfiles[profileIndex];
            
            // Generate realistic values based on profile
            const foulingPercent = profile.foulingRange[0] + 
              Math.random() * (profile.foulingRange[1] - profile.foulingRange[0]);
            
            const daysSinceClean = Math.floor(
              profile.daysRange[0] + Math.random() * (profile.daysRange[1] - profile.daysRange[0])
            );
            
            // Fuel consumption should correlate with fouling level
            const baseFuelConsumption = 1.0 + Math.random() * 1.5;
            const fuelPenalty = 1 + (foulingPercent / 100) * 0.8; // Up to 80% increase
            const fuelConsumption = baseFuelConsumption * fuelPenalty;
            
            // Speed varies realistically based on vessel condition
            const baseSpeed = 8 + Math.random() * 8;
            const speedReduction = foulingPercent > 70 ? 0.7 : foulingPercent > 40 ? 0.85 : 0.95;
            const vesselSpeed = baseSpeed * speedReduction;
            
            // Store profile for later use in status assignment
            const correlatedDays = daysSinceClean;
            
            const vesselData = {
              vessel_id: vesselId,
              imo: `IMO${7000000 + i}`,
              mmsi: `${400000000 + i}`,
              vessel_type: vesselTypes[i % vesselTypes.length],
              hull_area_m2: 3000 + Math.random() * 1000,
              coating: coatings[i % coatings.length],
              timestamp: new Date().toISOString(),
              date: new Date().toISOString().split('T')[0],
              
              // Location data with more variation
              lat: sampleRanges.lat.min + Math.random() * (sampleRanges.lat.max - sampleRanges.lat.min),
              lon: sampleRanges.lon.min + Math.random() * (sampleRanges.lon.max - sampleRanges.lon.min),
              
              // Performance data based on realistic correlations
              mean_speed_knots: vesselSpeed,
              vessel_speed: vesselSpeed,
              idle_hours: profile.statusWeight === 'critical' ? 2 + Math.random() * 4 : Math.random() * 2,
              
              // Environmental data with realistic ranges
              sst_c: 22 + Math.random() * 8, // 22-30°C
              sss_psu: 33 + Math.random() * 5, // 33-38 PSU
              wind_speed_mps: Math.random() * 15,
              wind_dir_deg: Math.random() * 360,
              curr_speed_mps: Math.random() * 1.5,
              curr_dir: Math.random() * 360,
              
              // Fouling data with realistic correlations
              fouling_percent: foulingPercent,
              fouling_class: foulingPercent > 70 ? 'high' : foulingPercent > 40 ? 'medium' : foulingPercent > 15 ? 'low' : 'clean',
              days_since_clean_clean: correlatedDays,
              fuel_consumption_tpd: fuelConsumption,
              
              // Port data
              country: country,
              port: port,
              port_lat: sampleRanges.lat.min + Math.random() * (sampleRanges.lat.max - sampleRanges.lat.min),
              port_lon: sampleRanges.lon.min + Math.random() * (sampleRanges.lon.max - sampleRanges.lon.min),
              
              // Additional fields
              last_clean_date: new Date(Date.now() - correlatedDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              profile: profile // Store profile for status assignment
            };
            
            vessels.push(vesselData);
          }
          
          console.log(`Generated ${vessels.length} diverse vessels`);
          
          // Convert to fleet format with ML predictions
          const fleetVessels = [];
          
          console.log('Processing vessels with ML predictions...');
        
        for (let index = 0; index < vessels.length; index++) {
          const row = vessels[index];
          
          // Use realistic biofouling levels instead of ML predictions for variety
          const biofoulingLevel = Math.abs(parseFloat(row.fouling_percent)) || 0;
          const daysSinceClean = parseInt(row.days_since_clean_clean) || 0;
          const fuelConsumption = parseFloat(row.fuel_consumption_tpd) || 0;
          
          // Create realistic risk categories with proper distribution
          let riskCategory = 'Low';
          let confidenceScore = 0.85; // Higher confidence for realistic data
          
          if (biofoulingLevel >= 80) {
            riskCategory = 'Critical';
            confidenceScore = 0.95;
          } else if (biofoulingLevel >= 60) {
            riskCategory = 'High';  
            confidenceScore = 0.90;
          } else if (biofoulingLevel >= 35) {
            riskCategory = 'Medium';
            confidenceScore = 0.85;
          } else {
            riskCategory = 'Low';
            confidenceScore = 0.80;
          }
          
          // Generate appropriate recommendations based on risk
          const recommendations = [];
          if (riskCategory === 'Critical') {
            recommendations.push('Immediate hull cleaning required');
            recommendations.push('Emergency inspection recommended');
          } else if (riskCategory === 'High') {
            recommendations.push('Schedule hull cleaning within 1-2 weeks');
            recommendations.push('Monitor performance indicators closely');
          } else if (riskCategory === 'Medium') {
            recommendations.push('Schedule inspection within 2-4 weeks');
            recommendations.push('Continue regular monitoring');
          } else {
            recommendations.push('Maintain current cleaning schedule');
            recommendations.push('Monitor antifouling coating condition');
          }
          
          // Debug log to check realistic predictions
          console.log(`Vessel ${row.vessel_id}: realistic fouling=${biofoulingLevel.toFixed(2)}%, risk=${riskCategory}, confidence=${confidenceScore.toFixed(3)}, port=${row.port}`);
          
          // Determine status based on vessel profile and realistic distribution
          let status = 'En Route'; // Default status
          
          // Use profile-based status assignment for more realistic distribution
          const { statusWeight } = row.profile;
          const randomFactor = Math.random();
          
          if (statusWeight === 'critical') {
            status = randomFactor < 0.7 ? 'Maintenance' : randomFactor < 0.9 ? 'Docked' : 'Idle';
          } else if (statusWeight === 'maintenance') {
            status = randomFactor < 0.5 ? 'Maintenance' : randomFactor < 0.8 ? 'En Route' : 'Docked';
          } else if (statusWeight === 'normal') {
            status = randomFactor < 0.6 ? 'En Route' : randomFactor < 0.8 ? 'Maintenance' : 'Docked';
          } else { // active/clean vessels
            status = randomFactor < 0.8 ? 'En Route' : randomFactor < 0.95 ? 'Docked' : 'Idle';
          }
          
          // Override with index-based distribution to ensure variety (backup)
          if (index < 6) status = 'En Route';      // 6 active vessels
          else if (index < 12) status = 'Maintenance'; // 6 maintenance vessels  
          else if (index < 15) status = 'Docked';      // 3 docked vessels
          else status = 'Idle';                        // 5 idle vessels
          
          // Calculate fuel penalty based on realistic biofouling level
          const fuelPenalty = Math.min(biofoulingLevel * 0.15, 20); // Max 20% penalty
          const operationalEfficiency = Math.max(50, 100 - (biofoulingLevel * 0.5)); // More realistic efficiency calc
          
          // Determine maintenance status based on realistic criteria
          let maintenanceStatus = 'Current';
          let maintenancePriority = 'Low';
          
          if (riskCategory === 'Critical' || biofoulingLevel > 80) {
            maintenanceStatus = 'Overdue';
            maintenancePriority = 'Critical';
          } else if (riskCategory === 'High' || biofoulingLevel > 60 || daysSinceClean > 120) {
            maintenanceStatus = 'Due';
            maintenancePriority = 'High';
          } else if (riskCategory === 'Medium' || daysSinceClean > 60) {
            maintenanceStatus = 'Scheduled';
            maintenancePriority = 'Medium';
          }
          
          // Estimate cleaning date based on realistic timelines
          const currentDate = new Date();
          let daysUntilCleaning = 90; // Default
          
          if (riskCategory === 'Critical') daysUntilCleaning = 3;
          else if (riskCategory === 'High') daysUntilCleaning = 14;
          else if (riskCategory === 'Medium') daysUntilCleaning = 45;
          else daysUntilCleaning = 90;
          
          const estimatedCleaningDate = new Date(currentDate.getTime() + daysUntilCleaning * 24 * 60 * 60 * 1000);
            
          // Create proper route string with full diversity
          const routeString = `${row.port}-${row.country}`;
          const currentPortString = `${row.port} (${row.country})`;
          
          // Determine fouling class based on realistic prediction
          let foulingClass = 'clean';
          if (biofoulingLevel > 70) foulingClass = 'high';
          else if (biofoulingLevel > 40) foulingClass = 'medium';
          else if (biofoulingLevel > 15) foulingClass = 'low';
          
          const vesselData = {
            id: row.vessel_id,
            imo: row.imo,
            mmsi: row.mmsi,
            name: `MV ${row.vessel_id.replace('VSL-', 'Fleet Star ')}`,
            type: row.vessel_type,
            
            status: status,
            currentPort: currentPortString,
            
            performance: {
              biofoulingLevel: biofoulingLevel,
              fuelConsumption: fuelConsumption,
              speedReduction: fuelPenalty,
              operationalEfficiency: operationalEfficiency,
              lastUpdate: row.timestamp
            },
            
            maintenance: {
              status: maintenanceStatus,
              priority: maintenancePriority,
              lastService: row.last_clean_date,
              daysSinceClean: daysSinceClean,
              estimatedNextCleaning: estimatedCleaningDate.toISOString()
            },
            
            // Realistic ML prediction data
            mlPrediction: {
              riskCategory: riskCategory,
              confidenceScore: confidenceScore,
              recommendations: recommendations.join('; '),
              modelVersion: '1.0.0-realistic',
              predictionMethod: 'enhanced_rule_based',
              processingTime: 1
            },
              
              route: {
                current: routeString,
                location: {
                  lat: parseFloat(row.lat) || 0,
                  lon: parseFloat(row.lon) || 0
                }
              },
              
              environmental: {
                seaTemperature: parseFloat(row.sst_c) || null,
                salinity: parseFloat(row.sss_psu) || null,
                windSpeed: parseFloat(row.wind_speed_mps) || null,
                currentSpeed: parseFloat(row.curr_speed_mps) || null
              },
              
              foulingClass: foulingClass,
              
              createdAt: row.timestamp,
              updatedAt: new Date().toISOString()
            };
            
            fleetVessels.push(vesselData);
        }
        
        console.log(`Processed ${fleetVessels.length} vessels with realistic predictions`);
        
        // Calculate fleet summary with realistic status counting
        const statusCounts = {
          'En Route': fleetVessels.filter(v => v.status === 'En Route').length,
          'Maintenance': fleetVessels.filter(v => v.status === 'Maintenance').length,
          'Idle': fleetVessels.filter(v => v.status === 'Idle').length,
          'Docked': fleetVessels.filter(v => v.status === 'Docked').length
        };
        
        // Count clean vessels by fouling class (not status)
        const cleanVessels = fleetVessels.filter(v => v.foulingClass === 'clean' || v.foulingClass === 'low').length;
        
        // Count vessels needing attention based on realistic risk assessment
        const highFoulingVessels = fleetVessels.filter(v => 
          v.mlPrediction.riskCategory === 'Critical' || 
          v.mlPrediction.riskCategory === 'High' || 
          v.foulingClass === 'high'
        ).length;
        
        // Count maintenance flags (overdue vessels)
        const maintenanceFlags = fleetVessels.filter(v => v.maintenance.status === 'Overdue').length;
        
        console.log('Status distribution:', statusCounts);
        console.log('Clean/Low fouling vessels:', cleanVessels);
        console.log('High fouling vessels (realistic-based):', highFoulingVessels);
        console.log('Maintenance flags (overdue):', maintenanceFlags);
        console.log('Total vessels in all statuses:', Object.values(statusCounts).reduce((sum, count) => sum + count, 0));
        
        const summary = {
          totalVessels: fleetVessels.length,
          activeVessels: statusCounts['En Route'],
          idleVessels: statusCounts['Idle'],
          maintenanceVessels: statusCounts['Maintenance'],
          dockedVessels: statusCounts['Docked'],
          cleanVessels: cleanVessels,
          maintenanceFlags: maintenanceFlags,
          highFoulingVessels: highFoulingVessels, // Realistic-based count for "Need Attention"
          avgFuelPenalty: fleetVessels.length > 0 ? 
            `+${(fleetVessels.reduce((sum, v) => sum + v.performance.speedReduction, 0) / fleetVessels.length).toFixed(1)}%` :
            '+0.0%',
          avgConfidenceScore: fleetVessels.length > 0 ?
            (fleetVessels.reduce((sum, v) => sum + v.mlPrediction.confidenceScore, 0) / fleetVessels.length).toFixed(3) :
            '0.000',
          mlModelStats: {
            totalPredictions: fleetVessels.length,
            mlPredictions: 0, // Using realistic rule-based instead
            realisticPredictions: fleetVessels.length, // New realistic approach
            fallbackPredictions: 0, // Not using fallback anymore
            riskDistribution: {
              critical: fleetVessels.filter(v => v.mlPrediction.riskCategory === 'Critical').length,
              high: fleetVessels.filter(v => v.mlPrediction.riskCategory === 'High').length,
              medium: fleetVessels.filter(v => v.mlPrediction.riskCategory === 'Medium').length,
              low: fleetVessels.filter(v => v.mlPrediction.riskCategory === 'Low').length
            }
          }
        };
        
        const fleetData = {
          vessels: fleetVessels.slice(0, 20), // Limit to first 20 vessels for dashboard
          summary,
          dataSource: 'SEA_Enriched_Dataset_Realistic_Enhanced',
          lastUpdated: new Date().toISOString(),
          mlModelInfo: {
            enabled: true,
            version: '1.0.0-realistic',
            features: 9,
            description: 'Enhanced realistic biofouling prediction with varied vessel profiles'
          }
        };
        
        csvFleetData = fleetData;
        lastCsvLoad = currentTime;
        
        // Log port diversity summary
        const portCounts = {};
        fleetVessels.forEach(vessel => {
          const port = vessel.currentPort;
          portCounts[port] = (portCounts[port] || 0) + 1;
        });
        
        console.log('Port diversity summary:', portCounts);
        console.log(`Unique ports: ${Object.keys(portCounts).length}`);
        
        // Log individual vessel status for debugging
        console.log('\n=== VESSEL STATUS ASSIGNMENTS ===');
        fleetVessels.forEach((vessel, idx) => {
          console.log(`${vessel.id}: ${vessel.status} - ${vessel.currentPort} - Fouling: ${vessel.performance.biofoulingLevel.toFixed(1)}%`);
        });
        console.log('=====================================\n');
        
        console.log(`Generated ${fleetVessels.length} diverse vessels, showing ${fleetData.vessels.length} in dashboard`);
        resolve(fleetData);
      } catch (error) {
        console.error('Error processing vessels with ML predictions:', error);
        reject(error);
      }
    })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
};

// Unified data loading with synchronization strategy
const getUnifiedFleetData = async () => {
  try {
    // Primary: Try MongoDB first
    const mongoData = await loadFleetData();
    
    // Check if MongoDB has sufficient data
    if (mongoData.vessels && mongoData.vessels.length > 0) {
      console.log(`✅ Using MongoDB data: ${mongoData.vessels.length} vessels`);
      return {
        ...mongoData,
        dataSource: 'MongoDB_Primary',
        synchronizationStatus: 'mongodb_primary'
      };
    }
    
    // Fallback: Use CSV data if MongoDB is empty or unavailable
    console.log('⚠️ MongoDB data insufficient, falling back to CSV...');
    const csvData = await loadCsvData();
    
    // Optionally sync CSV data to MongoDB for future use
    if (csvData.vessels && csvData.vessels.length > 0) {
      console.log('🔄 Syncing CSV data to MongoDB for future use...');
      await syncCsvToMongoDB(csvData.vessels);
    }
    
    return {
      ...csvData,
      dataSource: 'CSV_Fallback_Synced',
      synchronizationStatus: 'csv_fallback_synced'
    };
    
  } catch (error) {
    console.error('Error in unified data loading:', error);
    throw error;
  }
};

// Sync CSV data to MongoDB
const syncCsvToMongoDB = async (csvVessels) => {
  try {
    const syncStartTime = Date.now();
    console.log(`🔄 Starting CSV to MongoDB sync for ${csvVessels.length} vessels...`);
    
    // Transform CSV vessel format to MongoDB Vessel model format
    const mongoVessels = csvVessels.map(csvVessel => ({
      vesselId: csvVessel.id,
      imo: csvVessel.imo,
      mmsi: csvVessel.mmsi,
      name: csvVessel.name,
      type: csvVessel.type,
      status: csvVessel.status,
      currentPort: csvVessel.currentPort,
      destination: csvVessel.route?.current || csvVessel.currentPort,
      location: {
        type: 'Point',
        coordinates: [csvVessel.route?.location?.lon || 0, csvVessel.route?.location?.lat || 0]
      },
      performance: {
        biofoulingLevel: csvVessel.performance.biofoulingLevel,
        fuelConsumption: csvVessel.performance.fuelConsumption,
        speedReduction: csvVessel.performance.speedReduction,
        operationalEfficiency: csvVessel.performance.operationalEfficiency
      },
      maintenance: {
        status: csvVessel.maintenance.status,
        priority: csvVessel.maintenance.priority,
        daysSinceClean: csvVessel.maintenance.daysSinceClean,
        lastCleanDate: csvVessel.maintenance.lastService,
        nextScheduledMaintenance: csvVessel.maintenance.estimatedNextCleaning
      },
      mlPrediction: {
        riskCategory: csvVessel.mlPrediction.riskCategory,
        confidenceScore: csvVessel.mlPrediction.confidenceScore,
        recommendations: csvVessel.mlPrediction.recommendations,
        modelVersion: csvVessel.mlPrediction.modelVersion,
        lastPredictionUpdate: new Date()
      },
      environmental: csvVessel.environmental,
      isActive: true,
      lastDataUpdate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Use upsert to avoid duplicates
    const bulkOps = mongoVessels.map(vessel => ({
      updateOne: {
        filter: { vesselId: vessel.vesselId },
        update: { $set: vessel },
        upsert: true
      }
    }));
    
    const result = await Vessel.bulkWrite(bulkOps);
    const syncTime = Date.now() - syncStartTime;
    
    console.log(`✅ CSV to MongoDB sync completed in ${syncTime}ms:`);
    console.log(`   - Matched: ${result.matchedCount}`);
    console.log(`   - Modified: ${result.modifiedCount}`);
    console.log(`   - Upserted: ${result.upsertedCount}`);
    
    return result;
  } catch (error) {
    console.error('❌ Error syncing CSV to MongoDB:', error);
    // Don't throw - allow system to continue with CSV data
    return null;
  }
};

// Controller functions
const getFleetData = async (req, res) => {
  try {
    // Use unified data loading strategy
    const fleetData = await getUnifiedFleetData();
    
    res.status(200).json({
      success: true,
      data: fleetData,
      timestamp: new Date().toISOString(),
      synchronizationInfo: {
        dataSource: fleetData.dataSource,
        status: fleetData.synchronizationStatus,
        vesselCount: fleetData.vessels?.length || 0
      }
    });
  } catch (error) {
    console.error('Error fetching fleet data:', error);
    
    // Final fallback to basic mock data
    const fallbackData = {
      vessels: [],
      summary: {
        totalVessels: 0,
        activeVessels: 0,
        idleVessels: 0,
        maintenanceFlags: 0,
        avgFuelPenalty: '+0.0%'
      },
      dataSource: 'Fallback_Mock',
      synchronizationStatus: 'fallback_error',
      error: error.message
    };
    
    res.status(200).json({
      success: true,
      data: fallbackData,
      timestamp: new Date().toISOString(),
      warning: 'Using fallback data due to data loading error'
    });
  }
};

const getVesselById = async (req, res) => {
  try {
    const { vesselId } = req.params;
    
    // Use unified data loading for consistency
    const fleetData = await getUnifiedFleetData();
    const vessel = fleetData.vessels.find(v => 
      v.id === vesselId || 
      v.imo === vesselId || 
      v.mmsi === vesselId ||
      v.vesselId === vesselId // Support MongoDB format too
    );
    
    if (!vessel) {
      return res.status(404).json({
        success: false,
        message: `Vessel not found with ID: ${vesselId}`,
        dataSource: fleetData.dataSource,
        searchedIn: {
          totalVessels: fleetData.vessels.length,
          dataSource: fleetData.dataSource
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: vessel,
      timestamp: new Date().toISOString(),
      dataSource: fleetData.dataSource,
      synchronizationStatus: fleetData.synchronizationStatus
    });
  } catch (error) {
    console.error('Error fetching vessel data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vessel data',
      error: error.message
    });
  }
};

const updateVesselStatus = async (req, res) => {
  try {
    const { vesselId } = req.params;
    const { status, currentPort } = req.body;
    
    // Validate status
    const validStatuses = ['Active', 'In Port', 'Maintenance'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: Active, In Port, Maintenance'
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate update
    const updatedVessel = {
      vesselId,
      status,
      currentPort,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user?.email || 'system'
    };
    
    res.status(200).json({
      success: true,
      data: updatedVessel,
      message: 'Vessel status updated successfully'
    });
  } catch (error) {
    console.error('Error updating vessel status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vessel status',
      error: error.message
    });
  }
};

const scheduleMaintenance = async (req, res) => {
  try {
    const { vesselId } = req.params;
    const { 
      type, 
      scheduledDate, 
      priority = 'Medium',
      description,
      estimatedDuration,
      estimatedCost 
    } = req.body;
    
    // Validate required fields
    if (!type || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Type and scheduled date are required'
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maintenanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      vesselId,
      type,
      scheduledDate,
      priority,
      description,
      estimatedDuration,
      estimatedCost,
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
      createdBy: req.user?.email || 'system'
    };
    
    res.status(201).json({
      success: true,
      data: maintenanceRecord,
      message: 'Maintenance scheduled successfully'
    });
  } catch (error) {
    console.error('Error scheduling maintenance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule maintenance',
      error: error.message
    });
  }
};

const getMaintenanceSchedule = async (req, res) => {
  try {
    const { vesselId } = req.params;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Generate mock maintenance schedule
    const maintenanceItems = [];
    const maintenanceTypes = ['Hull Cleaning', 'Engine Service', 'Safety Inspection', 'Propeller Maintenance'];
    
    for (let i = 0; i < 5; i++) {
      maintenanceItems.push({
        id: Math.random().toString(36).substr(2, 9),
        vesselId,
        type: maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)],
        scheduledDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
        priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        status: ['Scheduled', 'In Progress', 'Completed'][Math.floor(Math.random() * 3)],
        estimatedCost: Math.floor(Math.random() * 50000) + 10000,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    res.status(200).json({
      success: true,
      data: maintenanceItems,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching maintenance schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance schedule',
      error: error.message
    });
  }
};

const updateMaintenanceStatus = async (req, res) => {
  try {
    const { maintenanceId } = req.params;
    const { status, notes, actualCost, completedDate } = req.body;
    
    const validStatuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: Scheduled, In Progress, Completed, Cancelled'
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const updatedMaintenance = {
      maintenanceId,
      status,
      notes,
      actualCost,
      completedDate,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user?.email || 'system'
    };
    
    res.status(200).json({
      success: true,
      data: updatedMaintenance,
      message: 'Maintenance status updated successfully'
    });
  } catch (error) {
    console.error('Error updating maintenance status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update maintenance status',
      error: error.message
    });
  }
};

// New endpoint to check data synchronization status and manually sync data
const syncDataSources = async (req, res) => {
  try {
    console.log('🔄 Manual data synchronization requested...');
    
    // Get current status from both sources
    const mongoStatus = await checkMongoDBStatus();
    const csvStatus = await checkCSVStatus();
    
    const syncReport = {
      timestamp: new Date().toISOString(),
      mongodb: mongoStatus,
      csv: csvStatus,
      syncActions: []
    };
    
    // Determine sync strategy based on data availability
    if (csvStatus.available && (!mongoStatus.available || mongoStatus.vesselCount === 0)) {
      console.log('📥 Syncing CSV data to MongoDB...');
      const csvData = await loadCsvData();
      const syncResult = await syncCsvToMongoDB(csvData.vessels);
      
      syncReport.syncActions.push({
        action: 'csv_to_mongodb',
        status: syncResult ? 'success' : 'failed',
        vesselsProcessed: csvData.vessels.length,
        result: syncResult
      });
    }
    
    // Force cache invalidation for fresh data
    mongoFleetData = null;
    csvFleetData = null;
    lastMongoLoad = 0;
    lastCsvLoad = 0;
    
    // Get updated unified data
    const unifiedData = await getUnifiedFleetData();
    syncReport.finalStatus = {
      dataSource: unifiedData.dataSource,
      vesselCount: unifiedData.vessels?.length || 0,
      synchronizationStatus: unifiedData.synchronizationStatus
    };
    
    res.status(200).json({
      success: true,
      message: 'Data synchronization completed',
      data: syncReport
    });
  } catch (error) {
    console.error('Error during data synchronization:', error);
    res.status(500).json({
      success: false,
      message: 'Data synchronization failed',
      error: error.message
    });
  }
};

// Helper function to check MongoDB status
const checkMongoDBStatus = async () => {
  try {
    const vesselCount = await Vessel.countDocuments({ isActive: true });
    return {
      available: true,
      vesselCount,
      lastUpdate: await Vessel.findOne().sort({ updatedAt: -1 }).select('updatedAt'),
      connection: 'connected'
    };
  } catch (error) {
    return {
      available: false,
      vesselCount: 0,
      error: error.message,
      connection: 'failed'
    };
  }
};

// Helper function to check CSV status
const checkCSVStatus = async () => {
  try {
    const csvExists = require('fs').existsSync(CSV_FILE_PATH);
    if (!csvExists) {
      return {
        available: false,
        error: 'CSV file not found',
        path: CSV_FILE_PATH
      };
    }
    
    const stats = require('fs').statSync(CSV_FILE_PATH);
    return {
      available: true,
      fileSize: stats.size,
      lastModified: stats.mtime,
      path: CSV_FILE_PATH
    };
  } catch (error) {
    return {
      available: false,
      error: error.message,
      path: CSV_FILE_PATH
    };
  }
};

// New endpoint to manually evolve and save fleet data
const evolveFleetData = async (req, res) => {
  try {
    console.log('🌊 Manually evolving fleet data...');
    
    // Force cache invalidation to trigger fresh data load and evolution
    mongoFleetData = null;
    lastMongoLoad = 0;
    lastMongoSave = 0; // Force immediate save
    
    // Load fresh data (this will apply evolution and save to MongoDB)
    const fleetData = await getUnifiedFleetData();
    
    res.status(200).json({
      success: true,
      data: fleetData,
      message: 'Fleet data evolved and saved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error evolving fleet data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to evolve fleet data',
      error: error.message
    });
  }
};

module.exports = {
  getFleetData,
  getVesselById,
  updateVesselStatus,
  scheduleMaintenance,
  getMaintenanceSchedule,
  updateMaintenanceStatus,
  evolveFleetData,
  syncDataSources  // New synchronization endpoint
};