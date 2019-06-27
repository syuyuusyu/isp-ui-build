import {observable, configure, action,} from 'mobx';
//import {notification} from 'antd';
import {baseUrl, get} from '../util';

configure({ enforceActions: 'observed' });

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

  @observable
  regFormVisible=false;


  logout = async () => {
    get(`${baseUrl}/logout`);
    sessionStorage.clear();
    window.history.go('/login');
    //this.taggreLogin();
  };


  @action
  taggreLogin = () => {
    this.loginVisible = !this.loginVisible;
  };

  loadAllbuttons = async () => {
    const json = await get(`${baseUrl}/btn/allButtons`);
    const allButtons = {};
    json.forEach((b) => {
      allButtons[b.id] = b;
    });
    sessionStorage.setItem('buttons', JSON.stringify(allButtons));
  };

  @action
  toggleRegFormVisible=()=>{
    this.regFormVisible=!this.regFormVisible;
  };


}
