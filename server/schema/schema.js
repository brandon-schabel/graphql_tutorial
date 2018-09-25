const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

// below we destructor "GraphQLObjectType" from graphql package  to use it as var/function
const { GraphQLObjectType, 
        GraphQLInt,
        GraphQLString, 
        GraphQLSchema,
        GraphQLID,
        GraphQLList,
        GraphQLNonNull //check to see if certain field is required
      } = graphql;

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
        return Author.findById(parent.authorId)
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
        return Book.find({ authorId: parent.id })
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
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: {id: {type: GraphQLID} },
      resolve(parent, args) {
        return Author.findById(args.id);
      }
    },

    // root queries that tell graphql that we want can retrieve all authors and all books
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({})
      }
    },

    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({})
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


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    /*
    the author mutation on the frontend would be defined like so
    mutation {
      addAuthor(name:"Brandon", age: 22) {
        name // here we are saying we want to recieve back name and age
        age
      }
    }
    */
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        // author = new Author is an instance of our mongoose datatype schema we imported
        let author = new Author({
          name: args.name,
          age: args.age
        });
        // in the model we defined "Author"as the collection and that is where it will save it.
        return author.save()
      }
    },

    
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }
  }
});


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
//the export is saying we can query using RootQuery and use mutations defined in Mutation