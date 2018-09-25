const graphql = require('graphql');
const _ = require('lodash');

// below we destructor "GraphQLObjectType" from graphql package  to use it as var/function
const { GraphQLObjectType, 
        GraphQLInt,
        GraphQLString, 
        GraphQLSchema,
        GraphQLID,
        GraphQLList } = graphql;

// dummy data 
var books = [
  { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1'},
  { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2'},
  { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3'},
  { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2'},
  { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3'},
  { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3'},
]

var authors = [
  {name: 'Patrick Rothfuss', age: 44, id: '1'},
  {name: 'Brandon Sanderson', age: 42, id: '2'},
  {name: 'Terry Pratchett', age: 66, id: '3'},
]


const BookType = new GraphQLObjectType({
  name: 'Book', // our 'Book' type schema
  fields: () => ({ 
    /* the reason this is a function is so when we have multiple types it 
    will avoid reference errors. This allows the function to be executed after this whole file has been run,
    so if you try to call author and author property of field was an object instead of a function, it tries
    to find it before it is finished running the file. Since it wouldn't know it's there, it errors out. */
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString},
    author: { 
      type: AuthorType,
      // the parent argument gives you access to the parent object, this will helps us find authorId within resolve
      resolve(parent, args) {
        console.log(parent)
        return _.find(authors, { id: parent.authorId });
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author', 
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType), // since an author can have multiple books we are telling GQL it CAN be a list of books
      resolve(parent, args) {
        // finds all books in books array wiht authorId that is passed in
        // for example if we query author 3 it will return all books that have authorId of 3
        return _.filter(books, { authorId: parent.id})
      }
    }
  })
});
/* the query on the front end would look like this: 
{
  author(id: 3) {
    name
    age
    books{
      name
      genre
    }
  }
}
*/


// in this case our root queries could const of grabbing an Author, a Book, All Authors, or All Books,
// root queries define how we are initially going to jump into the graph
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      // when they query for a book type we expect a set of args
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //code to get data from db / other source
        // below we use lodash to find any books with id passed from args.id
        return _.find(books, {id: args.id });
      }
    },
    author: {
      type: AuthorType,
      args: {id: {type: GraphQLID} },
      resolve(parent, args) {
        return _.find(authors, {id: args.id});
      }
    }
  }
});

/*
The query on the frontend would look something like the following
book(id: '123') {
  name
  genre
} 
*/

module.exports = new GraphQLSchema({
  query: RootQuery
});