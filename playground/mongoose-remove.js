const {ObjectId} = require("mongodb");
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove((result) => {
//
// });

Todo.findByIdAndRemove("5c61c85e94726c06523d1f53").then((todo) => {
   console.log(todo);
});


