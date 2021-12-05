(() => {
  // Remove JS message
  document.getElementById('noJS').remove();

  const obs = new OBSWebSocket();
  obs.connect({
    address:  'localhost',
    password: ''
  });
})();
