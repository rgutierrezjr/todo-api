require('./config/config');


const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.json());

/**
 * Route: POST Todo
 */
app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }).catch((e) => {
        res.status(400).send();
    });;
});

/**
 * Route: GET Todo
 */
app.get('/todos', authenticate, (req, res) => {
   Todo.find({
       _creator: req.user._id
   }).then((todos) => {
       res.send({todos})
   }, (e) => {
        res.status(400).send(e);
   });
});

/**
 * Route: Get Todo by id
 */
app.get('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Id is invalid.');
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {

        if(!todo) {
            return res.status(404).send();
        } else {
            return res.status(200).send({todo});
        }

    }).catch((e) => {
        return res.status(400).send();
    });

});

/**
 * Route: Delete Todo
 */
app.delete('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Id is invalid.');
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {

        if(!todo) {
            return res.status(404).send();
        } else {
            return res.status(200).send({todo});
        }

    }).catch((e) => {
        res.status(400).send(e);
    });

});

/**
 * Route: Patch (update) Todo
 */
app.patch('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Id is invalid.');
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {

        if (!todo) {
            return res.status(404).send();
        }

        res.status(200).send({todo});

    }).catch((e) => {
        res.status(400).send(e);
    });
});

/**
 * Route: POST new User
 */
app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

/**
 * Route: GET "me" (User)
 */
app.get('/users/me', authenticate, (req, res) => {
   res.send(req.user);
});

/**
 * Route: User Login
 */
app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });

});

/**
 * Route: DELETE "me" (User)
 */
app.delete('/users/me/token', authenticate, (req, res) => {
   req.user.removeToken(req.token).then(() => {
      res.status(200).send();
   }, () => {
       res.status(400).send();
   });
});

/**
 * Start server and listen on port.
 */
app.listen(port, () => {
    console.log(`Started up at port ${port}.`);
});