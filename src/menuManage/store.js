import {observable, configure,action,runInAction,} from 'mobx';
import {notification} from 'antd';
import {baseUrl,get,del,post} from '../util';
import {message, Modal} from "antd/lib/index";

configure({ enforceActions: true });

export class MenuManageStore{

}
