import React from 'react';
import { getFoulingStyles, formatValue } from '../../utils/dataProcessing';

/**
 * Simple Chart Components for BarnaClean Analytics
 * Following Jakob Nielsen's Heuristics:
 * - Heuristic 1: Visibility of System Status
 * - Heuristic 4: Consistency and Standards
 * - Heuristic 8: Aesthetic and Minimalist Design
 */

/**
 * Progress Bar Chart for displaying fouling levels
 */
export const ProgressBar = ({ 
  value, 
  progress, // Alternative prop name
  maxValue = 100, 
  label, 
  foulingClass = 'clean',
  showPercentage = true,
  height = 'h-3',
  color = 'bg-blue-500',
  className = ''
}) => {
  // Use progress prop if value is not provided, with fallback to 0
  const actualValue = value !== undefined ? value : (progress !== undefined ? progress : 0);
  const percentage = (actualValue / maxValue) * 100;
  const styles = getFoulingStyles(foulingClass);
  
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium text-sm">{label}</span>
          {showPercentage && (
            <span className={`font-bold ${styles.color}`}>
              {formatValue(actualValue, 'percentage')}
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${height} shadow-inner`}>
        <div 
          className={`${color || `bg-gradient-to-r ${styles.gradientFrom} ${styles.gradientTo}`} ${height} rounded-full shadow-sm transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

/**
 * Line Chart for time series data
 */
export const SimpleLineChart = ({ 
  data, 
  xKey, 
  yKey, 
  width = 400, 
  height = 200, 
  color = '#3B82F6',
  label = ''
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-50 rounded-lg" style={{ width, height }}>
        <span className="text-gray-500">No data available</span>
      </div>
    );
  }
  
  // Filter out invalid data points
  const validData = data.filter(d => {
    const value = d[yKey];
    return value !== undefined && value !== null && !isNaN(value) && isFinite(value);
  });
  
  if (validData.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-50 rounded-lg" style={{ width, height }}>
        <span className="text-gray-500">No valid data</span>
      </div>
    );
  }
  
  const yValues = validData.map(d => d[yKey]);
  const maxY = Math.max(...yValues);
  const minY = Math.min(...yValues);
  const range = maxY - minY || 1; // Prevent division by zero
  
  const points = validData.map((point, index) => {
    const x = validData.length > 1 ? (index / (validData.length - 1)) * (width - 40) + 20 : width / 2;
    const y = height - 20 - ((point[yKey] - minY) / range) * (height - 40);
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="space-y-2">
      {label && <h4 className="font-medium text-gray-700">{label}</h4>}
      <svg width={width} height={height} className="border border-gray-200 rounded bg-white">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Trend line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          className="drop-shadow-sm"
        />
        
        {/* Data points */}
        {validData.map((point, index) => {
          const x = validData.length > 1 ? (index / (validData.length - 1)) * (width - 40) + 20 : width / 2;
          const y = height - 20 - ((point[yKey] - minY) / range) * (height - 40);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              className="drop-shadow-sm hover:r-4 transition-all cursor-pointer"
              title={`${point[xKey]}: ${formatValue(point[yKey], 'percentage')}`}
            />
          );
        })}
        
        {/* Y-axis labels */}
        <text x="5" y="25" className="text-xs fill-gray-600">{maxY.toFixed(1)}</text>
        <text x="5" y={height - 10} className="text-xs fill-gray-600">{minY.toFixed(1)}</text>
      </svg>
    </div>
  );
};

/**
 * Metric Card for displaying key statistics
 */
export const MetricCard = ({ 
  title, 
  value, 
  unit = '', 
  trend = null, 
  icon = null,
  color = 'blue',
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };
  
  const textSizes = {
    small: { title: 'text-sm', value: 'text-xl' },
    medium: { title: 'text-base', value: 'text-2xl lg:text-3xl' },
    large: { title: 'text-lg', value: 'text-3xl lg:text-4xl' }
  };
  
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-600',
    green: 'from-green-50 to-green-100 border-green-200 text-green-600',
    orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-600',
    red: 'from-red-50 to-red-100 border-red-200 text-red-600',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-600'
  };
  
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg ${sizeClasses[size]} border hover:shadow-md transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className={`text-gray-600 ${textSizes[size].title} mb-2 font-medium`}>
            {title}
          </h3>
          <div className={`font-bold ${textSizes[size].value}`}>
            {value}{unit && <span className="text-sm font-normal ml-1">{unit}</span>}
          </div>
          {trend && (
            <div className={`text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend).toFixed(1)}%
            </div>
          )}
        </div>
        {icon && (
          <div className="text-2xl opacity-60">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Status Badge for fouling classification
 */
export const StatusBadge = ({ 
  status, 
  size = 'medium',
  className = '' 
}) => {
  const styles = getFoulingStyles(status);
  
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  };
  
  const statusLabels = {
    clean: 'Clean',
    low: 'Low Fouling',
    medium: 'Medium Fouling',
    high: 'High Fouling'
  };
  
  return (
    <span className={`inline-flex ${sizeClasses[size]} font-medium rounded-full ${styles.bgColor} ${styles.color} ${className}`}>
      {statusLabels[status] || status}
    </span>
  );
};

/**
 * Data Table with sorting and responsive design
 */
export const DataTable = ({ 
  columns, 
  data, 
  sortable = true,
  className = '' 
}) => {
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });
  
  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);
  
  return (
    <div className={`bg-gray-50 rounded-lg overflow-hidden border border-gray-200 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left py-3 lg:py-4 px-4 lg:px-6 font-semibold text-gray-700 border-b border-gray-300 text-sm lg:text-base ${
                    sortable ? 'cursor-pointer hover:bg-gray-200 transition-colors' : ''
                  }`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortable && sortConfig.key === column.key && (
                      <span className="text-xs">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-blue-50 transition-colors duration-200 border-b border-gray-200 last:border-b-0"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="py-3 lg:py-4 px-4 lg:px-6 text-sm lg:text-base"
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Alert component for notifications and warnings
 */
export const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onDismiss,
  className = '' 
}) => {
  const alertStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };
  
  const icons = {
    info: '💧',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };
  
  return (
    <div className={`border rounded-lg p-4 ${alertStyles[type]} ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="text-lg">{icons[type]}</div>
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <p className="text-sm">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Dismiss alert"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Advanced Bar Chart for comparing multiple metrics
 * Nielsen Heuristic 1: Visibility of System Status
 */
export const BarChart = ({ 
  data, 
  xKey, 
  yKey, 
  width = 600, 
  height = 300, 
  color = '#3B82F6',
  label = '',
  showValues = true 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-50 rounded-lg" style={{ width, height }}>
        <span className="text-gray-500">No data available</span>
      </div>
    );
  }
  
  const maxY = Math.max(...data.map(d => d[yKey]));
  const barWidth = (width - 80) / data.length;
  
  return (
    <div className="space-y-2">
      {label && <h4 className="font-medium text-gray-700">{label}</h4>}
      <svg width={width} height={height} className="border border-gray-200 rounded bg-white">
        {/* Grid lines */}
        <defs>
          <pattern id="barGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#barGrid)" />
        
        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = ((item[yKey] / maxY) * (height - 60));
          const x = 40 + (index * barWidth) + (barWidth * 0.1);
          const y = height - 40 - barHeight;
          const actualBarWidth = barWidth * 0.8;
          
          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={actualBarWidth}
                height={barHeight}
                fill={color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                rx="2"
              />
              {showValues && (
                <text
                  x={x + actualBarWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-600 font-medium"
                >
                  {item[yKey].toFixed(1)}
                </text>
              )}
              <text
                x={x + actualBarWidth / 2}
                y={height - 20}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {item[xKey]}
              </text>
            </g>
          );
        })}
        
        {/* Y-axis */}
        <line x1="40" y1="20" x2="40" y2={height - 40} stroke="#6B7280" strokeWidth="1"/>
        <text x="5" y="25" className="text-xs fill-gray-600">{maxY.toFixed(1)}</text>
        <text x="5" y={height - 45} className="text-xs fill-gray-600">0</text>
      </svg>
    </div>
  );
};

/**
 * Multi-line Chart for comparing trends
 * Nielsen Heuristic 4: Consistency and Standards
 */
export const MultiLineChart = ({ 
  data, 
  lines, 
  width = 600, 
  height = 300, 
  label = '' 
}) => {
  if (!data || data.length === 0 || !lines || lines.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-50 rounded-lg" style={{ width, height }}>
        <span className="text-gray-500">No data available</span>
      </div>
    );
  }
  
  const allValues = lines.flatMap(line => data.map(d => d[line.key]));
  const maxY = Math.max(...allValues);
  const minY = Math.min(...allValues);
  const range = maxY - minY;
  
  return (
    <div className="space-y-4">
      {label && <h4 className="font-medium text-gray-700">{label}</h4>}
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {lines.map((line, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: line.color }}
            ></div>
            <span className="text-sm text-gray-600">{line.label}</span>
          </div>
        ))}
      </div>
      
      <svg width={width} height={height} className="border border-gray-200 rounded bg-white">
        {/* Grid */}
        <defs>
          <pattern id="multiGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#multiGrid)" />
        
        {/* Lines */}
        {lines.map((line, lineIndex) => {
          const points = data.map((point, index) => {
            const x = (index / (data.length - 1)) * (width - 80) + 40;
            const y = height - 40 - ((point[line.key] - minY) / range) * (height - 80);
            return `${x},${y}`;
          }).join(' ');
          
          return (
            <g key={lineIndex}>
              <polyline
                fill="none"
                stroke={line.color}
                strokeWidth="2"
                points={points}
                className="drop-shadow-sm"
              />
              {/* Data points */}
              {data.map((point, index) => {
                const x = (index / (data.length - 1)) * (width - 80) + 40;
                const y = height - 40 - ((point[line.key] - minY) / range) * (height - 80);
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3"
                    fill={line.color}
                    className="drop-shadow-sm hover:r-4 transition-all cursor-pointer"
                  />
                );
              })}
            </g>
          );
        })}
        
        {/* Axes */}
        <line x1="40" y1="20" x2="40" y2={height - 40} stroke="#6B7280" strokeWidth="1"/>
        <line x1="40" y1={height - 40} x2={width - 20} y2={height - 40} stroke="#6B7280" strokeWidth="1"/>
        
        {/* Y-axis labels */}
        <text x="5" y="25" className="text-xs fill-gray-600">{maxY.toFixed(1)}</text>
        <text x="5" y={height - 45} className="text-xs fill-gray-600">{minY.toFixed(1)}</text>
      </svg>
    </div>
  );
};

