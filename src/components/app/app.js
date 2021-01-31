import React from 'react';
import './app.css'
import Spinner from '../spinner';
import { withBookstoreService } from '../hoc';
import { Route, Switch } from 'react-router-dom'
import HomePage from './../pages/home-page/index';
import CartPage from './../pages/cart-page/index';




const App = ({ bookstoreService }) => {
    console.log(bookstoreService.getBooks())

    return (
        <div>
            <Spinner />
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/cartpage" component={CartPage} />
            </Switch>
        </div>)

}

export default withBookstoreService()(App);
