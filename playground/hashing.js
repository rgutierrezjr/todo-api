const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '12345';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
       console.log(hash);
    });
});

var hashedPassword = '$2a$10$eZrW/GTWdCoWSTvBdwgGw.kt13sjM.l0T1mlChDbxCAngPUWtYkNG';

bcrypt.compare(password, hashedPassword, (error, result) => {
    console.log(result);
});