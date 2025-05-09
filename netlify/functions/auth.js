// Funkcja Netlify dla autoryzacji GitHub OAuth
// Wykorzystujemy natywny fetch zamiast zależności zewnętrznych

// Sekrety aplikacji OAuth GitHub
const OAUTH_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Handler funkcji
exports.handler = async (event) => {
  // Więcej logowania dla debugowania
  console.log('Otrzymano żądanie autoryzacji:', { 
    httpMethod: event.httpMethod,
    hasCode: !!event.queryStringParameters?.code,
    hasClientId: !!OAUTH_CLIENT_ID,
    hasClientSecret: !!OAUTH_CLIENT_SECRET
  });
  
  // Obsługa tylko żądań HTTP GET
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Sprawdź czy mamy zmienne środowiskowe
  if (!OAUTH_CLIENT_ID || !OAUTH_CLIENT_SECRET) {
    console.error('Brak wymaganych zmiennych środowiskowych GITHUB_CLIENT_ID lub GITHUB_CLIENT_SECRET');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Błąd konfiguracji serwera. Brak wymaganych danych autoryzacyjnych.' })
    };
  }

  // Pobierz kod z parametrów zapytania
  const code = event.queryStringParameters?.code;
  
  if (!code) {
    console.error('Brak kodu autoryzacyjnego w parametrach');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Brak kodu autoryzacyjnego.' })
    };
  }

  try {
    console.log('Wysyłanie żądania wymiany kodu na token do GitHub...');
    // Wyślij żądanie do GitHub aby wymienić kod na token dostępu
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
    
    console.log('Otrzymano odpowiedź od GitHub:', {
      hasAccessToken: !!tokenData.access_token,
      hasError: !!tokenData.error
    });
    
    if (tokenData.error) {
      console.error('Błąd zwrócony przez GitHub:', tokenData);
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'GitHub odrzucił autoryzację',
          details: tokenData.error_description || tokenData.error
        })
      };
    }
    
    if (!tokenData.access_token) {
      console.error('Brak tokena w odpowiedzi GitHub:', tokenData);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Nieprawidłowa odpowiedź autoryzacyjna.' })
      };
    }
    
    // Przekieruj użytkownika do panelu administracyjnego CMS
    // Decap CMS oczekuje tokena w różnych formatach, spróbujmy kilku wariantów
    const siteUrl = process.env.URL || 'https://akademia-gimnastyki-2025.windsurf.build';
    
    // Dodajemy różne formaty tokena, aby zwiększyć szanse na poprawne działanie
    const token = tokenData.access_token;
    
    console.log(`Przekierowuję do: ${siteUrl}/admin/ z tokenem dostępu`);
    
    // Format #1: Standardowy format z hash fragmentem
    return {
      statusCode: 302,
      headers: {
        'Location': `${siteUrl}/admin/#access_token=${token}&token_type=Bearer`,
        'Cache-Control': 'no-cache', // Zapobiegamy cachowaniu przekierowania
        'Set-Cookie': `nf_jwt=${token}; Path=/; HttpOnly; Secure; SameSite=Strict` // Dodajemy token jako ciasteczko
      },
      body: ''
    };
  } catch (error) {
    console.error('Błąd podczas autoryzacji GitHub:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Wystąpił błąd podczas autoryzacji.',
        details: error.message || 'Nieznany błąd'
      })
    };
  }
};
