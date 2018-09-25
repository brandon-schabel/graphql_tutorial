import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo'; // what actually binds react to apollo
import { getAuthorsQuery, addBookMutation, getBooksQuery } from '../queries/queries';


class AddBook extends Component {
  constructor(props) {
    super(props);
    this.state ={
      name: '',
      genre: '',
      authorId: '' 
    }

    this.submitForm = this.submitForm.bind(this);
  }


  displayAuthors() {
    let data = this.props.getAuthorsQuery; 
    if(data.loading) {
      return(<option disabled>Loading Authors...</option>)
    } else {
      return data.authors.map(author => {
        return (<option key={author.id} value={ author.id }>{author.name}</option>)
      })
    }
  }

  submitForm(e) {
    e.preventDefault();
    console.log(this.state);
    this.props.addBookMutation( {
        //below we are telling the mutation which variables we want to use
        // that were defined in the queries
        variables: {
          name: this.state.name,
          genre: this.state.genre,
          authorId: this.state.authorId
        },
        // refetchQueries tells Apollo which queries to refetch
        refetchQueries: [{ query: getBooksQuery}]
      }
    ); //the .addBookMutation is what name we gave it at the bottom in the export function

  }

  render() {
    return (
    <form id="add-book" onSubmit={this.submitForm}>
      <div className="field">
          <label>Book name:</label>
          <input type="text" onChange={(e) => this.setState({name: e.target.value})} />
      </div>
      <div className="field">
          <label>Genre:</label>
          <input type="text" onChange={(e) => this.setState({genre: e.target.value})} />
      </div>
      <div className="field">
          <label>Author:</label>
          <select onChange={(e) => this.setState({authorId: e.target.value})}>
              <option>Select author</option>
              { this.displayAuthors()  }
          </select>
      </div>
      <button>+</button>
    </form>
    );
  }
}

/* by default you can just bind multiple queries to one component, 
   becuase of that you have to combination multiple queries together use by using the 
   compose function from react-apollo. Because of that when you console.log(this.props) instead of just 
   having a data response you will have reponses for each query, thus you have to give them names
   so you have a way of accessing them individually.
   */
export default compose(
  graphql(getAuthorsQuery, { name: "getAuthorsQuery"}),
  graphql(addBookMutation, { name: "addBookMutation"})
)(AddBook)

/* if you only needed the one query type it would look like this
export default graphql(getAuthorsQuery)(AddBook); */
