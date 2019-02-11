const {ObjectId} = require("mongodb");
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

// var id = '5c61c85e94726c06523d1f533';
//
// if (!ObjectId.isValid(id)) {
//     console.log('Id is invalid.')
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos:', todos);
// });
//
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//    console.log('Todo:', todo);
// });

Todo.findById(id).then((todo) => {
    if(!todo) {
        return console.log('Id not found.');
    }
    console.log('Todo By Id:', todo);
}).catch((e) => {
    console.log(e);
});