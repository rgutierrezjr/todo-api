// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/test', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // // delete many
    // db.collection('Todos').deleteMany({text: 'Eat Lunch'}).then((result) => {
    //     console.log(result);
    // });
    //
    //

    // delete one
    // db.collection('Users').deleteOne({name: 'Ruben'}).then((result) => {
    //    console.log(result);
    // });

    db.collection('Users').findOneAndDelete({_id: new ObjectID("5c47d0e7ad53c7590d58c987")}).then((result) => {
       console.log(JSON.stringify(result, undefined, 2));
    });

    // find one and delete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // })

    db.close();
});
