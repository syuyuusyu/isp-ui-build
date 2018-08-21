import {observable, configure,action,runInAction,} from 'mobx';
import {baseUrl,post,get} from '../util';
import {notification} from 'antd';
import axios from 'axios';

configure({ enforceActions: true });

export class SwiftStore{

    constructor(rootStore){
        this.rootStore=rootStore;
    }

    tenG=10737418240;

    uploadRef;

    @observable
    hasContainer=false;

    @observable
    rootDir=[];

    @observable
    total=0;

    @observable
    inDowning=false;

    @observable
    loadingtest='';

    @observable
    onLoad=false;

    @observable
    formVisible=false;

    @observable
    selectRow={};

    @observable
    fromTitle='';

    @observable
    fileFormVisible=false;

    @observable
    fileList=[];

    @observable
    uploading=false;

    scheduleToken=()=>{
        console.log('scheduleToken swift');
        get(`${baseUrl}/swift/swiftToken`);
    };

    @action
    checkContainer=async ()=>{
        runInAction(() => {
            this.inDowning = true;
            this.loadingtest = '获取网盘用户信息...';
        });
        let json = await get(`${baseUrl}/swift/containerInfo`);
        runInAction(() => {
            this.inDowning = false;
        });
        if (json.status) {
            notification.error({
                message:'云平台权限认证失败,请尝试刷新页面或联系管理员'});
        }else{
            if(json.filter(d=>d.name===JSON.parse(sessionStorage.getItem("user")).user_name).length===1){
                runInAction(() => {
                    this.hasContainer = true;
                });
                this.loadRootDir();
            }else{
                notification.info({
                    message:'当前用户未开通网盘,请点击开通'});
            }

        }
    };

    @action
    launch=async ()=>{
        runInAction(()=>{
            this.inDowning=true;
            this.loadingtest='正在开通网盘...';
        });
        let json=await post(`${baseUrl}/swift/createContainer`,{
            username:JSON.parse(sessionStorage.getItem("user")).user_name
        });
        runInAction(()=>{
            this.inDowning=false;
        });
        if(json.status===201){
            runInAction(()=>{
                this.hasContainer=true;
            });
            notification.success({
                message:'开通成功'})
        }else{
            notification.error({
                message:'失败,请联系管理员'});
        }

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
        if(file.size>1024*1024*1024){
            notification.error({
                message:'单个文件不能大于1G'
            });
            this.uploadRef.props.onRemove();
            return false;
        }
        if((this.total+file.size)>1024*1024*1024*10){
            notification.error({
                message:'网盘总量为10G,无法上传该文件,请先清除不必要文件'
            });
            this.uploadRef.props.onRemove();
            return false;
        }
        this.fileList=[...this.fileList,file];
        return false;
    };

    @action
    clearFileList=()=>{
        this.fileList=[];
    };

    @action
    createFolder=async (values)=>{
        runInAction(()=>{
            this.uploading=true;
        });
        const {folderName}=values;
        const filePath=this.selectRow.name;
        const username=JSON.parse(sessionStorage.getItem("user")).user_name;
        let json=await post(`${baseUrl}/swift/createFolder`,{
            filePath:filePath+folderName,username
        });
        runInAction(()=>{
            this.uploading=false;
        });
        if(json.status===201){
            notification.success({
                message:'新建成功',
            })
        }else{
            notification.error({
                message:'后台错误，请联系管理员',
            })
        }
        this.toggleFormVisible();
        this.loadRootDir();
    };

    @action
    handleUpload=async ()=>{

        runInAction(()=>{
            this.uploading=true;
        });
        const formData = new FormData();
        this.fileList.filter(d=>d).forEach((file) => {
            formData.append('files[]', file);
        });
        await axios({url:`${baseUrl}/swift/upload`,
            method:'POST',
            headers: {
                //'Content-Type': 'multipart/form-data',//application/x-www-form-urlencoded
                'User-Name':JSON.parse(sessionStorage.getItem("user")).user_name,
                'Folder-Path':this.selectRow.name.split('/').map(p=>encodeURI(p)).join('/'),
                //'filename': encodeURI(file.name),
                'Access-Token': sessionStorage.getItem('access-token') || '' // 从sessionStorage中获取access token
            },
            data:formData
        });

        runInAction(()=>{
            this.uploading=false;
        });
        this.toggleFileFormVisible();
        this.loadRootDir();
    };


    @action
    toggleFileFormVisible=()=>{
        this.fileFormVisible=!this.fileFormVisible;
    };

    @action
    toggleFormVisible=()=>{
        this.formVisible=!this.formVisible;
    };

