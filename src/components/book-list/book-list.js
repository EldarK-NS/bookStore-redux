import React, { Component } from 'react';
import './book-list.css';
import BookListItem from './../book-list-item/book-list-item';
import { connect } from 'react-redux';

import { withBookstoreService } from '../hoc';
class BookList extends Component {


    componentDidMount() {
        // 1. получаем данные через метод из seervice через который мы связывамся с БД, а service мы можем получить 
        // из context - withBookstoreService
        const { bookstoreService } = this.props;
        const data = bookstoreService.getBooks();

        // 2. отправляем действие в store - для того что бы иметь возможность передавать данные в store нам нужна функция dispatch(), для этого нам нужно воспользоваться mapDispatchToProps 
        this.props.booksLoaded(data)
    }


    render() {
        const { books } = this.props
        return (
            <ul>
                {
                    books.map((book) => {
                        return (
                            <li key={book.id}><BookListItem book={book} /></li>
                        )
                    })
                }
            </ul>
        );
    }
};
const mapStateToProps = (state) => {
    return {
        books: state.books
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        booksLoaded: (newBooks) => {
            dispatch({
                type: 'BOOKS_LOADED',
                payload: newBooks
            });
        }
    };
};

export default withBookstoreService()(connect(mapStateToProps, mapDispatchToProps)(BookList));

