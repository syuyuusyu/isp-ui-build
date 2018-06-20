import {observable, configure,action,runInAction,} from 'mobx';
import {baseUrl, get, post} from '../util';
import {notification} from 'antd';
configure({ enforceActions: true });


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
    selectedAccId='';

    @observable
    firstPwd;

    @observable
    selectInstanceVisible=false;

    @observable
    formDisplay='none';

    @observable
    testData=[{"id":"test1","name":"drt1"},{"id":"test2","name":"drt2"},{"id":"test3","name":"drt3"}];

    @action
    toggleFormVisible=()=>{
        this.formVisible=!this.formVisible;
    };

    @action
    toggleSelectInstanceVisible=()=>{
      this.selectInstanceVisible=!this.selectInstanceVisible;
    };

    showForm=()=>{
       /* if(!this.selectedAccId){
            notification.error({
                message:'请先选择数据库实列'});
            return;
        }*/
        this.toggleFormVisible();
    };

    scheduleToken=()=>{
        get(`${baseUrl}/invoke/dataToken`);
    };

    @action
    showSelectInstance=()=>{
      this.toggleSelectInstanceVisible();
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
      if(this.selectedAccId!==''){
        this.formDisplay='';
      }
        this.loadDataUsers(e);
    };

    @action
    afterClose=()=>{
      this.formDisplay='none';
    }

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