    @action
    showFileForm=(record,text)=>(()=>{
        runInAction(()=>{
            this.selectRow=record;
        });
        this.toggleFileFormVisible();
    });

    @action
    showForm=(record)=>(()=>{
       runInAction(()=>{
           this.selectRow=record;
       });
       this.toggleFormVisible();
    });

    @action
    delete=(record)=>(async ()=>{
        runInAction(()=>{
            this.inDowning=true;
            this.loadingtest='正在向服务器请求删除';
        });
        const username=JSON.parse(sessionStorage.getItem("user")).user_name;
        let json=await post(`${baseUrl}/swift/delete`,{
            filePath:record.name,username
        });
        runInAction(()=>{
            this.inDowning=false;
        });
        if(json.status===204){
            notification.success({
                message:'删除成功'})
        }else{
            notification.error({
                message:'后台错误，请联系管理员'
            })
        }
        this.loadRootDir();

    });

    @action
    download2=(record)=>(async ()=>{
        runInAction(()=>{
            this.inDowning=true;
            this.loadingtest='正在向服务器请求下载';
        });
        let response=await fetch(`${baseUrl}/swift/download`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Token': sessionStorage.getItem('access-token') || '' // 从sessionStorage中获取access token
            },
            body:JSON.stringify({...record,username:JSON.parse(sessionStorage.getItem("user")).user_name})
        });
        //console.log(response);
        let blob=await response.blob();
        let a = document.createElement('a');
        let url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
        a.href = url;
        a.download = record.filename;
        runInAction(()=>{
            this.inDowning=false;
        });
        a.click();
        window.URL.revokeObjectURL(url);
    });

    @action
    download=(record)=>(async ()=>{
        runInAction(()=>{
            this.inDowning=true;
            this.loadingtest='正在向服务器请求下载';
        });
        let response=await axios({url:`${baseUrl}/swift/download`,
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Token': sessionStorage.getItem('access-token') || '' // 从sessionStorage中获取access token
            },
            data:JSON.stringify({...record,username:JSON.parse(sessionStorage.getItem("user")).user_name}),
            responseType: 'blob'
        });
        let blob= response.data;
        let a = document.createElement('a');
        let url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
        a.href = url;
        a.download = record.filename;
        runInAction(()=>{
            this.inDowning=false;
        });
        a.click();
        window.URL.revokeObjectURL(url);

    });

    @action
    loadRootDir=async ()=>{
        runInAction(()=>{
            this.inDowning=true;
            this.loadingtest='请求网盘信息...';
        });
        let json=await get(`${baseUrl}/swift/getObject/${JSON.parse(sessionStorage.getItem("user")).user_name}`);
        if(json.status){
            notification.error({
                message:'云平台权限认证失败,请尝试刷新页面或联系管理员',
            });
            runInAction(()=>{
                this.inDowning=false;
            });
            return;
        }
        let temps=[];
        let mertix={}
        let maxLength=0;
        for(let i=0;i<json.length;i++){
            let length=json[i].name.split('/').filter(d=>d).length;
            json[i].hierachy=length;
            json[i].filename=json[i].name.split('/').filter(d=>d).pop()+(/\/$/.test(json[i].name)?'/':'');
            if(length>maxLength){
                maxLength=length;
                mertix[maxLength]=[];
            }
        }
        for(let i=1;i<=maxLength;i++){
            mertix[i]=mertix[i].concat(json.filter(d=>d.hierachy===i));
        }
        temps=mertix[1];
        this._compoent(temps,mertix,1,maxLength);
        runInAction(()=>{
            this.rootDir=temps?temps:[];
            this.inDowning=false;
            this.total=json.length===0?0:json.filter(d=>d).map(d=>d.bytes).reduce((a,b)=>a+b)
        });
    };

    _compoent=(temps,mertix,currentHierachy,maxLength)=>{
        if(currentHierachy<maxLength){
            currentHierachy++;
            for(let i=0;i< temps.length;i++){
                if(mertix[currentHierachy].filter(d=>d.name.indexOf(temps[i].name)===0).length>0){
                    temps[i].children=mertix[currentHierachy].filter(d=>d.name.indexOf(temps[i].name)===0);
                    this._compoent(temps[i].children,mertix,currentHierachy,maxLength)
                }
            }
        }

    };


}


function sdsd(obj){
    let result={};
    for(let o of obj){
        for(let key in o){
            if( o[key].status && o[key].status===40101 ){
                return { ok: false, msg: '无效Token！', status: 40101 };
            }
            key.replace(/data_monitor_(\w+)-\d+/,(w,p)=>{
                result[p]=o[key]['page_data'];
            }) ;
        }
    }
    return result;
}


