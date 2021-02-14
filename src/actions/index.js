const booksLoaded = (newBooks) => {
    return {
        type: 'FETCH_BOOKS_SUCCESS',
        payload: newBooks
    };
};
const booksRequested = () => {
    return {
        type: 'FETCH_BOOKS_REQUEST'
    }
}
const booksError = (error) => {
    return {
        type: 'FETCH_BOOKS_FAILURE',
        payload: error
    }
}

export const bookAddedToCart=(bookId)=>{
    console.log(bookId)
return{
    type:'BOOK_ADDED_TO_CART',
    payload:bookId    
}
}
// здесь мы вынесли эту функцию из компоннета BookList так как все ее дейчтвия связаны только с АС
const fetchBooks = (bookstoreService, dispatch) => () => {
    dispatch(booksRequested());
    bookstoreService.getBooks()
        .then((data) => dispatch(booksLoaded(data)))
        .catch((err) => dispatch(booksError(err)))
}

// export { booksLoaded, booksRequested, booksError }
export { fetchBooks }