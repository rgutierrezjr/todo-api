var express = require('express');
var bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.json());

// POST todo
app.post('/todos', (req, res) => {
    console.log(req.body);

    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET todo
app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
       res.send({todos})
   }, (e) => {
        res.status(400).send(e);
   });
});


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


// POST users
app.post('/users', (req, res) => {
    console.log(req.body);
});

app.listen(port, () => {
    console.log(`Started up at port ${port}.`);
});