var mercurius = {};

mercurius.connector = {
  FacebookConnector: require('./src/connector/facebook_connector'),
  MercuriusConnector: require('./src/connector/mercurius_connector'),
}

mercurius.Bot = require('./src/core/bot');

module.exports = mercurius;