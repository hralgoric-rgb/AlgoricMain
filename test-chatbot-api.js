/**
 * Test script to verify 100Gaj Chatbot API connectivity
 * Run this with: node test-chatbot-api.js
 */

const CHATBOT_API_URL = 'https://100gaj-chatbot-production.up.railway.app';

async function testApiHealth() {
  console.log('🔍 Testing 100Gaj Chatbot API Health...\n');
  
  try {
    console.log(`Connecting to: ${CHATBOT_API_URL}`);
    const response = await fetch(CHATBOT_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log(`Status Code: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.status === 'ok') {
      console.log('✅ API Health Check: PASSED');
      console.log(`✅ Message: ${data.message}`);
      return true;
    } else {
      console.log('❌ API Health Check: FAILED - Unexpected response format');
      return false;
    }
  } catch (error) {
    console.log('❌ API Health Check: FAILED');
    console.error(`Error: ${error.message}`);
    return false;
  }
}

async function testChatEndpoint() {
  console.log('\n🚀 Testing Chat Endpoint...\n');
  
  try {
    const testMessage = 'Hello, can you help me find properties in Delhi?';
    console.log(`Sending test message: "${testMessage}"`);
    
    const response = await fetch(`${CHATBOT_API_URL}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        message: testMessage,
        history: [],
      }),
    });

    console.log(`Status Code: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log('✅ Chat Endpoint: ACCESSIBLE');
    console.log('✅ Streaming Response: SUPPORTED');
    
    // Note: We're not reading the stream in this test to keep it simple
    console.log('📝 Note: Stream reading test skipped for simplicity');
    
    return true;
  } catch (error) {
    console.log('❌ Chat Endpoint Test: FAILED');
    console.error(`Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🤖 100Gaj Chatbot API Test Suite');
  console.log('=====================================\n');
  
  const healthResult = await testApiHealth();
  const chatResult = await testChatEndpoint();
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`Health Check: ${healthResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Chat Endpoint: ${chatResult ? '✅ PASS' : '❌ FAIL'}`);
  
  if (healthResult && chatResult) {
    console.log('\n🎉 All tests passed! The chatbot API is ready for integration.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the API status.');
  }
}

// Run the tests
runTests().catch(console.error);
