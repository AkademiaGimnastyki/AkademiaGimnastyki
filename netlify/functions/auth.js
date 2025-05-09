// Funkcja Netlify dla autoryzacji GitHub OAuth
// Wykorzystujemy natywny fetch zamiast zależności zewnętrznych

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
    // Używamy natywnego fetch zamiast axios
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
        code: code
      })
    });

    // Przetwarzamy odpowiedź JSON
    const tokenData = await tokenResponse.json();
    
    // Przekieruj użytkownika z powrotem do panelu administracyjnego
    // z tokenem jako parametr hash (bezpieczniejsze niż query string)
    return {
      statusCode: 302,
      headers: {
        'Location': `/admin/#access_token=${tokenData.access_token}&token_type=bearer`,
        'Cache-Control': 'no-cache' // Zapobiegamy cachowaniu przekierowania
      },
      body: ''
    };
  } catch (error) {
    console.error('Błąd autoryzacji GitHub:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Wystąpił błąd podczas autoryzacji.',
        details: error.message || 'Nieznany błąd'
      })
    };
  }
};
