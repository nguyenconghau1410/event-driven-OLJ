// env.js (in /src/assets)
(function (window) {
  window.env = window.env || {};
  window.env.BASE_URL = "${BASE_URL}";
  window.env.BROKER_URL = "${BROKER_URL}";
  window.env.SECRET_KEY = "${SECRET_KEY}";
  window.env.DOMAIN_NAME = "${DOMAIN_NAME}";
})(this);
