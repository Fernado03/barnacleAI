/**
 * Test for getUserInitials function
 * Run this in browser console or as a Node.js script to verify functionality
 */

import { getUserInitials, getUserDisplayName, getUserFullDisplayName } from '../utils/userUtils.js';

// Test data simulating different user scenarios
const testUsers = [
  // Test case 1: Fernando with fullName only
  {
    id: 'test1',
    fullName: 'Fernando Martinez',
    email: 'fernando@barnacle.com',
    role: 'Demo User'
  },
  
  // Test case 2: User with firstName and lastName
  {
    id: 'test2',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'john@barnacle.com',
    role: 'Administrator'
  },
  
  // Test case 3: User with backend-generated initials
  {
    id: 'test3',
    firstName: 'Maria',
    lastName: 'Garcia',
    fullName: 'Maria Garcia',
    initials: 'MG',
    email: 'maria@barnacle.com',
    role: 'Ship Captain'
  },
  
  // Test case 4: Single name user
  {
    id: 'test4',
    fullName: 'Leonardo',
    email: 'leonardo@barnacle.com',
    role: 'Fleet Operator'
  },
  
  // Test case 5: Email only user
  {
    id: 'test5',
    email: 'contact@barnacle.com',
    role: 'Demo User'
  },
  
  // Test case 6: Empty/null user
  null,
  
  // Test case 7: User with complex name
  {
    id: 'test7',
    fullName: 'Ana María González-López',
    email: 'ana@barnacle.com',
    role: 'Administrator'
  }
];

// Expected results
const expectedResults = [
  { initials: 'FM', displayName: 'Fernando', fullDisplayName: 'Fernando Martinez' },
  { initials: 'JD', displayName: 'John', fullDisplayName: 'John Doe' },
  { initials: 'MG', displayName: 'Maria', fullDisplayName: 'Maria Garcia' },
  { initials: 'LE', displayName: 'Leonardo', fullDisplayName: 'Leonardo' },
  { initials: 'CO', displayName: 'contact', fullDisplayName: 'contact' },
  { initials: 'U', displayName: 'User', fullDisplayName: 'User' },
  { initials: 'AG', displayName: 'Ana', fullDisplayName: 'Ana María González-López' }
];

// Run tests
console.log('🧪 Testing getUserInitials function...\n');

testUsers.forEach((user, index) => {
  const initials = getUserInitials(user);
  const displayName = getUserDisplayName(user);
  const fullDisplayName = getUserFullDisplayName(user);
  const expected = expectedResults[index];
  
  console.log(`Test ${index + 1}: ${user?.fullName || user?.email || 'null user'}`);
  console.log(`  Input:`, user);
  console.log(`  Initials: ${initials} (expected: ${expected.initials}) ${initials === expected.initials ? '✅' : '❌'}`);
  console.log(`  Display Name: ${displayName} (expected: ${expected.displayName}) ${displayName === expected.displayName ? '✅' : '❌'}`);
  console.log(`  Full Display Name: ${fullDisplayName} (expected: ${expected.fullDisplayName}) ${fullDisplayName === expected.fullDisplayName ? '✅' : '❌'}`);
  console.log('');
});

console.log('🎯 Fernando Test Case:');
const fernandoUser = {
  fullName: 'Fernando Martinez',
  email: 'fernando@barnacle.com',
  role: 'Demo User'
};

console.log(`Fernando's initials: ${getUserInitials(fernandoUser)} (should be 'FM')`);
console.log(`Fernando's display name: ${getUserDisplayName(fernandoUser)} (should be 'Fernando')`);

// Export for manual testing in browser console
if (typeof window !== 'undefined') {
  window.testUserInitials = () => {
    testUsers.forEach((user) => {
      const initials = getUserInitials(user);
      console.log(`${user?.fullName || user?.email || 'null'}: ${initials}`);
    });
  };
}