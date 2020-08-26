const util = require('util');

const bleno = require('bleno-mac');

const BlenoCharacteristic = bleno.Characteristic;

const RxCharacteristic = function() {
  RxCharacteristic.super_.call(this, {
    uuid: '6E400003-B5A3-F393-E0A9-E50E24DCCA9E',
    properties: ['read', 'write', 'notify'],
    value: null
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(RxCharacteristic, BlenoCharacteristic);

RxCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('RxCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

RxCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('RxCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

RxCharacteristic.prototype.onUnsubscribe = function() {
  console.log('RxCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = RxCharacteristic;