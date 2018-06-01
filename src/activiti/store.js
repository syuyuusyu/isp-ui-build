import {observable, configure,action,runInAction,} from 'mobx';
import {notification} from 'antd';
import {activitiUrl, get, post, del, baseUrl} from '../util';
import axios from 'axios';




configure({ enforceActions: true });

export class ActivitiStore {

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable
    createModelFormVisible=false;

    @action
    toggleCreateModelFormVisible=()=>{
        this.createModelFormVisible=!this.createModelFormVisible;
    };

    @observable
    modeles=[];

    @observable
    process=[];

    @action
    loadModles=async ()=>{
        let json=await get(`${activitiUrl}/repository/models`);
        console.log(json.data);
        runInAction(()=>{
            this.modeles=json.data;
        });
    }

    deleteMdel=(id)=>(async ()=>{
        let json=await del(`${activitiUrl}/repository/models/${id}`);
        this.loadModles();
    });

    modelExport=(record)=>(async ()=>{
        let response=await axios({url:`${activitiUrl}/export?id=${record.id}`,
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Token': sessionStorage.getItem('access-token') || '' // 从sessionStorage中获取access token
            },
            //data:JSON.stringify({...record,username:JSON.parse(sessionStorage.getItem("user")).user_name}),
            responseType: 'blob'
        });
        let blob= response.data;
        let a = document.createElement('a');
        let url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
        a.href = url;
        a.download = `${record.name}.bpmn20.xml`;
        a.click();
        window.URL.revokeObjectURL(url);

    });

    modelDeploy=(id)=>(async ()=>{
        let response=await get(`${activitiUrl}/deploy?id=${id}`);
        notification.info({
            message:response.msg
        });

    });

    @action
    loadProcess=async ()=>{
        let json=await get(`${activitiUrl}/repository/process-definitions`);
        runInAction(()=>{
            this.process=json.data;
        })
    };


    deleteProcess=(id)=>(async ()=>{
        let json=await get(`${activitiUrl}/process/delete?deploymentId=${id}`);
        if(json.success){
            notification.info({
                message:json.msg
            });
            this.loadProcess();
        }else {
            notification.error({
                message:json.msg
            });
        }

    });

    changeState=(id,suspended)=>(async ()=>{
        let json=await get(`${activitiUrl}/process/update/${suspended?'active':'suspend'}?procDefId=${id}`);
        notification.info({
            message:json.msg
        });
        this.loadProcess();
    });

    @observable
    fileList=[];

    @observable
    uploading=false;

    @observable
    fileFormVisible=false;

    @action
    togglerFileFormVisible=()=>{
        this.fileFormVisible=!this.fileFormVisible;
    };


    refUpload=(instance)=>{
        this.uploadRef=instance;
    };

    @action
    onRemove= (file) => {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList=newFileList;

    };

    @action
    beforeUpload= (file) => {
        this.fileList=[...this.fileList,file];
        return false;
    };

    @action
    clearFileList=()=>{
        this.fileList=[];
    };

    @action
    handleUpload=async ()=>{

        runInAction(()=>{
            this.uploading=true;
        });
        const formData = new FormData();
        this.fileList.filter(d=>d).forEach((file) => {
            formData.append('file', file);
        });
        await axios({url:`${activitiUrl}/process/deploy?category=defult`,
            method:'POST',
            headers: {
                //'Content-Type': 'multipart/form-data',//application/x-www-form-urlencoded
                //'filename': encodeURI(file.name),
                'Access-Token': sessionStorage.getItem('access-token') || '' // 从sessionStorage中获取access token
            },
            data:formData
        });

        runInAction(()=>{
            this.uploading=false;
        });
        this.togglerFileFormVisible();
        this.loadProcess();
    };


}