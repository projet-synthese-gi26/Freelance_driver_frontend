// Test script to verify service fixes
const { profileService } = require('./src/service/profileService.ts');
const { addressService } = require('./src/service/addressService.ts');

async function testServices() {
  console.log('Testing services...');
  
  // Test with a sample user ID
  const userId = '1402edc6-af1f-4c28-9231-4303d3fb9ee4';
  
  try {
    console.log('Testing getPublicDriverProfile...');
    const profile = await profileService.getPublicDriverProfile(userId);
    console.log('Profile result:', profile ? 'Success' : 'Null (expected for 400/404)');
    
    console.log('Testing getDriverAddressesByUserId...');
    const addresses = await addressService.getDriverAddressesByUserId(userId);
    console.log('Addresses result:', addresses.length > 0 ? 'Success' : 'Empty array (expected for 400/404)');
    
    console.log('✅ All services handled errors gracefully');
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testServices();
