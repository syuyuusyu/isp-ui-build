import {observable, configure,action,runInAction,} from 'mobx';
import {notification,Divider,Popconfirm,} from 'antd';
import {baseUrl, get, del, post} from '../util';
import RoleButton from '../roleButton';
import React from 'react';

configure({ enforceActions: true });

export class RoleStore{

    constructor(rootStore){
        this.rootStore=rootStore;
    }

    @observable
    columns=[
        // {dataIndex:'sname',title:'所属系统',width:100,
        //     onFilter: (value, record) => record.sname.indexOf(value) === 0,
        // },
        // {dataIndex:'id',title:'ID',width:30},
        {dataIndex:'code',title:'编码',width:100},
        {dataIndex:'name',title:'名称',width:70},
        {dataIndex:'description',title:'描述',width:300},
        {
            title: '操作',
            width: 320,
            render: (text, record,index) => {
                return (
                    <span>
                        <RoleButton buttonId={9}  onClick={this.rootStore.roleMenuStore.menu(record)}/>
                        {/*<Button icon="profile" onClick={this.props.rootStore.roleMenuStore.menu(record.id)} size='small'>菜单权限配置</Button>*/}
                        <Divider type="vertical"/>
                        {/*按钮权限*/}
                        <RoleButton buttonId={25}  onClick={this.rootStore.roleButtonStore.showMenuButtonTree(record)}/>
                        <Divider type="vertical"/>
                        {/*平台访问权限权限*/}
                        {/*<RoleButton buttonId={26}  onClick={this.rootStore.roleSysStore.showSysRoleConf(record)}/>*/}
                        {/*<Divider type="vertical"/>*/}
                        {/*<Button icon="edit" onClick={this.store.edit(record)} size='small'>修改</Button>*/}
                        <RoleButton buttonId={10} onClick={this.edit(record)}/>
                        <Divider type="vertical"/>
                        <Popconfirm onConfirm={this.delete(record.id)} title="确认删除?">
                            {/*<Button icon="delete" onClick={null} size='small'>删除</Button>*/}
                            <RoleButton buttonId={11}/>
                        </Popconfirm>
                    </span>
                )
            }
        }
    ];

    @observable
    roleType='2';

    @observable
    allRoles=[];

    @observable
    currentRoles=[];

    @observable
    fromVisible=false;

    @observable
    selectRow=null;

    @observable
    allSystem=[];

    @action
    roleTypeChange=(v)=>{
        this.roleType=v;
        if(v==='1'){
            this.columns.unshift({dataIndex:'sname',title:'所属系统',width:100,
                                onFilter: (value, record) => record.sname.indexOf(value) === 0,
                            });
            this.loadAllSystem();
        }
        if(v==='2'){
            this.columns.shift();
        }

        this.loadAllRoles();
    };


    @action
    loadAllSystem=async ()=>{
        if(this.roleType==='1'){
            let json=await get(`${baseUrl}/sys/allSystem`);
            this.allSystem=json;
            this.columns[0].filters=json.map(i=>({text:i.name,value:i.name}));
        }

    };

    @action
    loadAllRoles=async ()=>{
        console.log('loadAllRoles');
        let json=await get(`${baseUrl}/role/allRoles`);
        runInAction(()=>{
            this.allRoles=json;
        });
    };

    @action
    taggreForm=()=>{
        this.fromVisible=!this.fromVisible;
    };



    @action
    create=()=>{
        this.selectRow=null;
        this.taggreForm();
    };

    @action
    edit=(record)=>(()=>{
        runInAction(()=>{
            this.selectRow=record;
        });
        this.taggreForm();
    });

    delete=(id)=>(async()=>{
        const json=await del(`${baseUrl}/role/delete/${id}`);
        //const json=await response.json();
        if(json.success){
            notification.success({
                message:'删除成功',
            })
        }else{
            notification.error({
                message:'后台错误，请联系管理员',
            })
        }
        this.loadAllRoles();
    });




}

export class RoleMenuStore{
    constructor(rootStore){
        this.rootStore=rootStore;
    }
    @observable
    treeData=[];

    @observable
    roleCheckedKeys=[];

    @observable
    currentRoleid=-1;

    @observable
    menuVisible=false;

    // constructor(){
    //     this.initRoot();
    // }

    @action
    menu=(record)=>(async ()=>{
        runInAction(()=>{
            this.rootStore.roleStore.selectRow=record;
            this.currentRoleid=record.id;
        });

        let json=await get(`${baseUrl}/role/roleMenuIds/${record.id}`);
        runInAction(()=>{
            this.roleCheckedKeys=json.map(j=>j.menu_id+'');
        });
        this.taggreMenu();
    });


    @action
    taggreMenu=()=>{
        this.menuVisible=!this.menuVisible;
    };



    @action
    initRoot=async ()=>{
        let json=await get(`${baseUrl}/role/roleMenu/1`);
        //let json=await response.json();
        runInAction(()=>{
            this.treeData=json;
        })
    };

