"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Argument = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/* eslint-disable prettier/prettier */

/* eslint-disable @typescript-eslint/no-explicit-any */
var Argument = function Argument(event, value, data) {
  (0, _classCallCheck2["default"])(this, Argument);
  (0, _defineProperty2["default"])(this, "event", void 0);
  (0, _defineProperty2["default"])(this, "value", void 0);
  (0, _defineProperty2["default"])(this, "data", void 0);
  this.event = event;
  this.value = value;
  this.data = data;
};

exports.Argument = Argument;
var ipc = {
  OPEN_NEW_LOG: 'OPEN_NEW_LOG',
  READ_LOG_FILE: 'READ_LOG_FILE'
};
var eventTypes = {
  OPEN_PROCESSING_START: 'OPEN_PROCESSING_START',
  OPEN_PROCESSING_PROGRESS: 'OPEN_PROCESSING_PROGRESS',
  OPEN_PROCESSING_FINISHED: 'OPEN_PROCESSING_FINISHED'
};
var _default = {
  ipc: ipc,
  eventTypes: eventTypes,
  events: {
    startProcessing: function startProcessing(logPath) {
      return new Argument(eventTypes.OPEN_PROCESSING_START, logPath, null);
    },
    progress: function progress(value) {
      return new Argument(eventTypes.OPEN_PROCESSING_PROGRESS, value, null);
    },
    processingComplete: function processingComplete(logPath, metadata) {
      return new Argument(eventTypes.OPEN_PROCESSING_FINISHED, logPath, JSON.stringify(metadata));
    },
    debug: function debug(value) {
      return new Argument('DEBUG', value, null);
    }
  }
};
exports["default"] = _default;

