var bleno = require('bleno-mac');
const BlenoPrimaryService = bleno.PrimaryService;

const RxCharacteristic = require('./rx-characteristic');
const TxCharacteristic = require('./tx-characteristic')

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
    const tx = new TxCharacteristic();
    const rx = new RxCharacteristic();
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