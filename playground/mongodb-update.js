// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/test', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Todos').findOneAndUpdate({_id: new ObjectID("5c47d2d3ad53c7590d58c9f4")},
        {
            $set: {
                completed: false
            }
        },
        {
            returnOriginal: false
        }).then((result) => {
            console.log(result);
        });

    db.close();
});