    @action
    onLoadData=async(treeNode)=>{
        const parentId=treeNode.props.dataRef.id;
        let json=await get(`${baseUrl}/role/roleMenu/${parentId}`);
        //let json=await response.json();
        runInAction(()=>{
            treeNode.props.dataRef.children=json;
            this.treeData=[...this.treeData];
        })
    };

    @action
    onCheck=(checkedKeys)=>{
        console.log(checkedKeys.checked);
        this.roleCheckedKeys=checkedKeys.checked;
        console.log(this.roleCheckedKeys.filter(d=>d));

    };

    @action
    handleReset=()=>{
        this.roleCheckedKeys=[];
    };


    save=async ()=>{
        let response=await fetch(`${baseUrl}/role/saveRoleMenu` , {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Access-Token': sessionStorage.getItem('access-token') || '' // 从sessionStorage中获取access token
                }),
                body: JSON.stringify({roleId:this.currentRoleid,menuIds:this.roleCheckedKeys.filter(d=>d)}),
            }
        );
        let json=await response.json();
        if(json.success){
            notification.success({
                message:'保存成功',
            })
        }else{
            notification.error({
                message:'后台错误，请联系管理员',
            })
        }
        this.rootStore.treeStore.loadMenuTree();
        this.taggreMenu();
    };

}

export class RoleButtonStore{
    constructor(rootStore){
        this.rootStore=rootStore;
    }
    //角色按钮权限配置
    @observable
    menuButtonTree=[];

    @observable
    checkedKeys=[];

    @observable
    selectRow={};

    @observable
    menuButtonTreeVisible=false;

    @action
    loadMenuButtonTree=async ()=>{
        let json=await get(`${baseUrl}/btn/menuButtonTree`);
        runInAction(()=>{
            this.menuButtonTree=json;
        });

    };

    @action
    toggleMenuButtonTreeVisible=()=>{
        this.menuButtonTreeVisible=!this.menuButtonTreeVisible;
    };

    @action
    showMenuButtonTree=(record)=>(async ()=>{
        runInAction(()=>{
            this.selectRow=record;
        });
        //读取当前角色已经赋权的按钮
        ///btn/buttonRole/:roleId
        let json2=await get(`${baseUrl}/btn/buttonRole/${this.selectRow.id}`);
        runInAction(()=>{
            this.checkedKeys=json2.map(m=>m.button_id+'');
        });
        this.rootStore.authorityStore.loadAllbuttons();
        this.toggleMenuButtonTreeVisible();
    });

    @action
    onCheck=(checkedKeys,{checkedNodes})=>{
        this.checkedKeys=checkedKeys.checked;

    };

    @action
    handleReset=()=>{
        this.checkedKeys=[];
    };

    save=async ()=>{
        let response=await fetch(`${baseUrl}/btn/saveButtonRole` , {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Access-Token': sessionStorage.getItem('access-token') || '' // 从sessionStorage中获取access token
                }),
                body: JSON.stringify({roleId:this.selectRow.id,buttonIds:this.checkedKeys}),
            }
        );
        let json=await response.json();
        if(json.success){
            notification.success({
                message:'保存成功',
            })
        }else{
            notification.error({
                message:'后台错误，请联系管理员',
            })
        }

        this.toggleMenuButtonTreeVisible();
    };
}

export class RoleSysStore{

    constructor(rootStore){
        this.rootStore=rootStore;
    }

    @observable
    allSystem=[];

    @observable
    sysRoleConfVisible=false;

    @observable
    selectedRow={};

    @observable
    targetKeys=[];

    @observable
    selectedKeys=[];

    @action
    initAllsystem=async ()=>{
        let json=await get(`${baseUrl}/sys/allSystem`);
        runInAction(()=>{
            this.allSystem=json;
        })
    };

    @action
    loadCurrentRoleSystem=async ()=>{
        let json=await get(`${baseUrl}/sys/sysRole/${this.selectedRow.id}`) ;
        runInAction(()=>{
            this.targetKeys=json.map(r=>r.id);
        });
    };



    @action
    showSysRoleConf=(record={})=>(()=>{
        runInAction(()=>{
            this.selectedRow=record;
        });
        this.toggleSysRoleConfVisible();
    });

    @action
    toggleSysRoleConfVisible=()=>{
        this.sysRoleConfVisible=!this.sysRoleConfVisible;
    };


    saveSysRole=async ()=>{

        let json=await post(`${baseUrl}/sys/saveSysRole`,{roleId:this.selectedRow.id,sysIds:this.targetKeys});
        if(json.success){
            notification.success({
                message:'保存成功',
            })
        }else{
            notification.error({
                message:'后台错误，请联系管理员',
            })
        }
        this.toggleSysRoleConfVisible();
        this.rootStore.treeStore.loadMenuTree();
    };


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

}


