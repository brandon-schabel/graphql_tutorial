const express = require('express');
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')

const app = express();

mongoose.connect('mongodb://brandon:test123@ds111993.mlab.com:11993/gql-ninja');
mongoose.connection.once('open', () => {
  console.log('connected to databasee');
})

// when a request is made to '/graphql' it will know to let the graphqlHTTP package do the rest of the work
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true // we want to use graphiql tool when we navigate to /graphql in browser
}));

app.listen(4000, () => {
  console.log('now listening on port 4000');
});