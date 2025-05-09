// Konfiguracja autoryzacji GitHub dla Decap CMS
window.CMS_MANUAL_INIT = true;

// Inicjalizacja CMS z konfiguracją GitHub OAuth
window.decapCmsConfig = {
  // Ładowanie normalnej konfiguracji z config.yml
  config_file: 'config.yml',
  // Konfiguracja klienta GitHub OAuth
  auth_type: 'github',
  oauth_client_id: 'Ov23liV1qsqwtczR888m',
  load_config_file: true,
};

// Inicjalizacja CMS
window.addEventListener('load', function() {
  window.CMS.init(window.decapCmsConfig);
});
