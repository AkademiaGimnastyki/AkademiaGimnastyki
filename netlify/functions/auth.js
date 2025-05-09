// Funkcja Netlify dla autoryzacji GitHub OAuth
// Wykorzystujemy natywny fetch zamiast zależności zewnętrznych

// Sekrety aplikacji OAuth GitHub
const OAUTH_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Handler funkcji
exports.handler = async (event) => {
  // Szczegółowe logowanie dla diagnostyki
  console.log('Otrzymano żądanie autoryzacji:', { 
    httpMethod: event.httpMethod,
    path: event.path,
    headers: event.headers,
    queryParams: JSON.stringify(event.queryStringParameters || {}),
    hasCode: !!event.queryStringParameters?.code,
    hasClientId: !!OAUTH_CLIENT_ID,
    hasClientSecret: !!OAUTH_CLIENT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    hasUrl: !!process.env.URL
  });
  
  // Obsługa tylko żądań HTTP GET
  if (event.httpMethod !== 'GET') {
    console.error(`Nieprawidłowa metoda HTTP: ${event.httpMethod}`);
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  // Sprawdź czy mamy zmienne środowiskowe
  if (!OAUTH_CLIENT_ID || !OAUTH_CLIENT_SECRET) {
    console.error('Brak wymaganych zmiennych środowiskowych GITHUB_CLIENT_ID lub GITHUB_CLIENT_SECRET');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Błąd konfiguracji serwera. Brak wymaganych danych autoryzacyjnych.',
        details: {
          hasClientId: !!OAUTH_CLIENT_ID,
          hasClientSecret: !!OAUTH_CLIENT_SECRET
        }
      })
    };
  }

  // Pobierz kod z parametrów zapytania
  const code = event.queryStringParameters?.code;
  
  if (!code) {
    console.error('Brak kodu autoryzacyjnego w parametrach');
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Brak kodu autoryzacyjnego.',
        queryParams: event.queryStringParameters || {}
      })
    };
  }

  try {
    console.log('Wysyłanie żądania wymiany kodu na token do GitHub...');
    
    // Przygotuj dane do wymiany kodu na token
    const exchangeData = {
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET,
      code: code
    };
    
    console.log('Dane wymiany kodu na token:', {
      hasAllRequiredFields: !!(exchangeData.client_id && exchangeData.client_secret && exchangeData.code),
      codeLength: exchangeData.code?.length
    });
    
    // Wyślij żądanie do GitHub aby wymienić kod na token dostępu
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Decap-CMS-Auth-Function'
      },
      body: JSON.stringify(exchangeData)
    });

    // Sprawdź status odpowiedzi HTTP
    console.log('Status odpowiedzi GitHub:', {
      status: tokenResponse.status,
      statusText: tokenResponse.statusText,
      headers: Object.fromEntries([...tokenResponse.headers])
    });
    
    if (!tokenResponse.ok) {
      console.error(`Błąd HTTP podczas wymiany kodu: ${tokenResponse.status} ${tokenResponse.statusText}`);
      const errorText = await tokenResponse.text();
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Błąd podczas wymiany kodu na token',
          status: tokenResponse.status,
          details: errorText
        })
      };
    }

    // Przetwarzamy odpowiedź JSON
    let tokenData;
    try {
      tokenData = await tokenResponse.json();
    } catch (jsonError) {
      console.error('Błąd parsowania JSON z odpowiedzi GitHub:', jsonError);
      const rawResponse = await tokenResponse.text();
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Nieprawidłowy format odpowiedzi z GitHub',
          details: rawResponse.substring(0, 500) // Pokazujemy część odpowiedzi dla diagnostyki
        })
      };
    }
    
    console.log('Otrzymano odpowiedź od GitHub:', {
      hasAccessToken: !!tokenData.access_token,
      hasError: !!tokenData.error,
      tokenType: tokenData.token_type,
      responseKeys: Object.keys(tokenData)
    });
    
    if (tokenData.error) {
      console.error('Błąd zwrócony przez GitHub:', tokenData);
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Nieprawidłowa odpowiedź autoryzacyjna.',
          responseData: tokenData
        })
      };
    }
    
    // Przekieruj użytkownika do panelu administracyjnego CMS
    // Zawsze używaj process.env.URL - to jest gwarantowany poprawny adres publiczny strony
    const siteUrl = process.env.URL || 'https://akademia-gimnastyki-2025.windsurf.build';
    const token = tokenData.access_token;
    
    console.log('Szczegóły przekierowania:', {
      siteUrl: siteUrl,
      envUrl: process.env.URL,
      hasToken: !!token,
      tokenLength: token?.length
    });
    
    // Tworzymy URL przekierowania zgodny z dokumentacją Decap CMS
    // https://decapcms.org/docs/external-oauth-clients/
    const redirectUrl = `${siteUrl}/admin/#/callback?access_token=${token}&token_type=Bearer&provider=github`;
    
    console.log(`Przekierowuję do: ${redirectUrl}`);
    console.log('Headers:', { 'Location': redirectUrl, 'Cache-Control': 'no-cache, no-store, must-revalidate' });
    
    // Zwracamy odpowiedź z przekierowaniem i tokenem
    return {
      statusCode: 302,
      headers: {
        'Location': redirectUrl,
        'Cache-Control': 'no-cache, no-store, must-revalidate', // Zapobiegamy cachowaniu
        'Set-Cookie': `nf_jwt=${token}; Path=/; HttpOnly; Secure; SameSite=Strict` // Dodajemy token jako ciasteczko
      },
      body: `<html><body>Przekierowywanie do panelu CMS... <a href="${redirectUrl}">Kliknij tutaj, jeśli nie nastąpi automatycznie</a></body></html>`
    };
  } catch (error) {
    console.error('Błąd podczas autoryzacji GitHub:', error);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Wystąpił błąd podczas autoryzacji.',
        details: error.message || 'Nieznany błąd',
        stack: error.stack
      })
    };
  }
};
