// Funkcja Netlify iniciująca bezpieczną autoryzację GitHub OAuth
// Nie ujawnia kluczy ani sekretów w kodzie klienta

exports.handler = async (event) => {
  // Pobieramy bezpiecznie Client ID z zmiennych środowiskowych
  const clientId = process.env.GITHUB_CLIENT_ID;
  
  if (!clientId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Brak skonfigurowanej zmiennej środowiskowej GITHUB_CLIENT_ID'
      })
    };
  }
  
  // Generujemy unikalny stan dla zabezpieczenia procesu OAuth (ochrona przed CSRF)
  const state = Math.random().toString(36).substring(2);
  
  // Tworzymy URL do autoryzacji GitHub z wykorzystaniem standardowego endpointu Netlify
  // KLUCZOWE: używamy standardowego adresu zwrotnego z Netlify - https://api.netlify.com/auth/done
  const redirectUri = 'https://api.netlify.com/auth/done';
  const scope = 'repo'; // Dostęp do repozytorium
  
  // Adres naszej strony, do której chcemy wrócić po autoryzacji
  const siteUrl = process.env.URL || 'https://akademia-gimnastyki-2025.windsurf.build';
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}&site_id=${encodeURIComponent(siteUrl)}`;
  
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
