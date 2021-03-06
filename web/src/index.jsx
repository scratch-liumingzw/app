import React from 'react';
import ReactDom from 'react-dom';
import Index from './containers/Index.jsx';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import "antd/dist/antd.css";
import './global_styles.css';

const reduxStore = createStore(reducer, applyMiddleware(thunk));

ReactDom.render(
    <Provider store={reduxStore}>
        <Index />
    </Provider>,
    document.getElementById('content')
);