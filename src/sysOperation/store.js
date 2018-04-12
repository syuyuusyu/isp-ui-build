import {observable, useStrict,action,runInAction,} from 'mobx';
import {message,notification} from 'antd';
import {baseUrl,get,del} from '../util';


useStrict(true);

export class SysOperationStore{

    constructor(rootStore){
        this.rootStore=rootStore;
    }

    @observable
    currentOperations=[];

    @observable
    currentSys={};

    @observable
    opFormVisible=false;

    @observable
    currentOperation={};

    @action
    loadCurrentSys=async(sysId)=>{
        let json=await get(`${baseUrl}/sys/currentSys/${sysId}`);
        runInAction(()=>{
            this.currentSys=json[0];
        });
    };

    @action
    loadOperationById=async (id)=>{
        let json=await get(`${baseUrl}/op/operations/${id}`);
        runInAction(()=>{
            this.currentOperations=json;
        });
    };

    @action
    toggleOpFormVisible=()=>{
        this.opFormVisible=!this.opFormVisible;
    };

    @action
    loadOperation=async ()=>{
        let json=await get(`${baseUrl}/op/operations/${this.currentSys.id}`);
        runInAction(()=>{
            this.currentOperations=json;
        });
    };




    @action
    treeSelect=(selectedKeys,e)=>{
        console.log(e.selectedNodes[0].props);
        this.currentSys=e.selectedNodes[0].props;
        this.loadOperation();

    };

    @action
    showOpForm=(record)=>(()=>{
        if(!this.currentSys.id){
            message.error('先选择对应系统平台');
            return;
        }
        runInAction(()=>{
            this.currentOperation=record;
        });
        this.toggleOpFormVisible();
    });

    deleteOp=(id)=>(async()=>{
        const json=await del(`${baseUrl}/op/delete/${id}`);
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
        this.loadOperation();
    });


}