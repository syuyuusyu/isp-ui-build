import {observable, useStrict,action,runInAction,} from 'mobx';
import {baseUrl, get, post} from '../util';
import {notification} from 'antd';

useStrict(true);


export class CloudStore{

    constructor(rootStore){
        this.rootStore=rootStore;
    }

    @observable
    serverInfo=[];

    @observable
    images=[];

    @observable
    networks=[];

    @observable
    flavors=[];

    @observable
    loading=false;

    @observable
    loadingtest='';

    @observable
    formVisible=false;

    @action
    toggleFormVisible=()=>{
        this.formVisible=!this.formVisible;
    };

    scheduleToken=()=>{
        get(`${baseUrl}/invoke/cloudToken`);
    };

    @action
    loadServerInfo=async ()=>{
        runInAction(()=>{
            this.loading=true;
            this.loadingtest='获取云机状态...'
        });
        let json=await post(`${baseUrl}/invoke/cloud_servers_info`);
        runInAction(()=>{
            if(json.status && json.status===500){
                this.serverInfo=[];
                notification.error({message:'连接云平台失败',});
            }else{
                this.serverInfo=json;
            }
            this.loading=false;
        });

    };

    @action
    loadFormInput=async ()=>{
        runInAction(()=>{
            this.loading=true;
            this.loadingtest='正在向云平台获取表单信息...'
        });
        let json=await post(`${baseUrl}/invoke/cloud_form`);
        if(json.status && json.status===500){
            notification.error({message:'连接云平台失败',});
            runInAction(()=>{
                this.loading=false;
            })
        }else{
            runInAction(()=>{
                this.images=json.image;
                this.networks=json.network;
                this.flavors=json.flavors;
                this.loading=false;
            });
        }

    };

    @action
    detail=(record)=>(()=>{

    });


}