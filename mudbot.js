'use strict';

const { mudInfo, debug, debugUser, botSlackId, slackConfig } = require('./helpers/settings');
const EventEmitter = require('events').EventEmitter;
const Bot = require('botkit');
const TelnetTalker = require('./telnetTalker');
const controller = Bot.slackbot();
const bot = controller.spawn(slackConfig)
const log = require('./logger')();
let telnetTalker;
const _ = require('lodash');
class MudBot extends EventEmitter{

  constructor(){
    super();
  }

  connect(){
    bot.startRTM( (err) => { if (err) throw new Error('Could not connect to Slack') });
  }

  listen(){
    controller.hears(['list', 'overview', 'available', 'muds'], 'direct_message', (bot, message) => {
      bot.reply(message, "Here's a list of all the available MUDs:");
      bot.reply(message, '- ' + this._getMudList().join('\n - '));
    });

    _.forEach(mudInfo, (mud) => {
      controller.hears([mud.name], 'direct_message', (bot, msg) => {
        this._initiateMud(mud.name, bot, msg);
      });
    });

    controller.on('direct_message', (bot, message) => {
      if (telnetTalker && telnetTalker.isConnected) {
        telnetTalker.speakToMUD(message.text);
      } else {
        bot.reply(message, "I didn't understand that. Please tell me what MUD to connect to first.");
      }
    });
  }

  _getMudList(){
    return mudInfo.map((mud) => { return mud.name; })
  }

  _initiateMud(mudName, bot, msg){
    bot.reply(msg, 'Initiating ' + mudName + '...');
    telnetTalker = new TelnetTalker(mudName);
    telnetTalker.connect();
    telnetTalker.listen();
    telnetTalker.on('messageFromServer', msgFromMud => {
      bot.reply(msg, '```' + msgFromMud + '```');
    });
  }

}

module.exports = MudBot;
