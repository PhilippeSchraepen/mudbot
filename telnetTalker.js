'use strict';
const { server, port, messageTimeout, debugging } = require('./helpers/settings');
const net = require('net');
const EventEmitter = require('events').EventEmitter;
const TelnetInput = require('telnet-stream').TelnetInput;
const TelnetOutput = require('telnet-stream').TelnetOutput;
const log = require('./logger')();

class TelnetTalker extends EventEmitter{
  constructor(){
    super();
    this.telnetInput = new TelnetInput();
    this.telnetOutput = new TelnetOutput();
    this.connect();
    this.addEventListeners();
  }

  connect(){
    this.socket = net.createConnection(port, server)
      .setKeepAlive(true)
      .setNoDelay(true)
      .setEncoding('utf8')
    process.stdin.pipe(this.telnetOutput).pipe(this.socket);
    log.debug('Connected to MUD ' + server + ':' + port);
  }

  speakToMUD(message){
    this.telnetOutput.write(message + '\n')
  }

  addEventListeners(){
    let buffer = '';
    this.socket.on('data', chunk => {
      buffer += chunk
      setTimeout( () => {
        this.emit('receivedMessageFromMUD', buffer);
      }, messageTimeout);
    });
  }

}

module.exports = TelnetTalker;
