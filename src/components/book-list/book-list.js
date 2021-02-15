import React, { Component } from 'react';
import './book-list.css';
import BookListItem from './../book-list-item/book-list-item';
import { connect } from 'react-redux';
import { fetchBooks, bookAddedToCart } from '../../actions';
import { withBookstoreService } from '../hoc';
import { compose } from '../../utils';
import Spinner from './../spinner/spinner';
import ErrorIndicator from './../error-indicator/index';




const BookList = ({ books, onAddedToCart }) => {
    return (
        <ul className="book-list">
            {
                books.map((book) => {
                    return (
                        <li key={book.id}>
                            <BookListItem
                                book={book}
                                onAddedToCart={() => onAddedToCart(book.id)} />
                        </li>
                    )
                })
            }
        </ul>
    );
}

class BookListContainer extends Component {
    componentDidMount() {
        this.props.fetchBooks()
    }


    render() {
        const { books, loading, error, onAddedToCart } = this.props
        if (loading) {
            return <Spinner />
        }
        if (error) {
            return <ErrorIndicator />
        }
        return <BookList books={books} onAddedToCart={onAddedToCart} />
    }
};

// здесь все State
const mapStateToProps = ({ books, loading, error }) => {
    return { books, loading, error };
};

//здесь все АС
const mapDispatchToProps = (dispatch, ownProps) => {
    const { bookstoreService } = ownProps
    return {
        fetchBooks: fetchBooks(bookstoreService, dispatch),
        onAddedToCart: (id) => dispatch(bookAddedToCart(id))
    }
}


export default compose(
    withBookstoreService(),
    connect(mapStateToProps, mapDispatchToProps)
)(BookListContainer);



