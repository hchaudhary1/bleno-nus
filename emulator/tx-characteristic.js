const util = require('util');

const bleno = require('bleno-mac');

const BlenoCharacteristic = bleno.Characteristic;

const TxCharacteristic = function() {
  TxCharacteristic.super_.call(this, {
    uuid: '6E400002-B5A3-F393-E0A9-E50E24DCCA9E',
    properties: ['read', 'write', 'notify'],
    value: null
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(TxCharacteristic, BlenoCharacteristic);

TxCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('TxCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

TxCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('TxCharacteristic - onWriteRequest: value = ' + this._value.toString());

  if (this._updateValueCallback) {
    console.log('TxCharacteristic - onWriteRequest: notifying');
    
    this._updateValueCallback(Buffer.from('bleno: rx cmd', 'utf8'));
  }

  callback(this.RESULT_SUCCESS);
};

TxCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('TxCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

TxCharacteristic.prototype.onUnsubscribe = function() {
  console.log('TxCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = TxCharacteristic;