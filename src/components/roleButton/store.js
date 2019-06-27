import {observable, configure,action,runInAction,} from 'mobx';
import {notification,Divider,Popconfirm,} from 'antd';
import {baseUrl, get, del, post} from '../../util';
import React from 'react';

configure({ enforceActions: 'observed' });

export class RelevantRoleButtonStore{
    constructor(rootStore){
        this.rootStore=rootStore;
    }
    //角色按钮权限配置
    @observable
    menuButtonTree=[];

    @observable
    checkedKeys=[];

    opId;

    setOpid=(id)=>{
        this.opId=id;
    }


    @action
    loadMenuButtonTree=async ()=>{
        let json=await get(`${baseUrl}/btn/menuButtonTree`);
        let json2=await get(`${baseUrl}/btn/buttonRole/${this.rootStore.commonStore.currentTableRow.id}`);
        runInAction(()=>{
            this.menuButtonTree=json;
            this.checkedKeys=json2.map(m=>m.button_id+'');
        });

    };




    @action
    onCheck=(checkedKeys,{checkedNodes})=>{
        this.checkedKeys=checkedKeys.checked;

    };

    @action
    handleReset=()=>{
        this.checkedKeys=[];
    };

    save=async ()=>{
        let json=await post(`${baseUrl}/btn/saveButtonRole` ,  JSON.stringify({roleId:this.rootStore.commonStore.currentTableRow.id,buttonIds:this.checkedKeys}));
        if(json.success){
            notification.success({
                message:'保存成功',
            })
        }else{
            notification.error({
                message:'后台错误，请联系管理员',
            })
        }
        this.rootStore.commonStore.toggleOperationVisible(this.opId)();

    };
}