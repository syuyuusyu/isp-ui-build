import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import createHistory from 'history/createBrowserHistory';
import { Main } from './main';
import registerServiceWorker from './registerServiceWorker';
import RootStore from './rootStore';
import './index.less';


const history = createHistory();
// const div = document.createElement('div');
// document.body.appendChild(div);

Array.prototype.indexOf = Array.prototype.indexOf ? Array.prototype.indexOf
    : function(o, from)  {
        from = from || 0;
        var len = this.length;
        from += (from < 0) ? len : 0;
        for (; from < len; from++) {
            if (this[from] === o)
                return from;
        }
        return -1;
    };

Array.prototype.remove = Array.prototype.remove ? Array.prototype.remove
    : function(o)  {
        let index = this.indexOf(o);
        if (index != -1) {
            this.splice(index, 1);
        }
    };

ReactDOM.render(
  <Provider rootStore={new RootStore()} >
    <Router history={history}>
      <Main />
    </Router>
   </Provider>,
    document.getElementById('root')
);
registerServiceWorker();


