import {observable, configure, action, runInAction,} from 'mobx';
import {baseUrl, get, post} from '../util';
import {notification} from 'antd';

configure({enforceActions: true});

export class OracleUserStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }
}
