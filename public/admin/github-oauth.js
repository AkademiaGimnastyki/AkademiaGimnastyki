// Konfiguracja autoryzacji GitHub dla Decap CMS
window.CMS_MANUAL_INIT = true;

// Inicjalizacja CMS z konfiguracją GitHub OAuth
window.decapCmsConfig = {
  // Ładowanie normalnej konfiguracji z config.yml
  config_file: 'config.yml',
  // Konfiguracja klienta GitHub OAuth
  backend: {
    name: 'github',
    repo: 'AkademiaGimnastyki/AkademiaGimnastyki',
    branch: 'test2',
    auth_type: 'implicit',
    app_id: 'Ov23liV1qsqwtczR888m',
    auth_endpoint: 'https://github.com/login/oauth/authorize',
  },
  load_config_file: true,
  local_backend: false,
  publish_mode: 'editorial_workflow',
  media_folder: 'public/images/uploads',
  public_folder: '/images/uploads',
  // Debugowanie
  debug: true
};

// Obsługa błędów
window.onerror = function(message, source, lineno, colno, error) {
  console.error('CMS Error:', message, error);
  document.getElementById('cms-loading').innerHTML = `
    <h2>Wystąpił problem z ładowaniem CMS</h2>
    <p>Szczegóły błędu: ${message}</p>
    <p>Spróbuj odświeżyć stronę lub sprawdź konsolę deweloperską.</p>
  `;
  return true;
};

// Inicjalizacja CMS
window.addEventListener('load', function() {
  console.log('Inicjalizacja Decap CMS...');
  try {
    window.CMS.init(window.decapCmsConfig);
  } catch (e) {
    console.error('Błąd podczas inicjalizacji CMS:', e);
    document.getElementById('cms-loading').innerHTML = `
      <h2>Wystąpił problem z inicjalizacją CMS</h2>
      <p>Szczegóły błędu: ${e.message}</p>
    `;
  }
});
