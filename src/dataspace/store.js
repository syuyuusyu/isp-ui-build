import {observable, configure, action, runInAction,} from 'mobx';
import {baseUrl, get, post} from '../util';
import {Modal, notification} from 'antd';

configure({ enforceActions: 'observed' });


export class DataSpaceStore {

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable
  dataAcc = [];

  @observable
  spaces = [];

  @observable
  allSpaces=[];

  @observable
  loading = false;

  @observable
  loadingtest = '';

  @observable
  formVisible = false;

  @observable
  selectedAccId='';

  @observable
  formDisplay = 'none';

  @observable
  autoextensibleDisplay='none';

  @observable
  required=false;

  @action
  toggleFormVisible = () => {
    this.formVisible = !this.formVisible;
  };

  @action
  changeAutoextensibleDisplay1=()=>{
    this.autoextensibleDisplay='';
    this.required=true;
  };

  @action
  changeAutoextensibleDisplay2=()=>{
    this.autoextensibleDisplay='none';
  };

  showForm = () => {
      console.log(1111);
    /*if(!this.selectedAccId){
        notification.error({
            message:'请先选择数据库实列'});
        return;
    }*/
    this.toggleFormVisible();
  };

  scheduleToken = () => {
    get(`${baseUrl}/invoke/dataToken`);
  };


  @action
  loadDataAcc = async () => {
    runInAction(() => {
      this.loading = true;
      this.loadingtest = '获取数据库实例...'
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
    } else {
      runInAction(() => {
        this.dataAcc = json;
        this.loading = false;
      });
      runInAction(() => {
        this.loading = true;
        this.loadingtest = '获取表空间列表...'
      });
      //遍历数据库实例dataAcc.result(数组),根据实例id获取表空间列表
      for(let i of this.dataAcc.result){
        let json = await post(`${baseUrl}/invoke/data_space_list`, {id: i.id});
        if(json===undefined){
          notification.error({
            message: '连接大数据平台失败,请尝试刷新页面或联系管理员'
          });
          runInAction(() => {
            this.loading = false;
          });
        } else if (json.success) {
          runInAction(() => {
            this.spaces = json.result;
            this.loading = false;
          });
          //将实例名称加入每个表空间信息中
          for(let j of this.spaces){
            j.instanceName=i.name;
            runInAction(()=>{this.allSpaces.push(j);})
          }
        } else {
          notification.error({
            message: '获取表空间列表失败,请尝试刷新页面或联系管理员'
          });
          runInAction(() => {
            this.spaces = [];
            this.loading = false;
          });
        }
      }

    }

  };

  @action
  selectedAcc = (e) => {
    this.selectedAccId = e;
    if(this.selectedAccId!==''){
      this.formDisplay='';
    }
    //this.loadDataSpace(e);
  };

  @action
  afterClose=()=>{
    this.formDisplay='none';
    this.autoextensibleDisplay='none';
  };

  @action
  loadDataSpace = async (id) => {
    runInAction(() => {
      this.loading = true;
      this.loadingtest = '获取表空间列表...'
    });
    let json = await post(`${baseUrl}/invoke/data_space_list`, {
      id: id
    });
    if (json.success) {
      runInAction(() => {
        this.spaces = json.result;
        this.loading = false;
      });
    } else {
      notification.error({
        message: '获取表空间列表失败,请尝试刷新页面或联系管理员'
      });
      runInAction(() => {
        this.spaces = [];
        this.loading = false;
      });
    }
  };

  @action
  save = async (values) => {
    runInAction(() => {
      this.loading = true;
      this.loadingtest = '新建中...'
    });
    if(values.maxbytes===undefined){
      values.maxbytes='';
    }
    if(values.next_byte===undefined){
      values.next_byte='';
    }
    let json = await post(`${baseUrl}/invoke/data_create_space`, {
      tablespace_name: values.name,
      type: values.type,
      id: this.selectedAccId,
      files:values.files,
      total:values.total,
      autoextensible:values.autoextensible,
      maxbytes:values.maxbytes,
      next_byte:values.next_byte
    });
    if (json.success) {
      notification.info({
        message: '新建成功'
      });
    } else{
      Modal.error({title: '新建失败',content:`失败信息为：${json.message}`})
    }
    this.toggleFormVisible();
    this.loadDataSpace(this.selectedAccId);
    runInAction(() => {
      this.loading = false;
    });
  };
}
