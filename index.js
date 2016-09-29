'use strict';

const pkg = require('./package.json');
const TelnetTalker = require('./telnetTalker');
const MudBot = require('./mudbot');
const mudBot = new MudBot();
const log = require('./logger')();
let telnetTalker;

function init(){
  log.info(`-------- App startup (${pkg.version}) --------`);
  telnetTalker = new TelnetTalker()
  addEventListeners();
}

let addEventListeners = function(){
  mudBot.on('receivedPMFromChat', msg => {
    telnetTalker.speakToMUD(msg)
    log.debug('Received PM from chat');
  });

  telnetTalker.on('receivedMessageFromMUD', msg => {
    mudBot.speakInCodeToChat(msg);
    log.debug('A MUD response has been PMed');
  });
}

init();
