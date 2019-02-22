const env = process.env.NODE_ENV;

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

// POST todo
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }).catch((e) => {
        res.status(400).send();
    });;
});

// GET todo
app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
       res.send({todos})
   }, (e) => {
        res.status(400).send(e);
   });
});


// Get Todo by id
app.get('/todos/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Id is invalid.');
    }

    Todo.findById(id).then((todo) => {

        if(!todo) {
            return res.status(404).send();
        } else {
            return res.status(200).send({todo});
        }

    }).catch((e) => {
        return res.status(400).send();
    });

});

// Delete Todo
app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Id is invalid.');
    }

    Todo.findByIdAndRemove(id).then((todo) => {

        if(!todo) {
            return res.status(404).send();
        } else {
            return res.status(200).send({todo});
        }

    }).catch((e) => {
        return res.status(400).send(e);
    });

});

// Patch/Update Todo
app.patch('/todos/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {

        if (!todo) {
            return res.status(404).send();
        }

        res.status(200).send({todo});

    }).catch((e) => {
        res.status(400).send(e);
    });
});


// POST users
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

app.get('/users/me', authenticate, (req, res) => {
   res.send(req.user);
});

// POST /users/login {email, password}
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

app.listen(port, () => {
    console.log(`Started up at port ${port}.`);
});