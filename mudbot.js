'use strict';

const { debug, debugUser, botSlackId, slack } = require('./helpers/settings');
const EventEmitter = require('events').EventEmitter;
const Bot = require('slackbots');
const bot = new Bot(slack);
const log = require('./logger')();

class MudBot extends EventEmitter{

  constructor(){
    super();
    this.addEventListeners();
  }

  speakInCodeToChat(message){
    message = '```' + message + '```';
    bot.postMessageToUser(debugUser, message);
  }

  addEventListeners(){
    bot.on('message', msg => {
      if(msg.text && msg.type === 'message' && msg.username !== 'mudbot'){
        this.emit('receivedPMFromChat', msg.text);
      }
    });
  }
}

module.exports = MudBot;
