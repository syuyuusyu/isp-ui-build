import {observable, configure,action,runInAction,} from 'mobx';
import {notification} from 'antd';
import {baseUrl,get,del} from '../util';


configure({ enforceActions: true });

export class SysStore{

    constructor(rootStore){
        this.rootStore=rootStore;
    }

    @observable
    allSystem=[];

    @observable
    sysFormVisible=false;

    @observable
    currentSys={};

    @observable
    sysRoleConfVisible=false;


    checkUnique=async(rule, value, callback)=>{
        if(this.currentSys){
            if(this.currentSys.code===value){
                callback();
            }
        }
        let json=await get(`${baseUrl}/sys/checkUnique/${value}`);
        //let json=await response.json();
        if(json.total===0){
            callback();
        }else{
            callback(new Error());
        }

    };

    @action
    initAllsystem=async ()=>{
        let json=await get(`${baseUrl}/sys/allSystem`);
        runInAction(()=>{
            this.allSystem=json;
        })
    };

    delete=(id)=>(async()=>{
        const json=await del(`${baseUrl}/sys/delete/${id}`);
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
        this.initAllsystem();
    });


    @action
    toggleSysFormVisible=()=>{
        this.sysFormVisible=!this.sysFormVisible
    };

    @action
    showForm=(record={})=>(()=>{
        runInAction(()=>{
            this.currentSys=record;
        });
        this.toggleSysFormVisible();
    });

    @action
    showSysRoleConf=(record={})=>(()=>{
        runInAction(()=>{
            this.currentSys=record;
        });
        this.toggleSysRoleConfVisible();
    });

    @action
    toggleSysRoleConfVisible=()=>{
        this.sysRoleConfVisible=!this.sysRoleConfVisible;
    };

}