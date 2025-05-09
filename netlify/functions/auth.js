// Funkcja Netlify dla autoryzacji GitHub OAuth
const axios = require('axios');
const qs = require('querystring');

// Sekrety aplikacji OAuth GitHub
const OAUTH_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Handler funkcji
exports.handler = async (event) => {
  // Obsługa tylko żądań HTTP GET
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Pobierz kod z parametrów zapytania
  const code = event.queryStringParameters.code;
  
  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Brak kodu autoryzacyjnego.' })
    };
  }

  try {
    // Wyślij żądanie do GitHub aby wymienić kod na token dostępu
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://github.com/login/oauth/access_token',
      headers: {
        Accept: 'application/json'
      },
      data: {
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
        code: code
      }
    });

    // Przygotuj odpowiedź dla klienta
    const tokenData = tokenResponse.data;
    
    // Przekieruj użytkownika z powrotem do panelu administracyjnego
    // z tokenem jako parametr hash (bezpieczniejsze niż query string)
    return {
      statusCode: 302,
      headers: {
        Location: `/admin/#access_token=${tokenData.access_token}&token_type=bearer`
      },
      body: ''
    };
  } catch (error) {
    console.error('Błąd autoryzacji GitHub:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Wystąpił błąd podczas autoryzacji.',
        details: error.message
      })
    };
  }
};
