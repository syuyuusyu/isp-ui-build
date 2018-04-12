import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Main } from './main';

@observer
class App extends Component {
  render() {
    return (
      <Main />
    );
  }
}

export default withRouter(App);
