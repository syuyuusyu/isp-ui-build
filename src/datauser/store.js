import {observable, useStrict,action,runInAction,} from 'mobx';
import {baseUrl, get, post} from '../util';
import {notification} from 'antd';
useStrict(true);


export class DataUserStore {

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable
    dataAcc=[];

    @observable
    dataUsers=[];

    @observable
    loading=false;

    @observable
    loadingtest='';

    @observable
    formVisible=false;

    @observable
    selectedAccId;

    @observable
    firstPwd;

    @action
    toggleFormVisible=()=>{
        this.formVisible=!this.formVisible;
    };

    showForm=()=>{
        if(!this.selectedAccId){
            notification.error({
                message:'请先选择数据库实列'});
            return;
        }
        this.toggleFormVisible();
    };

    scheduleToken=()=>{
        get(`${baseUrl}/invoke/dataToken`);
    };

    @action
    setFirstPwd=(e)=>{
        this.firstPwd=e.target.value;
    };



    @action
    loadDataAcc=async ()=>{
        runInAction(()=>{
            this.loading=true;
            this.loadingtest='获取数据库实列...'
        });
        let json=await post(`${baseUrl}/invoke/data_acc`);
        if(json.status){
            notification.error({
                message:'获取数据库实列失败,请尝试刷新页面或联系管理员'});
            runInAction(()=>{
                this.dataAcc=[];
                this.loading=false;
            });
        }else{
            runInAction(()=>{
                this.dataAcc=json;
                this.loading=false;
            });
        }

    };

    @action
    selectedAcc=(e)=>{
        this.selectedAccId=e;
        this.loadDataUsers(e);
    };

    @action
    loadDataUsers=async (id)=>{
        runInAction(()=>{
            this.loading=true;
            this.loadingtest='获取用户列表...'
        });
        let json=await post(`${baseUrl}/invoke/data_user`,{
            id:id
        });
        console.log('----',json);
        if(json.success){
            runInAction(()=>{
                this.dataUsers=json.result;
                this.loading=false;
            });
        }else{
            notification.error({
                message:'获取用户列表失败,请尝试刷新页面或联系管理员'});
            runInAction(()=>{
                this.dataUsers=[];
                this.loading=false;
            });
        }

    };

    @action
    save=async (values)=>{
        runInAction(()=>{
            this.loading=true;
            this.loadingtest='保存中...'

        });
        let json=await post(`${baseUrl}/invoke/data_create_user`,{
            username:values.name,
            password:values.pwd,
            id:this.selectedAccId
        });
        if(json.success){
            notification.info({
                message:'新建用户成功'});
        }else{
            notification.error({
                message:'新建用户失败'});
        }
        this.toggleFormVisible();
        this.loadDataUsers(this.selectedAccId);
        runInAction(()=>{
            this.loading=false;

        });
    };


}