'use strict';
const { mudInfo, messageTimeout, debugging } = require('./helpers/settings');
const net = require('net');
const EventEmitter = require('events').EventEmitter;
const TelnetInput = require('telnet-stream').TelnetInput;
const TelnetOutput = require('telnet-stream').TelnetOutput;
const log = require('./logger')();
const _ = require('lodash');
const ctrlx = '\x03'

class TelnetTalker extends EventEmitter{
  constructor(name){
    super();
    this.mudName = name;
    this.telnetInput = new TelnetInput();
    this.telnetOutput = new TelnetOutput();
  }

  connect(){
    let currentMud = _.find(mudInfo, i => { return i.name === this.mudName; });
    this.socket = net.createConnection(currentMud.port, currentMud.server)
      .setKeepAlive(true)
      .setNoDelay(true)
      .setEncoding('utf8')
    process.stdin.pipe(this.telnetOutput).pipe(this.socket);
    log.debug('Connected to MUD ' + currentMud.server + ':' + currentMud.port);
  }

  disconnect(){
    let currentMud = _.find(mudInfo, i => { return i.name === this.mudName; });
    this.telnetOutput.write(ctrlx)
    log.debug('Disconnected from MUD ' + currentMud.server + ':' + currentMud.port);
  }

  speakToMUD(message){
    this.telnetOutput.write(message + '\n')
  }

  listen(){
    let buffer = '';
    this.socket.on('data', chunk => {
      buffer += chunk
      setTimeout( () => {
        // send a message UP to mudbot somehow (maybe with event)
        this.emit('messageFromServer', buffer);
      }, messageTimeout);
    });
  }

}

module.exports = TelnetTalker;
