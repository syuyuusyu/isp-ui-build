import {observable, configure,action,runInAction,} from 'mobx';
import {notification} from 'antd';
import {baseUrl,get,del} from '../util';
import {message} from "antd/lib/index";

configure({ enforceActions: true });

export class OrgStore{
  @observable
  treeData=[];

  @observable
  currentOrgId=-1;

  @observable
  currentOrgName='';

  @observable
  currentMenuOrgs=[];

  @observable
  selectedOrg={};

  @observable
  orgFormVisible=false;

  @observable
  orgUserFormVisible=false;

  @observable
  selectOrgid=-1;

  @observable
  selectOrgName='';

  @observable
  orgAddVisiblef=false;

  @observable
  isLeaf=0;

  @observable
  currrentPath='';

  @observable
  currentTable=[];

  @observable
  allUser=[];

  @observable
  iconType=["edit",'delete',"question","question-circle-o","question-circle",'play-circle','play-circle-o',"plus","plus-circle-o",
    "plus-circle","pause","minus", "minus-circle-o",'profile',
    "solution","info","info-circle-o","exclamation-circle-o","close","close-circle-o","check","check-circle-o","save"
  ];

  @observable
  selectedRowKeys=[];

  @action
  onLoadData=async(treeNode)=>{
    const parentId=treeNode.props.dataRef.id;
    let json=await get(`${baseUrl}/org/orgMenu/${parentId}`);
    //let json=await response.json();
    runInAction(()=>{
      treeNode.props.dataRef.children=json;
      this.treeData=[...this.treeData];
    })

  };

  @action
  treeSelect=(selectedKeys,e)=>{
    this.currentOrgId=e.node.props.dataRef.id;
    this.isLeaf=e.node.props.dataRef.is_leaf;
    this.currentOrgName=e.node.props.dataRef.name;
    this.currrentPath=e.node.props.dataRef.path;
    this.loadCurrentOrg();
  };

  @action
  loadCurrentOrg=async ()=>{
    if(this.isLeaf==='0'){
    let json=await get(`${baseUrl}/org/currentOrgs/${this.currentOrgId}`);
    runInAction(()=>{
      this.currentMenuOrgs=json;
      //this.currentTable=json;
    })}
    if(this.isLeaf==='1'){
      let json=await get(`${baseUrl}/org/currentOrgIsLeaf/${this.currentOrgId}`);
      runInAction(()=>{
        this.currentMenuOrgs=json;
      })
    }
  };

  @action
  initRoot=async ()=>{
    let json=await get(`${baseUrl}/org/orgMenu/0`);
    //let json=await response.json();
    runInAction(()=>{
      this.treeData=json;
      //this.currentTable=json;
    })
  };

  @action
  showOrgForm=(record)=>(()=>{
    if(this.currentOrgId===-1){
      message.error('请先选中一个机构！');
      return;
    }
    this.selectedOrg=record;
    this.toggleOrgFormVisible();
  });

  @action
  showOrgUserForm=(record)=>(()=>{
    if(this.currentOrgId===-1){
      message.error('清先选择一个机构！');
      return;
    }
    this.selectedOrg=record;
    this.toggleOrgUserFormVisible();
  });

  @action
  showAddOrgForm=(record)=>(()=>{
    //let result=(this.currentOrgId===-1);
    if(this.currentOrgId===-1){
      message.error('请先选中一个机构！');
      return;
    }
    this.selectedOrg=record;
    this.toggleOrgAddVisible();
  });

  @action
  toggleOrgFormVisible=()=>{
    this.orgFormVisible=!this.orgFormVisible;
  };

  @action
  toggleOrgUserFormVisible=()=>{
    this.orgUserFormVisible=!this.orgUserFormVisible;
  };

  @action
  deleteOrgDetailed=(id)=>(async ()=>{
    let json=await del(`${baseUrl}/org/delete/${id}`);
    if(json.success){
      notification.success({
        message:'删除成功'})
    }else{
      notification.error({
        message:'后台错误，请联系管理员'
      })
    }
    this.loadCurrentOrg();
  });

  @action
  toggleOrgAddVisible=()=>{
    this.orgAddVisiblef=!this.orgAddVisiblef;
  };

  @action
  getAllUser=async ()=>{
    let json=await get(`${baseUrl}/org/allUser`);
    runInAction(
      ()=>{this.allUser=json}
    );
  };

  @action
  getQueryUser=async (value)=>{
    if(value!==''){
    let json=await get(`${baseUrl}/org/QueryUser/${value}`);
    runInAction(
      ()=>{this.allUser=json}
    );
      notification.success({
        message:'查询成功'})
    }
  };
}






