import {observable, useStrict, action,} from 'mobx';
//import {notification} from 'antd';
import {baseUrl, get} from '../util';

useStrict(true);

export default class AuthorityStore {

    constructor(rootStore){
        this.rootStore=rootStore;
    }
    @observable
    currentUser = {};

    @observable
    applyPlatformVisible = false;



    @observable
    loginVisible = !sessionStorage.getItem('access-token');




    logout = async () => {
        get(`${baseUrl}/logout`);
        sessionStorage.clear();
        this.taggreLogin();
    };


    @action
    taggreLogin = () => {
        this.loginVisible = !this.loginVisible;
    };

    @action
    loadAllbuttons = async () => {
        const json = await get(`${baseUrl}/btn/allButtons`);
        const allButtons = {};
        json.forEach((b) => {
            allButtons[b.id] = b;
        });
        sessionStorage.setItem('buttons', JSON.stringify(allButtons));
    };

}
