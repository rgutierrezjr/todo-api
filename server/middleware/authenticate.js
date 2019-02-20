const {User} = require('./../models/user');

const authenticate = (req, res, next) => {
    const token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        req.user = user;
        req.token = token;
        next(); // call next to continue to route.
    }).catch((e) => {
        res.status(401).send();
    });
};

module.exports = {authenticate};