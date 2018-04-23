import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withRouter,Route } from 'react-router-dom';
import { Main } from './main';


@observer
class App extends Component {
  render() {
    return (
        <div>

            <Main />
        </div>


    );
  }
}

export default withRouter(App);
