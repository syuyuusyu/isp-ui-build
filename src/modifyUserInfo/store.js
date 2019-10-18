import {observable, action, runInAction, configure} from 'mobx';
import {notification} from 'antd';
import {baseUrl, get, post, careateTree, getPathById} from '../util';

configure({enforceActions: 'observed'});

export class ModifyUserStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }


    @observable
    orgRoute = [];

    getOrg = async () => {
        let user = JSON.parse(sessionStorage.getItem('user'));
        let result =await get(`${baseUrl}/entity/queryRelevant/1000/17/${user.id}`);
        let org = result.data[0];
        if (org) {
            let orglist = await post(`${baseUrl}/interfaces`, {"method": "organization"});
            let tree = careateTree(orglist, "id", "parent_id", 0);
            this.setCurrentRoute(tree, org.id)
        }
    };


    @action
    setCurrentRoute = (tree, id) => {
        tree.filter(d => d).forEach(data => {
            getPathById(id, Object.create(data), (result) => {
                runInAction(() => {
                    this.orgRoute = result.map(r => ({
                        id: r['id'],
                        text: r['name']
                    }));
                });
            }, 'id')
        });
    };


}
