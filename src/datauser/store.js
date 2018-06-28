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
    allDataUsers=[];

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
            this.loadingtest='获取数据库实例...'
        });
        let json=await post(`${baseUrl}/invoke/data_acc`);
        if(!json.success){
            notification.error({
                message:'获取数据库实例失败,请尝试刷新页面或联系管理员'});
            runInAction(()=>{
                this.dataAcc=[];
                this.loading=false;
            });
        }else{
            runInAction(()=>{
                this.dataAcc=json;
                this.loading=false;
            });
          runInAction(()=>{
            this.loading=true;
            this.loadingtest='获取用户列表...'
          });
          //遍历数据库实例dataAcc.result(数组),根据实例id获取用户列表
          for(let i of this.dataAcc.result){
            let dataUser=await post(`${baseUrl}/invoke/data_user`,{id:i.id});
            if(dataUser.success){
              runInAction(()=>{
                this.dataUsers=dataUser.result;
                this.loading=false;
              });
              //将实例名称加入每个用户中
              for(let j of dataUser.result){
                j.instanceName=i.name;
                runInAction(()=>{this.allDataUsers.push(j);})
              }
            }
            else{
              notification.error({
                message:'获取用户列表失败,请尝试刷新页面或联系管理员'});
              runInAction(()=>{
                this.loading=false;
              });
            }
          }
        }
    };

    @action
    selectedAcc=(e)=>{
        this.selectedAccId=e;
      if(this.selectedAccId!==''){
        this.formDisplay='';
      }
        //this.loadDataUsers(e);
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
            host:'%',
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
