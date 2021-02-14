import React from 'react'
import BookList from './../../book-list/index';
import ShoppingCartTable from './../../shopping-cart-table/index';

const HomePage = () => {

    return (
        <div>
            <div>Home Page</div>
            <BookList />
            <ShoppingCartTable />
        </div>

    )
}
export default HomePage;