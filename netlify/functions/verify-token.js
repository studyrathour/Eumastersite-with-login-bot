// Netlify function to proxy token verification requests
exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Max-Age': '86400'
      },
      body: ''
    };
  }
  
  try {
    // Get the token from query parameters
    const { token } = event.queryStringParameters || {};
    
    if (!token) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          valid: false, 
          message: 'Token parameter is required' 
        })
      };
    }
    
    // Log the request for debugging
    console.log('Verifying token:', token);
    
    // Forward the request to the Telegram bot API
    const apiUrl = `https://competitive-karly-edumastersuraj-75acc2f2.koyeb.app/verify-token?token=${encodeURIComponent(token)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Netlify-Function-Proxy/1.0'
      }
    });
    
    // Get response data
    const data = await response.json();
    
    // Log the response for debugging
    console.log('Token verification response:', response.status, data);
    
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Token verification error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        valid: false, 
        message: 'Internal server error: ' + error.message 
      })
    };
  }
};