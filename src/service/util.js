const CryptoJS = require('crypto-js');

module.exports = {
  formatDuration: function (duration) {
    let hour = Math.floor(duration / 1000 / 3600);
    let min = Math.floor(duration / 1000 % 3600 / 60);
    let sec = Math.floor(duration / 1000 % 60);
    return (hour ? hour + ':' : '') + (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
  },

  decryptData: function (data, dynamic_AES_KEY) {
    const dynamicKeyMap = [7, 9, 11, 14, 17, 18, 22, 27];
    const staticKey = 'jE43uHy+';
    let dynamicKeyRaw = Array.prototype.slice.call(dynamic_AES_KEY);
    let dynamicKey = '';

    for (let i = 0; i < dynamicKeyMap.length; i++) {
      dynamicKey += dynamicKeyRaw[dynamicKeyMap[i]];
    }

    let key = CryptoJS.enc.Utf8.parse(dynamicKey + staticKey);
    let bytes = CryptoJS.AES.decrypt(data.toString(), key, {
      iv: key,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    let plaintext = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(plaintext);;
  }
}