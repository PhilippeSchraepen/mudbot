'use strict';

const TelnetTalker = require('./telnetTalker');
const MudBot = require('./mudbot');
const mudBot = new MudBot();
const telnetTalker = new TelnetTalker();

function init(){
  telnetTalker.connect();
}

mudBot.on('receivedPMFromChat', msg => {
  telnetTalker.speakToMUD(msg)
});

telnetTalker.on('receivedMessageFromMUD', msg => {
  mudBot.speakInCodeToChat(msg);
});

init();
