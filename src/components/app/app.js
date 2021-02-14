import React from 'react';
import './app.css'
import { withBookstoreService } from '../hoc';
import { Route, Switch } from 'react-router-dom'
import HomePage from './../pages/home-page/index';
import CartPage from './../pages/cart-page/index';
import ShopHeader from './../pages/shop-header/shop-header';



const App = ({ bookstoreService }) => {

    return (
        <main role="main" className="container">
            <ShopHeader numItems={5} total={210} />
            <Switch>
                <Route
                    path="/"
                    component={HomePage}
                    exact />

                <Route
                    path="/cart"
                    component={CartPage}
                />
            </Switch>
        </main>
    )

}

export default withBookstoreService()(App);
