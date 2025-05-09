// Funkcja Netlify inicjująca bezpieczną autoryzację GitHub OAuth
// Nie ujawnia kluczy ani sekretów w kodzie klienta

exports.handler = async (event) => {
  console.log('Rozpoczynam proces autoryzacji GitHub...');
  
  // Pobieramy bezpiecznie Client ID z zmiennych środowiskowych
  const clientId = process.env.GITHUB_CLIENT_ID;
  
  if (!clientId) {
    console.error('Błąd: Brak skonfigurowanej zmiennej środowiskowej GITHUB_CLIENT_ID');
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Błąd konfiguracji. Brak wymaganych danych do autoryzacji.'
      })
    };
  } else {
    console.log('Znaleziono GITHUB_CLIENT_ID w zmiennych środowiskowych');
  }
  
  // Pobieramy URL serwera z zmiennych środowiskowych
  const siteUrl = process.env.URL || 'https://akademia-gimnastyki-2025.windsurf.build';
  console.log(`Używam adresu strony: ${siteUrl}`);
  
  // Generujemy unikalny stan dla zabezpieczenia procesu OAuth (ochrona przed CSRF)
  const state = Math.random().toString(36).substring(2);
  
  // Określamy URL do autoryzacji GitHub z dynamicznym adresem zwrotnym
  const redirectUri = `${siteUrl}/.netlify/functions/auth`;
  const scope = 'repo,user'; // Dostęp do repozytorium i informacji o użytkowniku
  
  console.log(`Ustawiam przekierowanie autoryzacji do: ${redirectUri}`);
  
  // Tworzymy URL autoryzacji
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
  
  console.log(`Przekierowuję użytkownika do: ${authUrl}`);
  
  // Przekierowujemy użytkownika do GitHub
  return {
    statusCode: 302,
    headers: {
      Location: authUrl,
      'Cache-Control': 'no-cache' // Ważne dla bezpieczeństwa
    },
    body: ''
  };
};
