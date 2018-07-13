import {observable, configure, action, runInAction,} from 'mobx';
import {baseUrl, get, post} from '../util';
import {notification} from 'antd';
import {message, Modal} from "antd/lib/index";

configure({enforceActions: true});


export class CloudStore {

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable
  serverInfo = [];

  @observable
  images = [];

  @observable
  networks = [];

  @observable
  flavors = [];

  @observable
  loading = false;

  @observable
  loadingtest = '';

  @observable
  formVisible = false;

  @observable
  flavorsColor = {};

  @observable
  networksColor = {};

  @observable
  imagesColor = {};

  @observable
  flavorsBorder={};

  @observable
  networksBorder={};

  @observable
  imagesBorder={};

  @observable
  flavorsFontColor={};

  @observable
  networksFontColor={};

  @observable
  imagesFontColor={};

  @observable
  flavorId = '';

  @observable
  networkId = '';

  @observable
  imageId = '';

  @observable
  formDisplay='none';
  //formDisplay='';

  @observable
  keyPairs=[];

  @observable
  selectKeyPairValue='';

  @observable
  s02url='';

  @observable
  keyPairsDisplay='none';
  //keyPairsDisplay='';


  @action
  toggleFormVisible = () => {
    this.formVisible = !this.formVisible;
  };

  scheduleToken = () => {
    get(`${baseUrl}/invoke/cloudToken`);
  };

  @action
  loadServerInfo = async () => {
    runInAction(() => {
      this.loading = true;
      this.loadingtest = '获取云机状态...'
    });
    let json = await post(`${baseUrl}/invoke/cloud_servers_info`);
    runInAction(() => {
      if(json===undefined){
        notification.error({
          message: '连接云平台失败,请尝试刷新页面或联系管理员'
        });
        this.loading = false;
      }else if (json.code && json.code === 500) {
        this.serverInfo = [];
        notification.error({message: '连接云平台失败',});
        this.loading = false;
      } else {
        this.serverInfo = json;
        this.loading = false;
      }
    });

  };

  @action
  loadFormInput = async () => {
    runInAction(() => {
      this.loading = true;
      this.loadingtest = '正在向云平台获取表单信息...'
    });
    let json=await post(`${baseUrl}/invoke/cloud_form`);
    if(json===undefined){
      notification.error({
        message: '连接云平台失败,请尝试刷新页面或联系管理员'
      });
      runInAction(() => {
        this.loading = false;
      })
    } else if (json.status && json.status === 500) {
      notification.error({message: '连接云平台失败',});
      runInAction(() => {
        this.loading = false;
      })
    } else {
      runInAction(() => {
        this.images = json.image;
        this.networks = json.network;
        this.flavors = json.flavors;
        this.loading = false;
      });
      for (let i = 0; i < this.flavors.length; i++) {
        const id = this.flavors[i].id;
        //虚拟机类型未选中时的按钮背景颜色
        this.flavorsColor[id] = '#fff';
        //虚拟机类型未选中时的描边
        this.flavorsBorder[id]='1px solid #ccc ';
        //虚拟机类型未选中时的字体颜色
        this.flavorsFontColor[id]= '#333';
      }
      for (let i = 0; i < this.images.length; i++) {
        const id = this.images[i].id;
        //镜像类型未选中时的按钮背景颜色
        this.imagesColor[id] = '#fff';
        //镜像类型未选中时的描边
        this.imagesBorder[id]='1px solid #ccc';
        //镜像类型未选中时的字体颜色
        this.imagesFontColor[id]='#333';
      }
      for (let i = 0; i < this.networks.length; i++) {
        const id = this.networks[i].id;
        //网络类型未选中时的按钮背景颜色
        this.networksColor[id] = '#fff';
        //网络类型未选中时的描边
        this.networksBorder[id]='1px solid #ccc';
        //网络类型未选中时的字体颜色
        this.networksFontColor[id]='#333';
      }
    }

  };

  @action
  loadKeyPairs=async ()=>{
    runInAction(() => {
      this.loading = true;
      this.loadingtest = '正在获取用户密钥信息...'
    });
    let json = await post(`${baseUrl}/invoke/cloud_keypair_value`);
    if(json===undefined){
      notification.error({
        message: '连接云平台失败,请尝试刷新页面或联系管理员'
      });
      runInAction(() => {
        this.loading = false;
      })
    } else if(json.length===0){
      Modal.confirm({title: `该登录用户没有密钥，点击'OK'按钮跳转至云平台创建密钥！`,
        onOk: () => {
          window.history.back(-1);
          //window.open('http://10.10.50.20/compute/keyPair-list?_token=a7f8ee9d6c7d4f0c80b7773154c281dd');
          window.open(this.s02url);
        },
        onCancel:()=>{
          window.history.back(-1);
        }
      });
    }else{runInAction(()=>{
      this.keyPairs=json;
      this.loading=false;
      setTimeout(this.keyPairsDisplay='',500)
    })}
  }

  @action
  detail = (record) => (() => {

  });

  @action
  onClickFlavors = (value) => {
    for (let i in this.flavorsColor) {
      this.flavorsColor[i] = '#fff';
      this.flavorsBorder[i]='1px solid #ccc';
      this.flavorsFontColor[i]='#333';
    }
    //被点击的虚拟机类型的按钮背景颜色
    this.flavorsColor = {...this.flavorsColor, [value]: '#fff'};
    //被点击的虚拟机类型的描边
    this.flavorsBorder={...this.flavorsBorder, [value]: '1px solid #f75b52'};
    //被点击的虚拟机类型的字体颜色
    this.flavorsFontColor={...this.flavorsFontColor, [value]: '#f75b52'};
    this.flavorId = value;
  };

  @action
  onClickImages = (value) => {
    for (let i in this.imagesColor) {
      this.imagesColor[i] = '#fff';
      this.imagesBorder[i]='1px solid #ccc';
      this.imagesFontColor[i]='#333';
    }
    //被点击的镜像类型的按钮背景颜色
    this.imagesColor = {...this.imagesColor, [value]: '#fff'};
    //被点击的镜像类型的描边
    this.imagesBorder={...this.imagesBorder, [value]: '1px solid #f75b52'};
    //被点击的镜像类型的字体颜色
    this.imagesFontColor={...this.imagesFontColor, [value]: '#f75b52'};
    this.imageId = value;
  };

  @action
  onClickNetworks = (value) => {
    for (let i in this.networksColor) {
      this.networksColor[i] = '#fff';
      this.networksBorder[i]='1px solid #ccc';
      this.networksFontColor[i]='#333';
    }
    //被点击的网络类型的按钮背景颜色
    this.networksColor = {...this.networksColor, [value]: '#fff'};
    //被点击的网络类型的描边
    this.networksBorder={...this.networksBorder, [value]: '1px solid #f75b52'};
    //被点击的网络类型的字体颜色
    this.networksFontColor={...this.networksFontColor, [value]: '#f75b52'};
    this.networkId = value;
  };

  @action
  selectKeyPairs=(e)=>{
    this.selectKeyPairValue=e;
    if(this.selectKeyPairValue!==''){
      this.formDisplay='';
    }
  }

  @action
  getS02Url=async ()=>{
    let json=await get(`${baseUrl}/s02Url/getS02Url`);
    const cloudToken=json.cloudToken;
    const ip=json.ip;
    this.s02url=ip+'/toIndex?_token='+cloudToken+'&_url=/compute/keyPair-list';
    console.log("this.s02url的值为:",this.s02url);
  }
}
