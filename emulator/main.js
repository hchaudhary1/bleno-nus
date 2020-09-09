const util = require('util');
var bleno = require('bleno-mac');
const BlenoPrimaryService = bleno.PrimaryService;

const BlenoCharacteristic = bleno.Characteristic;

var tx_hook = null;

const TX_To_Phone = function() {
  TX_To_Phone.super_.call(this, {
    uuid: '6E400003-B5A3-F393-E0A9-E50E24DCCA9E',
    properties: ['read', 'notify'],
    value: null
  });
};

util.inherits(TX_To_Phone, BlenoCharacteristic);

TX_To_Phone.prototype.onReadRequest = function(offset, callback) {
  console.log('TX_To_Phone - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

TX_To_Phone.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('TX_To_Phone - onSubscribe');

  tx_hook = updateValueCallback;
  tx_hook(Buffer.from('{"serial":123456}', 'utf8'));
};

TX_To_Phone.prototype.onUnsubscribe = function() {
  console.log('TX_To_Phone - onUnsubscribe');

  tx_hook = null;
};

const tx_object = new TX_To_Phone();




const RX_From_Phone = function() {
  RX_From_Phone.super_.call(this, {
    uuid: '6E400002-B5A3-F393-E0A9-E50E24DCCA9E',
    properties: ['write'],
    value: null
  });
};

util.inherits(RX_From_Phone, BlenoCharacteristic);

RX_From_Phone.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('RX_From_Phone - onWriteRequest: value = ' + this._value.toString());

  if (tx_hook) {
    console.log('RX_From_Phone - onWriteRequest: notifying');
    
    tx_hook(Buffer.from('bleno: rx cmd', 'utf8'));
  }

  callback(this.RESULT_SUCCESS);
};
const rx_object = new RX_From_Phone();





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
        characteristics: [tx_object, rx_object]
      })
    ]);
  }
});



bleno.on('disconnect', function(clientAddress) {
  console.log(`disconnect:i${clientAddress}`)
});






