const mongoose = require('mongoose');

const toDoSchema = new mongoose.Schema({
    todo: {
        type: String,
        required: true,
    }
});

const Todo = mongoose.model('Todo', toDoSchema);

module.exports = Todo;
