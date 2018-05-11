import {observable,action,runInAction,configure} from 'mobx';
import {notification} from 'antd';
import {baseUrl,get,post} from '../util';

configure({ enforceActions: true });

export class ModifyUserStore{
  constructor(rootStore){
    this.rootStore=rootStore;
  }

}
