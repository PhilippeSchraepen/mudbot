'use strict';
const { logLevel } = require('./helpers/settings');
const winston = require('winston');

module.exports = function logger() {
  const tsFormat = () => (new Date()).toLocaleTimeString();
  const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        timestamp: tsFormat,
        colorize: true,
      })
    ]
  });
  logger.level = logLevel;
  return logger;
};