/**
 * Gauge Chart for real-time metrics display
 * Nielsen Heuristic 1: Visibility of System Status
 */
export const GaugeChart = ({ 
  value, 
  maxValue = 100, 
  label, 
  size = 200, 
  color = '#3B82F6',
  dangerThreshold = 80,
  warningThreshold = 60 
}) => {
  const percentage = (value / maxValue) * 100;
  const angle = (percentage / 100) * 180; // Half circle
  
  // Determine color based on thresholds
  let gaugeColor = color;
  if (percentage >= dangerThreshold) {
    gaugeColor = '#EF4444'; // Red
  } else if (percentage >= warningThreshold) {
    gaugeColor = '#F59E0B'; // Yellow
  } else {
    gaugeColor = '#10B981'; // Green
  }
  
  const radius = size * 0.35;
  const centerX = size / 2;
  const centerY = size * 0.55; // Adjusted to provide more space for text
  const svgHeight = size * 0.9; // Increased height to accommodate text
  
  // Calculate needle position
  const needleAngle = (angle - 90) * (Math.PI / 180);
  const needleX = centerX + radius * 0.8 * Math.cos(needleAngle);
  const needleY = centerY + radius * 0.8 * Math.sin(needleAngle);
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <svg width={size} height={svgHeight} className="">
        {/* Background arc */}
        <path
          d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="20"
        />
        
        {/* Progress arc */}
        <path
          d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius * Math.cos((angle - 90) * Math.PI / 180)} ${centerY + radius * Math.sin((angle - 90) * Math.PI / 180)}`}
          fill="none"
          stroke={gaugeColor}
          strokeWidth="20"
          strokeLinecap="round"
        />
        
        {/* Needle */}
        <line
          x1={centerX}
          y1={centerY}
          x2={needleX}
          y2={needleY}
          stroke="#374151"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Center dot */}
        <circle
          cx={centerX}
          cy={centerY}
          r="6"
          fill="#374151"
        />
        
        {/* Value text */}
        <text
          x={centerX}
          y={centerY + 30}
          textAnchor="middle"
          className="text-2xl font-bold fill-gray-800"
        >
          {value.toFixed(1)}
        </text>
        
        {/* Unit text */}
        <text
          x={centerX}
          y={centerY + 50}
          textAnchor="middle"
          className="text-sm fill-gray-600"
        >
          {label}
        </text>
      </svg>
    </div>
  );
};

/**
 * Area Chart for trend visualization
 * Nielsen Heuristic 8: Aesthetic and Minimalist Design
 */
export const AreaChart = ({ 
  data, 
  xKey, 
  yKey, 
  width = 600, 
  height = 200, 
  color = '#3B82F6',
  label = '' 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-50 rounded-lg" style={{ width, height }}>
        <span className="text-gray-500">No data available</span>
      </div>
    );
  }
  
  const maxY = Math.max(...data.map(d => d[yKey]));
  const minY = Math.min(...data.map(d => d[yKey]));
  const range = maxY - minY;
  
  // Create path for the area
  const pathPoints = data.map((point, index) => {
    const x = (index / (data.length - 1)) * (width - 80) + 40;
    const y = height - 40 - ((point[yKey] - minY) / range) * (height - 80);
    return `${x},${y}`;
  });
  
  const areaPath = `M 40,${height - 40} L ${pathPoints.join(' L ')} L ${width - 40},${height - 40} Z`;
  const linePath = `M ${pathPoints.join(' L ')}`;
  
  return (
    <div className="space-y-2">
      {label && <h4 className="font-medium text-gray-700">{label}</h4>}
      <svg width={width} height={height} className="border border-gray-200 rounded bg-white">
        {/* Grid */}
        <defs>
          <pattern id="areaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
          </pattern>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#areaGrid)" />
        
        {/* Area fill */}
        <path
          d={areaPath}
          fill="url(#areaGradient)"
        />
        
        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        
        {/* Data points */}
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * (width - 80) + 40;
          const y = height - 40 - ((point[yKey] - minY) / range) * (height - 80);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              className="drop-shadow-sm hover:r-4 transition-all cursor-pointer"
              title={`${point[xKey]}: ${formatValue(point[yKey], 'percentage')}`}
            />
          );
        })}
        
        {/* Axes */}
        <line x1="40" y1="20" x2="40" y2={height - 40} stroke="#6B7280" strokeWidth="1"/>
        <text x="5" y="25" className="text-xs fill-gray-600">{maxY.toFixed(1)}</text>
        <text x="5" y={height - 45} className="text-xs fill-gray-600">{minY.toFixed(1)}</text>
      </svg>
    </div>
  );
};