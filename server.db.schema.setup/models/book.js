const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: String,
  genre: String,
  authorId: String
})

// a model is a collection in the mongoDB based on the schema bookSchema, and we are exporting that
module.exports = mongoose.model("Book", bookSchema);