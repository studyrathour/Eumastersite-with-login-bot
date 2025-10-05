const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    // Get the userId from query parameters
    const { userId } = event.queryStringParameters;
    
    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, OPTIONS'
        },
        body: JSON.stringify({ 
          hasAccess: false, 
          message: 'UserId parameter is required' 
        })
      };
    }
    
    // Forward the request to the Telegram bot API
    const apiUrl = `https://competitive-karly-edumastersuraj-75acc2f2.koyeb.app/check-access?userId=${encodeURIComponent(userId)}`;
    
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
        hasAccess: false, 
        message: 'Internal server error: ' + error.message 
      })
    };
  }
};