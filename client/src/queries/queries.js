import { gql } from 'apollo-boost'

export const getAuthorsQuery = gql`
  {
    authors{
      name
      id
    }
  }
`

export const getBooksQuery = gql`
  {
    books{
      name
      id
    }
  }
`

/*
recall on the server we creae both the mutations addBook and addAuthor
the $name: String!, $genre: String!, $authorId: ID! are all mutation variables
and the ! means that they are required, then you pass the variables into the mutation
that you want to peform,
*/ 
export const addBookMutation = gql`
  mutation($name: String!, $genre: String!, $authorId: ID!){
    addBook(name: $name, genre: $genre, authorId: $authorId) {
      name
      id
    }
  }
`

export const getBookQuery = gql`
  query($id:ID){
    book(id: $id){
      id
      name
      genre
      author{
        id
        name
        age
        books{
          name
          id
        }
      }
    }
  }
`