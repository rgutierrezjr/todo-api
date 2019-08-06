const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

/**
 * User schema declaration and constraints.
 */
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required. Please enter an email and try again.'],
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: props => `${props.value} is not a valid email. Please enter a valid email and try again.`
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required. Please enter a password and try again.'],
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

/**
 * Instance method: returns "this" as a JSON object.
 */
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

/**
 * Instance method: generates authentication token for "this" user.
 *
 * @returns {Promise|*|PromiseLike<T | never>|Promise<T | never>}
 */
UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens = user.tokens.concat({access, token});

    return user.save().then(() => {
        return token;
    });
};

/**
 * Instance method: removes (pulls) token from "this" User.
 * @param token
 * @return {*}
 */
UserSchema.methods.removeToken = function (token) {
  const user = this;

  return user.update({
     $pull: {
         tokens: {token}
     }
  });
};

/**
 * Static method: find User by token.
 * @param token
 * @return {*}
 */
UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

/**
 * Static method: find User by credentials.
 * @param email
 * @param password
 * @return {Promise}
 */
UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;

    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (error, result) => {
                if (result) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });

};

/**
 * Pre-save hook: re-salt password if modified.
 */
UserSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });

    } else {
        next();
    }
});

/**
 * Bind schema to model.
 * @type {Model}
 */
const User = mongoose.model('User', UserSchema);

module.exports = {User};