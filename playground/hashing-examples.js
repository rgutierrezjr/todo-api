const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

var token = jwt.sign(data, 'salt1234');

console.log(token);

var decoded = jwt.verify(token, 'salt1234');

console.log(decoded);

// var message = 'this is a message';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };
//
// // somescret is the "salt". this would live on the sever.
//
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + "somesecret").toString()
// }
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed, dont trust');
// }