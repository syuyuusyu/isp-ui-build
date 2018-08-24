import {observable, configure, action, runInAction,} from 'mobx';
import {baseUrl, get, post} from '../util';
import {Modal, notification} from 'antd';

configure({enforceActions: true});

export class OracleUserStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable
  dataAcc = [];

  @observable
  loading=false;

  @observable
  loadingInfo='';

  @observable
  oracleUser=[];

  @observable
  allOracleUser=[];

  @observable
  allOracleUserBack=[];

  @observable
  formVisible = false;

  @observable
  selectedAccId='';

  @observable
  formDisplay = 'none';

  @observable
  spaces = [];

  @observable
  defaultSpaces=[];

  @observable
  temporarySpaces=[];

  @observable
  defaultSpacesName='';

  @observable
  temporarySpacesName='';

  @observable
  defaultSpacesBorder={};

  @observable
  temporarySpacesBorder={};

  @observable
  defaultSpacesFontColor={};

  @observable
  temporarySpacesFontColor={};

  @observable
  queryOracleUser='';


  @action
  loadDataAcc = async () =>{
    runInAction(() => {
      this.loading = true;
      this.loadingInfo = '获取数据库实例...'
    });
    let json = await post(`${baseUrl}/invoke/data_oracle_acc`);

    if(json===undefined){
      notification.error({
        message: '连接大数据平台失败,请尝试刷新页面或联系管理员'
      });
      runInAction(() => {
        this.dataAcc = [];
        this.loading = false;
        this.loadingInfo='';
      });
    }else if (!json.success) {
      notification.error({
        message: '获取数据库实例失败,请尝试刷新页面或联系管理员'
      });
      runInAction(() => {
        this.dataAcc = [];
        this.loading = false;
        this.loadingInfo='';
      });
    }else{
      runInAction(() => {
        this.dataAcc = json.result;
        this.loading = false;
        this.loadingInfo='';
      });
      runInAction(() => {
        this.loading = true;
        this.loadingInfo = '获取用户列表...'
      });
    }
    //遍历数据库实例dataAcc(数组),根据实例id获取用户列表
    for(let i of this.dataAcc){
      let json = await post(`${baseUrl}/invoke/data_oracle_user_list`, {id: i.id});
      if(json===undefined){
        notification.error({
          message: '连接大数据平台失败,请尝试刷新页面或联系管理员'
        });
        runInAction(() => {
          this.loading = false;
          this.loadingInfo='';
        });
      }else if (json.success) {
        runInAction(() => {
          this.oracleUser = json.result;
          this.loading = false;
          this.loadingInfo='';
        });
        //将实例名称加入每个用户信息中
        for(let j of this.oracleUser){
          j.instanceName=i.name;
          runInAction(()=>{this.allOracleUser.push(j);
            this.allOracleUserBack=this.allOracleUser;
          })
        }
      }else {
        notification.error({
          message: '获取用户列表失败,请尝试刷新页面或联系管理员'
        });
        runInAction(() => {
          this.oracleUser = [];
          this.loading = false;
          this.loadingInfo='';
        });
      }
    }
  };

  @action
  loadDataAccForCreate=async ()=>{
    runInAction(() => {
      this.loading = true;
      this.loadingInfo = '获取数据库实例...'
    });
    let json = await post(`${baseUrl}/invoke/data_oracle_acc`);
    if(json===undefined){
      notification.error({
        message: '连接大数据平台失败,请尝试刷新页面或联系管理员'
      });
      runInAction(() => {
        this.dataAcc = [];
        this.loading = false;
      });
    }else if (!json.success) {
      notification.error({
        message: '获取数据库实例失败,请尝试刷新页面或联系管理员'
      });
      runInAction(() => {
        this.dataAcc = [];
        this.loading = false;
      });
    }else{
      runInAction(() => {
        this.dataAcc = json.result;
        this.loading = false;
      });
    }
  };

  @action
  toggleFormVisible = () => {
    this.formVisible = !this.formVisible;
  };

  @action
  showForm = () => {
    this.toggleFormVisible();
  };

  @action
  selectedAcc =  (e) => {
    this.selectedAccId = e;
    this.loadDataSpace(this.selectedAccId);
  };

  @action
  loadDataSpace=async (selectedAccId)=>{
    if(selectedAccId!==''){
      runInAction(() => {
        this.loading = true;
        this.loadingInfo = '正在获取表空间列表...'
      });
      let json = await post(`${baseUrl}/invoke/data_space_list`, {id: selectedAccId});
      if(json===undefined){
        notification.error({
          message: '连接大数据平台失败,请尝试刷新页面或联系管理员'
        });
        runInAction(() => {
          this.loading = false;
          this.loadingInfo='';
        });
      }else if (json.success) {
        runInAction(() => {
          this.spaces = json;
          this.loading = false;
          this.formDisplay='';
        });
        if(this.spaces.result.length>0){
          for(let i of this.spaces.result){
            if(i.type==='PERMANENT'||i.type==='UNDO'){
              runInAction(()=>{
                this.defaultSpaces.push(i);
              });
              this.initDefaultSpacesStyle();
            }else{
              runInAction(()=>{
                this.temporarySpaces.push(i);
              });
              this.initTemporarySpacesStyle();
            }
          }
        }
      }else {
        notification.error({
          message: '获取表空间列表失败,请尝试刷新页面或联系管理员'
        });
        runInAction(() => {
          this.spaces = [];
          this.loading = false;
          this.loadingInfo='';
        });
      }
    }
  };

  @action
  initDefaultSpacesStyle=()=>{
    for(let i of this.defaultSpaces){
      const tablespaceName=i.tablespace_name;
      this.defaultSpacesBorder[tablespaceName]='1px solid #ccc ';
      this.defaultSpacesFontColor[tablespaceName]='#333';
    }
  };

  @action
  initTemporarySpacesStyle=()=>{
    for(let i of this.temporarySpaces){
      const tablespaceName=i.tablespace_name;
      this.temporarySpacesBorder[tablespaceName]='1px solid #ccc ';
      this.temporarySpacesFontColor[tablespaceName]='#333';
    }
  };


  @action
  onClickDefaultSpaces=(value)=>{
    for(let i in this.defaultSpacesBorder){
      this.defaultSpacesBorder[i]='1px solid #ccc ';
    }
    for(let i in this.defaultSpacesFontColor){
      this.defaultSpacesFontColor[i]='#333';
    }
    this.defaultSpacesBorder={...this.defaultSpacesBorder,[value]:'1px solid #f75b52'};
    this.defaultSpacesFontColor={...this.defaultSpacesFontColor,[value]:'#f75b52'}
    this.defaultSpacesName=value;
  };

  @action
  onClickTemporarySpaces=(value)=>{
    for(let i in this.temporarySpacesBorder){
      this.temporarySpacesBorder[i]='1px solid #ccc ';
    }
    for(let i in this.temporarySpacesFontColor){
      this.temporarySpacesFontColor[i]='#333';
    }
    this.temporarySpacesBorder={...this.temporarySpacesBorder,[value]:'1px solid #f75b52'};
    this.temporarySpacesFontColor={...this.temporarySpacesFontColor,[value]:'#f75b52'}
    this.temporarySpacesName=value;
  };

  @action
  save=async (values)=>{
    runInAction(
      ()=>{
        this.loading=true;
        this.loadingInfo='新建Oracle用户中...';
      }
    );
    if(this.defaultSpacesName===''){
      runInAction(() => {
        this.loading = false;
        this.loadingInfo='';
      });
      return notification.error({
        message:'请选择默认表空间'});
    }else if(this.temporarySpacesName===''){
      runInAction(() => {
        this.loading = false;
        this.loadingInfo='';
      });
      return notification.error({
        message:'请选择临时表空间'});
    }
    let json=await post(`${baseUrl}/invoke/data_oracle_create_user`,{
      username:values.name,
      password:values.password,
      defaultTbs:this.defaultSpacesName,
      tempTbs:this.temporarySpacesName,
      id:this.selectedAccId
    });
    console.log("json的值为:",json);
    if(json===undefined){
      notification.error({
        message: '连接大数据平台失败,请尝试刷新页面或联系管理员'
      });
    }else if (json.success) {
      Modal.success({
        title: '新建成功！',
        content:'点击\'OK\'按钮跳转至Oracle用户列表页面',
        onOk: () => {
          window.location.href='/oracleUser';
        },
      });
    }else{
      Modal.error({title: '新建失败',content:`失败信息为：${json.message}`})
    }
    runInAction(() => {
      this.loading = false;
      this.loadingInfo='';
    });
  }


  @action
  setQueryOracleUser=(queryOracleUser)=>{
    this.queryOracleUser=queryOracleUser;
  }

  @action
  loadQueryOracleUser=()=>{
    if(this.queryOracleUser===''){
      this.allOracleUser=this.allOracleUserBack;
    }else{
      this.allOracleUser=this.allOracleUserBack;
      for(let i of this.allOracleUser){
        if(i.username===this.queryOracleUser){
          this.allOracleUser=[];
          this.allOracleUser.push(i);
        }
      }
    }
  };

  @action
  initStatus=()=>{
    this.formDisplay='none';
  }
}
