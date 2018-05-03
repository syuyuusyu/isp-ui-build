import React, { Component } from 'react';
import { withRouter,Route } from 'react-router-dom';
import { Main } from './main';
import './App.less';
import DevTools from 'mobx-react-devtools';


class App extends Component {
  render() {
    return (
        <div style={{ height: "100%" }}>
            <Main/>
        </div>
    );
  }
}

export default withRouter(App);
