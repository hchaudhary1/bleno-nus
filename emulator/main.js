const util = require('util');
var bleno = require('bleno-mac');
const BlenoPrimaryService = bleno.PrimaryService;

const BlenoCharacteristic = bleno.Characteristic;

var tx_hook = null;

const RxCharacteristic = function() {
  RxCharacteristic.super_.call(this, {
    uuid: '6E400003-B5A3-F393-E0A9-E50E24DCCA9E',
    properties: ['read', 'write', 'notify'],
    value: null
  });
};

util.inherits(RxCharacteristic, BlenoCharacteristic);

RxCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('RxCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

RxCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('RxCharacteristic - onSubscribe');

  tx_hook = updateValueCallback;
  tx_hook(Buffer.from('{"serial":123456}', 'utf8'));
};

RxCharacteristic.prototype.onUnsubscribe = function() {
  console.log('RxCharacteristic - onUnsubscribe');

  tx_hook = null;
};

const rx = new RxCharacteristic();




const TxCharacteristic = function() {
  TxCharacteristic.super_.call(this, {
    uuid: '6E400002-B5A3-F393-E0A9-E50E24DCCA9E',
    properties: ['read', 'write', 'notify'],
    value: null
  });
};

util.inherits(TxCharacteristic, BlenoCharacteristic);

TxCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('TxCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

TxCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('TxCharacteristic - onWriteRequest: value = ' + this._value.toString());

  if (tx_hook) {
    console.log('TxCharacteristic - onWriteRequest: notifying');
    
    tx_hook(Buffer.from('bleno: rx cmd', 'utf8'));
  }

  callback(this.RESULT_SUCCESS);
};

TxCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('TxCharacteristic - onSubscribe');

  //this._updateValueCallback = updateValueCallback;
};

TxCharacteristic.prototype.onUnsubscribe = function() {
  console.log('TxCharacteristic - onUnsubscribe');

  //this._updateValueCallback = null;
};



const tx = new TxCharacteristic();


console.log('bleno - nordic UART');



bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('IntelOb-XXXXXXXX', ['ec00']);
  } else {
    bleno.stopAdvertising();
  }
});



bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: '6E400001-B5A3-F393-E0A9-E50E24DCCA9E',
        characteristics: [rx, tx]
      })
    ]);
  }
});



bleno.on('disconnect', function(clientAddress) {
  console.log(`disconnect:i${clientAddress}`)
});






