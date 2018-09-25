import React, { Component } from 'react';
import { graphql } from 'react-apollo'; // what actually binds react to 
import { getBookQuery } from '../queries/queries'

class BookDetails extends Component {
  displayBookDetails() {
    const { book } = this.props.data; // this the same as const book = this.props.data.book
    if(book) {
      return (
        <div>
          <h2>{ book.name }</h2>
          <p>{ book.genre }</p>
          <p>{ book.author.name }</p>
          <p> All books by this author: </p>
          <ul className="other-books">
            { book.author.books.map(item => {
              return <li key={item.id}>{item.name}</li>
            })}
          </ul>
        </div>
      )
    } else {
      return <div>No book selected...</div>
    }
  }

  render() {
    // console.log(this.props);
    
    return (
      <div id="book-details">
        {this.displayBookDetails()}
      </div>
    );
  }
}


// below we are taking the "getBookQuery" query and binding it to the BookDetails component
// it stores the query information in the components props, we added the options paramter which takes in props,
// it tells it to rerun the query everytime the props update and sets the id to props.bookId,
// which would be the new clicked book, since the query is binded to the props of the component
// it then assigns all the book info to props.data.book
export default graphql(getBookQuery, {
  options: (props) => {
    return {
      variables: {
        id: props.bookId
      }
    }
  }
})(BookDetails);
