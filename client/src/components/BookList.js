import React, { Component } from 'react';
import { graphql } from 'react-apollo'; // what actually binds react to apollo
import { getBooksQuery } from '../queries/queries'
import BookDetails from './BookDetails';

class BookList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    }
  }

  displayBooks() {
    let data = this.props.data

    //check to see if query is still loading, otherwise display books names in list
    if(data.loading) {
      return <div>Loading books...</div>
    } else {
      return data.books.map(book => {
        return(
          // below for each list item, when they are clicked it sets the
          // selected state to the book id that was clicked, that is then
          //  passes as a prop "bookid" to the component BookDetails
          <li key={ book.id } onClick={ (e) => {this.setState({selected: book.id})}}>{ book.name }</li>
        )
      })
    }
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <ul id="book-list" >
          { this.displayBooks() }
        </ul>
        <BookDetails bookId={this.state.selected}></BookDetails>
      </div>
    );
  }
}


// below we are taking the "getBooksQuery" query and binding it to the BookList component
// it stores the query information in the components props
export default graphql(getBooksQuery)(BookList);
