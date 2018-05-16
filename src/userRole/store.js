import {observable, configure,action,runInAction,} from 'mobx';
import {notification,Button,Popconfirm} from 'antd';
import {baseUrl,get,post} from '../util';
import React from 'react';
import RoleButton from '../roleButton';
import {Divider,} from 'antd';


configure({ enforceActions: true });

export class UserRoleStore{

    constructor(rootStore){
        this.rootStore=rootStore;
    }

    @observable
    targetKeys=[];

    @observable
    currentUserId=-1;

    @observable
    selectedKeys=[];

    @observable
    userRoleConfVisible=false;

    @observable
    users=[];

    @observable
    userType='1';

    @observable
    userRoleConfRoles=[];

    @observable
    columns=[
        // {dataIndex:'belong',title:'所属系统',width:100},
        {dataIndex:'user_name',title:'登录名称',width:100},
        {dataIndex:'name',title:'用户名称',width:100},
        {dataIndex:'phone',title:'电话',width:150},
        {dataIndex:'email',title:'EAIL',width:150},
        {
            title: '操作',
            width: 200,
            render: (text, record) => {
                return (
                    <span>
                        {/*<Button icon="profile" onClick={this.props.rootStore.userRoleStore.userRoleConf(record)} size='small'>用户角色配置</Button>*/}
                        <RoleButton buttonId={12} onClick={this.userRoleConf(record)}/>
                        <Divider type="vertical"/>
                      <Popconfirm onConfirm={this.resetPassword(record)} title="确认重置?">
                        <Button icon="reload" onClick={null} size='small'>重置密码</Button>
                      </Popconfirm>

                        {/*<Popconfirm onConfirm={null} title="确认删除?">*/}
                            {/*/!*<Button icon="delete" onClick={null} size='small'>删除</Button>*!/*/}
                            {/*<RoleButton buttonId={13}/>*/}
                        {/*</Popconfirm>*/}
                    </span>
                )
            }
        }
    ];

    @action
    loadUserRoleConfRoles=async ()=>{
        //userRoleConfRoles
        //let json=await get(`${baseUrl}/user/userRoleConfRoles/${this.currentUserId}`) ;
        let json=await get(`${baseUrl}/role/allRoles`);
        runInAction(()=>{
            this.userRoleConfRoles=json;
        });
    };


    @action
    loadAllUsers=async ()=>{
       let json=await get(`${baseUrl}/user/allUsers`) ;
       runInAction(()=>{
          this.users=json;
       });
    };

    @action
    loadCurrentUserRole=async ()=>{
        let json=await get(`${baseUrl}/role/userRole/${this.currentUserId}`) ;
        runInAction(()=>{
            this.targetKeys=json.map(r=>r.id);
        });
    };



    @action
    taggreUserRoleConf=()=>{
       this.userRoleConfVisible=!this.userRoleConfVisible;
    };

    @action
    userRoleConf=(record)=>(()=>{
        this.currentUserId=record.id;
        this.taggreUserRoleConf();
    });


    @action
    handleChange = (nextTargetKeys, direction, moveKeys) => {
        console.log('handleChange');
        this.targetKeys=nextTargetKeys;

    };

    @action
    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        console.log('handleSelectChange');
        this.selectedKeys=[...sourceSelectedKeys, ...targetSelectedKeys];
    };

    @action
    handleScroll = (direction, e) => {
        console.log('direction:', direction);
        console.log('target:', e.target);
    };

    saveUserRole=async ()=>{
        let json=await post(`${baseUrl}/user/saveUserRole`,{userId:this.currentUserId,roleIds:this.targetKeys});
         if(json.success){
             notification.success({
                 message:'保存成功',
             })
         }else{
             notification.error({
                 message:'后台错误，请联系管理员',
             })
         }
         this.taggreUserRoleConf();

    };

    @action
    handleReset=()=>{
        this.targetKeys=[];
    };



    @action
    userTypeChange=(v)=>{
        this.userType=v;
        if(v==='1'){
            this.columns[0]={dataIndex:'belong',title:'所属系统',width:100};
        }
        if(v==='2'){
            this.columns[0]={dataIndex:'belong',title:'所属机构',width:100};
        }
        this.loadAllUsers();

    };

    @action
    resetPassword= (record)=>(async ()=>{
      const userName=record.user_name;
      let json=await get(`${baseUrl}/resetPassword/${userName}`) ;
      if(json.success){
        notification.success({
          message:'保存成功',
        })
      }else{
        notification.error({
          message:'后台错误，请联系管理员',
        })
      }
    })


}
