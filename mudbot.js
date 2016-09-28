'use strict';

const { debug, debugUser, botSlackId, slack } = require('./helpers/settings');
const EventEmitter = require('events').EventEmitter;
const Bot = require('slackbots');
const bot = new Bot(slack);
var buffer = '';

class MudBot extends EventEmitter{

  constructor(){
    super();
    this.addEventListeners();
  }

  speakInCodeToChat(message){
    message = '```' + message + '```';
    bot.postMessageToUser(debugUser, message);
    if (debug) console.log('Sent the following message to ${debugUser}:', message)
  }

  addEventListeners(){
    bot.on('message', msg => {
      if (debug) console.log('mudbot', msg)
      if(msg.text && msg.type === 'message' && msg.username !== 'mudbot'){
        this.emit('receivedPMFromChat', msg.text);
      }
    });
  }
}

module.exports = MudBot;
