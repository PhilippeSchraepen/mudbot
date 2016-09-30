const settings = {
  logLevel: 'debug',
  debugUser: 'phill',
  botSlackId: '<@U2G1GPJ8Y>',
  messageTimeout: 200, //ms
  mudInfo: [
    {
      name: 'Geas',
      server: 'geas.de',
      port: '3333'
    },
    {
      name: 'Avalon',
      server: 'avalon-rpg.com',
      port: '23'
    }
  ],
  slackConfig: {
    token: process.env.SLACKBOT_TOKEN,
    debug: false
  }
};

module.exports = settings;
