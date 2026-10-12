// Funkcja Netlify inicjująca bezpieczną autoryzację GitHub OAuth
// Nie ujawnia kluczy ani sekretów w kodzie klienta

exports.handler = async (event) => {
  // Rozszerzone logowanie dla diagnostyki
  console.log('Rozpoczynam proces autoryzacji GitHub...', {
    httpMethod: event.httpMethod,
    path: event.path,
    headers: event.headers,
    queryParams: event.queryStringParameters
  });
  
  // Pobieramy bezpiecznie Client ID z zmiennych środowiskowych
  const clientId = process.env.GITHUB_CLIENT_ID;
  
  // Logowanie zmiennych środowiskowych (bez ujawniania sekretów)
  console.log('Zmienne środowiskowe:', {
    hasClientId: !!clientId,
    hasClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    hasUrl: !!process.env.URL
  });
  
  if (!clientId) {
    console.error('Błąd: Brak skonfigurowanej zmiennej środowiskowej GITHUB_CLIENT_ID');
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Błąd konfiguracji. Brak wymaganych danych do autoryzacji.'
      })
    };
  }
  
  // Pobieramy URL serwera z zmiennych środowiskowych
  const siteUrl = process.env.URL || 'https://akademia-gimnastyki.pl';
  console.log(`Używam adresu strony: ${siteUrl}`);
  
  // Generujemy unikalny stan dla zabezpieczenia procesu OAuth (ochrona przed CSRF)
  const state = Math.random().toString(36).substring(2);
  
  // Określamy URL do autoryzacji GitHub z dynamicznym adresem zwrotnym
  // UWAGA: Upewnij się, że ten adres jest identyczny z tym, co skonfigurowałeś w GitHub OAuth App
  const redirectUri = `${siteUrl}/.netlify/functions/auth`;
  
  // Upewnij się, że zakres uprawnień jest minimalny, ale wystarczający
  const scope = 'repo'; // Ograniczamy do minimum wymaganych uprawnień
  
  console.log(`Ustawiam przekierowanie autoryzacji do: ${redirectUri}`);
  
  // Tworzymy URL autoryzacji z jawnie zakodowanym redirectUri
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
  
  console.log(`Przekierowuję użytkownika do: ${authUrl}`);
  
  // Przekierowujemy użytkownika do GitHub
  return {
    statusCode: 302,
    headers: {
      Location: authUrl,
      'Cache-Control': 'no-cache', // Ważne dla bezpieczeństwa
      'Content-Type': 'text/html'
    },
    body: `<html><body>Przekierowywanie do GitHub... Jeśli nie nastąpi automatycznie, <a href="${authUrl}">kliknij tutaj</a>.</body></html>`
  };
};
