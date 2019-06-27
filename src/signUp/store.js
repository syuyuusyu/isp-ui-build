import {configure, observable, action, runInAction,} from 'mobx';
import {notification} from 'antd';
import {baseUrl, get, post,getPathById,isGov} from '../util';
import React from "react";

configure({ enforceActions: 'observed' });

export class SignUpStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable
    validSave = false;

    @observable
    orgVisible = false;

    @observable
    orgCheckedKeys = [];

    @observable
    treeData = [];

    @observable
    nodeNames = [];

    @observable
    formVisible = false;

    @observable
    newNodeNames = [];

    @observable
    test = 'test';

    @action
    save = () => {
        this.props.form.validateFields(async (err, values) => {
            if (err) return;
            //console.log("values的值为:",values);
            const randomNumber = Math.random().toString().substr(2, 10);
            const hmac = crypto.createHmac('sha256', randomNumber);
            values.password = hmac.update(values.password).digest('hex');
            values.confirmPassword = hmac.update(values.confirmPassword).digest('hex');
            values.randomNumber = randomNumber;

            let json = await post(`${baseUrl}/userRegister/svae`, JSON.stringify(values));
            if (json.success) {
                notification.success({
                    message: '保存成功'
                })
            } else {
                notification.error({
                    message: '后台错误，请联系管理员'
                })
            }
        });
        this.validSave = true;
    };

    @action
    toggleOrgVisible = () => {
        this.orgVisible = !this.orgVisible;
    };

    @action
    initRoot = async () => {
        let json = await get(`${baseUrl}/userRegister/getOrg/${isGov?3:2}`);
        //将取回来机构数据转为树转结构的数据
        let newData = this.toTreeData(json, 'id', 'parent_id', 'children');
        runInAction(() => {
            this.treeData = newData;
        });
    };



    @action
    onCheck = (checkedKeys, info) => {
        checkedKeys.checked=[checkedKeys.checked.pop()];
        this.nodeNames.length = 0;
        this.orgCheckedKeys = checkedKeys.checked;
        this.newNodeNames=[];

        for(let i=0;i< checkedKeys.checked.length;i++){
            let nameArr=[];
            let id=checkedKeys.checked[i];
            this.treeData.filter(d => d).forEach(data => {
                getPathById(id, Object.create(data), (result) => {
                    nameArr=result.map(r=>r.name)
                }, 'id')
            });
            this.newNodeNames.push(nameArr.join('/'));

        }


        // let posArray=[];
        // let checkedNodesPositions=info.checkedNodesPositions;
        // for(let i of checkedNodesPositions){
        //   if(!i.node.props.hasOwnProperty('children')){
        //     posArray.push(i.pos)
        //   }
        // }
        //
        // for(let j of posArray){
        //   let nodeName=[];
        //   let temTreeData=this.treeData;
        //   let pathArray=j.split('-');
        //   for(let k=1;k<pathArray.length;k++){
        //     nodeName.push(temTreeData[parseInt(pathArray[k])].name);
        //     temTreeData=temTreeData[parseInt(pathArray[k])].children;
        //   }
        //   this.nodeNames.push(nodeName);
        // }
    };

    @action
    saveSelect = () => {
        this.toggleOrgVisible();
        //this.renderOrg();
    };

    @action
    toTreeData = (a, idStr, pidStr, childrenStr) => {
        let r = [], hash = {}, id = idStr.toString(), pid = pidStr.toString(), children = childrenStr, i = 0, j = 0,
            len = a.length;
        for (; i < len; i++) {
            hash[a[i][id]] = a[i];
        }
        for (; j < len; j++) {
            var aVal = a[j], hashVP = hash[aVal[pid]];
            if (hashVP) {
                !hashVP[children] && (hashVP[children] = []);
                hashVP[children].push(aVal);
            } else {
                r.push(aVal);
            }
        }
        return r;
    };

    @action
    renderOrg = () => {
        this.newNodeNames.length = 0;
        let nodeName;
        if (this.nodeNames.length > 0) {
            for (let i of this.nodeNames) {
                nodeName = i.join("/");
                this.newNodeNames.push(nodeName);
            }
        }
        //console.log("this.newNodeNames的值为:",this.newNodeNames.filter(d=>d));
    }

    @action
    initNewNodeNames = () => {
        this.newNodeNames.length = 0;
    }
}



