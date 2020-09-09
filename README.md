# bleno-nus


# install emulator on macbook -- Option A
npm i github:notjosh/bleno#inject-bindings

npm i github:notjosh/bleno-mac

npm i github:sandeepmistry/node-xpc-connection#pull/26/head

# install emulator on macbook -- Option B
npm install abandonware/bleno


## Usage
Simply require `bleno-mac` instead of `bleno`:
```javascript
const bleno = require('bleno-mac');
```
