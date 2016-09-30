'use strict';

const pkg = require('./package.json');
const MudBot = require('./mudbot');
const log = require('./logger')();
let mudBot;

function init(){
  log.info(`-------- App started (v${pkg.version}) --------`);
  mudBot = new MudBot();
  mudBot.connect();
  mudBot.listen();
}

init();
