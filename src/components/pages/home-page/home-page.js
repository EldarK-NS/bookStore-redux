import React from 'react'
import './home-page.css'
import BookList from './../../book-list/index';

const HomePage = () => {
    const books = [
        {
            id: 1,
            title: 'Production-Ready Microservices',
            author: 'Susan J. Fowler'
        },
        {
            id: 2,
            title: 'Realese It!',
            author: 'Michael T. Nygard'
        }
    ];
    return (
        <div>
            <div>Home Page</div>
            <BookList books={books} />
        </div>

    )
}
export default HomePage;