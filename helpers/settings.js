const settings = {
  logLevel: 'debug',
  debugUser: 'phill',
  server: 'geas.de',
  port: '3333',
  botSlackId: '<@U2G1GPJ8Y>',
  messageTimeout: 200, //ms
  slack: {
    token: process.env.SLACKBOT_TOKEN,
    name: 'mudbot'
  }
};

module.exports = settings;
