import {observable, useStrict,action,runInAction,} from 'mobx';
import {notification} from 'antd';
import {baseUrl, get, del, post} from '../util';


useStrict(true);

export class InvokeOpStore{

    @observable
    currentSys={};

    @observable
    selectRow={};

    @observable
    fromVisible=false;

    @observable
    currentOperations=[];

    @observable
    invokePromissFormVisible=false;

    @observable
    allSystem=[];

    @observable
    targetKeys=[];

    @observable
    selectedKeys=[];

    @action
    toggleInvokePromissFormVisible=()=>{
        this.invokePromissFormVisible=!this.invokePromissFormVisible;
    };

    @action
    loadOperationById=async (id)=>{
        let json=await get(`${baseUrl}/op/invokeOperations/${id}`);
        runInAction(()=>{
            this.currentOperations=json;
        });
    };

    @action
    loadCurrentSys=async(sysId)=>{
        let json=await get(`${baseUrl}/sys/currentSys/${sysId}`);
        runInAction(()=>{
            this.currentSys=json[0];
        });
    };

    @action
    toggleFormVisible=()=>{
        this.fromVisible=!this.fromVisible;
    };

    @action
    showForm=(record)=>(()=>{
        runInAction(()=>{
            this.selectRow=record;
        });
        this.toggleFormVisible();
    });

    delete=(id)=>(async ()=>{
        let json=await del(`${baseUrl}/op/delete/${id}`);
        if(json.success){
            notification.success({
                message:'删除成功',
            })
        }else{
            notification.error({
                message:'后台错误，请联系管理员',
            })
        }
        this.loadOperationById(this.currentSys.id);
    });

    @action
    showInvokePromiss=(record)=>(()=>{
        runInAction(()=>{
            this.selectRow=record;
        });
        this.toggleInvokePromissFormVisible();
    });

    @action
    initAllsystem=async ()=>{
        let json=await get(`${baseUrl}/sys/allSystem`);
        runInAction(()=>{
            this.allSystem=json;
        })
    };

    saveInvokePromiss=async ()=>{
        let json=await post(`${baseUrl}/op/saveInvokePromiss`,{operationId:this.selectRow.id,sysIds:this.targetKeys});
        if(json.success){
            notification.success({
                message:'保存成功',
            })
        }else{
            notification.error({
                message:'后台错误，请联系管理员',
            })
        }
        this.toggleInvokePromissFormVisible();
    };

    @action
    loadCurrentInvokePromiss=async ()=>{
        let json=await get(`${baseUrl}/op/invokePromiss/${this.selectRow.id}`) ;
        runInAction(()=>{
            this.targetKeys=json.map(r=>r.system_id);
        });
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