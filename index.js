'use strict';

const pkg = require('./package.json');
const MudBot = require('./mudbot');
const log = require('./logger')();
const { slackConfig } = require('./helpers/settings');

let mudBot;

function init(){
  if(!slackConfig.token) {
    log.error('Specify slackbot configuration in the environment');
    process.exit(1);
  }
  log.info(`-------- App started (v${pkg.version}) --------`);
  mudBot = new MudBot();
  mudBot.connectToSlack();
  mudBot.listenToUser();
}

init();
