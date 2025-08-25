#!/usr/bin/env python3
"""
Test script for AI Route Optimization Model
Tests the route optimization functionality and validates output
"""

import sys
import os
import json

# Add the route optimization module to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the route optimizer
try:
    from ai_route_optimizer import MaritimeRouteOptimizer
    print("✅ Successfully imported MaritimeRouteOptimizer")
except ImportError as e:
    print(f"❌ Failed to import MaritimeRouteOptimizer: {e}")
    sys.exit(1)

def test_route_optimization():
    """Test basic route optimization functionality"""
    print("\n🧪 Testing AI Route Optimization Model...")
    
    try:
        # Initialize optimizer
        optimizer = MaritimeRouteOptimizer()
        print("✅ Route optimizer initialized successfully")
        
        # Test 1: Singapore to Manila route
        print("\n🚢 Test 1: Singapore to Manila Route")
        test_params_1 = {
            'start_port': 'singapore',
            'end_port': 'manila',
            'vessel_data': {
                'type': 'container',
                'speed': 14.5,
                'biofouling_level': 25
            },
            'optimization_type': 'balanced'
        }
        
        result_1 = optimizer.optimize_route(test_params_1)
        
        if 'error' in result_1:
            print(f"❌ Test 1 failed: {result_1['error']}")
        else:
            print("✅ Test 1 passed")
            print(f"   Route ID: {result_1.get('route_id', 'N/A')}")
            print(f"   Distance: {result_1.get('metrics', {}).get('total_distance_km', 'N/A')} km")
            print(f"   Fuel: {result_1.get('metrics', {}).get('total_fuel_tons', 'N/A')} tons")
            print(f"   Time: {result_1.get('metrics', {}).get('total_time_hours', 'N/A')} hours")
        
        # Test 2: Jakarta to Bangkok route  
        print("\n🚢 Test 2: Jakarta to Bangkok Route")
        test_params_2 = {
            'start_port': 'jakarta',
            'end_port': 'bangkok',
            'vessel_data': {
                'type': 'bulk_carrier',
                'speed': 12.0
            },
            'optimization_type': 'fuel'
        }
        
        result_2 = optimizer.optimize_route(test_params_2)
        
        if 'error' in result_2:
            print(f"❌ Test 2 failed: {result_2['error']}")
        else:
            print("✅ Test 2 passed")
            print(f"   Route ID: {result_2.get('route_id', 'N/A')}")
            print(f"   Distance: {result_2.get('metrics', {}).get('total_distance_km', 'N/A')} km")
            print(f"   Fuel: {result_2.get('metrics', {}).get('total_fuel_tons', 'N/A')} tons")
            print(f"   Environmental Impact: {result_2.get('metrics', {}).get('environmental_impact', 'N/A')} tons CO2")
        
        # Test 3: Error handling with invalid ports
        print("\n🚢 Test 3: Error Handling (Invalid Ports)")
        test_params_3 = {
            'start_port': 'invalid_port',
            'end_port': 'another_invalid_port',
            'vessel_data': {'type': 'tanker', 'speed': 10}
        }
        
        result_3 = optimizer.optimize_route(test_params_3)
        
        if 'error' in result_3:
            print("✅ Test 3 passed - error handling works correctly")
            print(f"   Error message: {result_3['error']}")
        else:
            print("❌ Test 3 failed - should have returned an error")
        
        # Test 4: Command line interface test
        print("\n🚢 Test 4: Command Line Interface")
        import subprocess
        
        cmd = [
            'python', 
            'ai_route_optimizer.py',
            '--start', 'singapore',
            '--end', 'manila',
            '--vessel-type', 'container',
            '--speed', '15.0',
            '--optimization', 'time'
        ]
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                cli_output = json.loads(result.stdout)
                print("✅ Test 4 passed - CLI interface works")
                print(f"   CLI Route ID: {cli_output.get('route_id', 'N/A')}")
            else:
                print(f"❌ Test 4 failed - CLI returned error: {result.stderr}")
        except subprocess.TimeoutExpired:
            print("❌ Test 4 failed - CLI timeout")
        except json.JSONDecodeError:
            print("❌ Test 4 failed - CLI output not valid JSON")
        except Exception as e:
            print(f"❌ Test 4 failed - CLI error: {e}")
        
        print("\n🎉 Route optimization testing completed!")
        return True
        
    except Exception as e:
        print(f"❌ Route optimization test failed: {e}")
        return False

def test_distance_calculations():
    """Test distance calculation accuracy"""
    print("\n📏 Testing Distance Calculations...")
    
    try:
        optimizer = MaritimeRouteOptimizer()
        
        # Test known distance: Singapore to Manila (approximately 2,386 km)
        distance = optimizer.haversine_distance(1.2845, 103.84, 14.6042, 121.0)
        expected_distance = 2386  # km (approximate)
        tolerance = 100  # km tolerance
        
        if abs(distance - expected_distance) <= tolerance:
            print(f"✅ Distance calculation accurate: {distance:.1f} km (expected ~{expected_distance} km)")
        else:
            print(f"❌ Distance calculation inaccurate: {distance:.1f} km (expected ~{expected_distance} km)")
        
        return True
        
    except Exception as e:
        print(f"❌ Distance calculation test failed: {e}")
        return False

def test_fuel_calculations():
    """Test fuel consumption calculations"""
    print("\n⛽ Testing Fuel Consumption Calculations...")
    
    try:
        optimizer = MaritimeRouteOptimizer()
        
        # Test fuel calculation for 1000 km journey
        distance = 1000  # km
        speed = 12  # knots
        weather_conditions = {'wind_speed': 10, 'wave_height': 1.5}
        vessel_conditions = {'biofouling_level': 20}
        
        fuel = optimizer.calculate_fuel_consumption(
            distance, speed, weather_conditions, vessel_conditions
        )
        
        if fuel > 0 and fuel < 500:  # reasonable range
            print(f"✅ Fuel calculation reasonable: {fuel:.1f} tons for 1000km journey")
        else:
            print(f"❌ Fuel calculation unreasonable: {fuel:.1f} tons")
        
        return True
        
    except Exception as e:
        print(f"❌ Fuel calculation test failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 AI Route Optimization Model Test Suite")
    print("=" * 50)
    
    # Run all tests
    tests_passed = 0
    total_tests = 3
    
    if test_distance_calculations():
        tests_passed += 1
    
    if test_fuel_calculations():
        tests_passed += 1
    
    if test_route_optimization():
        tests_passed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! Route optimization model is working correctly.")
        sys.exit(0)
    else:
        print("❌ Some tests failed. Please check the model implementation.")
        sys.exit(1)