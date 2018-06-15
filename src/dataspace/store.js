import {observable, configure, action, runInAction,} from 'mobx';
import {baseUrl, get, post} from '../util';
import {notification} from 'antd';

configure({enforceActions: true});


export class DataSpaceStore {

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable
  dataAcc = [];

  @observable
  spaces = [];

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
  testData = [{"id": "test1", "name": "drt1"}, {"id": "test2", "name": "drt2"}, {"id": "test3", "name": "drt3"}];

  @action
  toggleFormVisible = () => {
    this.formVisible = !this.formVisible;
  };

  showForm = () => {
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
      this.loadingtest = '获取数据库实列...'
    });
    let json = await post(`${baseUrl}/invoke/data_acc`);
    if (json.status) {
      notification.error({
        message: '获取数据库实列失败,请尝试刷新页面或联系管理员'
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
  }

  @action
  loadDataSpace = async (id) => {
    runInAction(() => {
      this.loading = true;
      this.loadingtest = '获取表空间列表...'
    });
    let json = await post(`${baseUrl}/invoke/data_space_list`, {
      id: id
    });
    console.log('----', json);
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
      this.loadingtest = '保存中...'

    });
    let json = await post(`${baseUrl}/invoke/data_create_space`, {
      tablespace_name: values.name,
      type: values.type,
      id: this.selectedAccId
    });
    if (json.success) {
      notification.info({
        message: '新建成功'
      });
    } else {
      notification.error({
        message: '新建失败'
      });
    }
    this.toggleFormVisible();
    this.loadDataSpace(this.selectedAccId);
    runInAction(() => {
      this.loading = false;

    });
  };


}
