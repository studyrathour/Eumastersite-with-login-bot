// Use the built-in fetch instead of node-fetch for Netlify functions
exports.handler = async (event, context) => {
  try {
    // Get the token from query parameters
    const { token } = event.queryStringParameters;
    
    if (!token) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, OPTIONS'
        },
        body: JSON.stringify({ 
          valid: false, 
          message: 'Token parameter is required' 
        })
      };
    }
    
    // Forward the request to the Telegram bot API
    const apiUrl = `https://competitive-karly-edumastersuraj-75acc2f2.koyeb.app/verify-token?token=${encodeURIComponent(token)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow CORS
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({ 
        valid: false, 
        message: 'Internal server error: ' + error.message 
      })
    };
  }
};