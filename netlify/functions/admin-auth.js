// Funkcja pośrednicząca dla panelu administracyjnego
// Przekierowuje na stronę logowania z dołączonym client_id

exports.handler = async (event) => {
  // ID klienta pobierane z zmiennych środowiskowych, bezpiecznie
  const clientId = process.env.GITHUB_CLIENT_ID;
  
  // Przekierowanie na stronę admin z dołączonym client_id
  return {
    statusCode: 302,
    headers: {
      Location: `/admin/index.html?client_id=${clientId}`
    },
    body: ""
  };
};
