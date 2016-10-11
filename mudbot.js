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
const CR = '\n'
class MudBot extends EventEmitter{

  constructor(){
    super();
    if(!slackConfig.token) {
      log.error('Specify slackbot token in the environment');
      process.exit(1);
    }
  }

  connect(){
    bot.startRTM( (err) => { if (err) throw new Error('Could not connect to Slack') });
  }

  listen(){
    controller.hears(['list', 'overview', 'available', 'muds'], 'direct_message', (bot, message) => {
      bot.reply(message, "Here's a list of all the available MUDs:");
      bot.reply(message, this._getMudList());
    });

    _.forEach(mudInfo, (mud) => {
      controller.hears([mud.name], 'direct_message', (bot, msg) => {
        if(!telnetTalker){
          bot.startConversation(msg, (err, convo) => {
            if(telnetTalker) {
              convo.ask(`Do you want to disconnect from ${mud.name} first?`, [
                {
                  pattern: bot.utterances.yes,
                  callback: (response, convo) => {
                    this._disconnectMud()
                    convo.next();
                  }
                },
                {
                  pattern: bot.utterances.no,
                  callback: (response, convo) => {
                    convo.say('Ok then silly, just keep playing.')
                    convo.next()
                  }
                },
                {
                  default: true,
                  callback: (response, convo) => {
                    // repeat the question
                    convo.repeat();
                    convo.next();
                  }
                }
              ]);
              return
            }
            convo.ask(`Do you want to play ${mud.name}?`, [
              {
                pattern: bot.utterances.yes,
                callback: (response, convo) => {
                  this._initiateMud(mud.name, bot, msg);
                  convo.next();
                }
              },
              {
                pattern: bot.utterances.no,
                callback: (response, convo) => {
                  convo.say('Perhaps later.')
                  convo.next()
                }
              },
              {
                default: true,
                callback: (response, convo) => {
                  // repeat the question
                  convo.repeat();
                  convo.next();
                }
              }
            ]);
          });
        }
      });
    });

    // Once a user is connected to a mud he can still control the mudbot by typing a capped command eg. [command]
    // This way he has more freedom to type anything he likes in the MUD without interfering with the mudbot itself.
    controller.hears(['\\[(.*)\\]'], 'direct_message', (bot,msg) => {
      if(telnetTalker){
        switch(msg.match[1].toLowerCase()){
          case 'enter':
            this._sendCarriageReturnToMud();
            break;
          case 'disconnect':
            this._disconnectMud(bot, msg);
            break;
        }
        return
      }
      this._notYetConnectedMessage(bot, msg)
    });

    controller.on('direct_message', (bot, message) => {
      if (telnetTalker) {
        telnetTalker.speakToMUD(message.text);
        return
      }
      this._notYetConnectedMessage(bot, message)
    });
  }

  _sendCarriageReturnToMud(){
    telnetTalker.speakToMUD(CR)
  }

  _disconnectMud(bot, msg){
    if(telnetTalker){
      telnetTalker.disconnect();
      telnetTalker = undefined;
      bot.reply(msg, `Disconnected from ${this.mudName}`)
      return
    }
    this._notYetConnectedMessage(bot, msg)
  }

  _getMudList(){
    let muds = mudInfo.map((mud) => { return mud.name; });
    return '- ' + muds.join('\n - ');
  }

  _initiateMud(mudName, bot, msg){
    this.mudName = mudName;
    bot.reply(msg, 'Initiating ' + this.mudName + '...');
    telnetTalker = new TelnetTalker(this.mudName);
    telnetTalker.connect();
    telnetTalker.listen();
    telnetTalker.on('messageFromServer', msgFromMud => {
			bot.reply(msg, this._wrapInCodeBlock(msgFromMud));
    });
  }

	_wrapInCodeBlock(message){
		return '```' + message + '```'
	}

  _notYetConnectedMessage(bot, msg){
    bot.reply(msg, "You're not connected to any MUD yet!")
  }

}

module.exports = MudBot;
