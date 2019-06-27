import {observable, configure, action, runInAction,} from 'mobx';
import {notification,message, Modal} from 'antd';
import {baseUrl, get, del, post} from '../util';


configure({ enforceActions: 'observed' });

export class MenuManageStore {
  @observable
  treeData = [];

  @observable
  currentMenuId = -1;

  @observable
  hierachy=1;

  @observable
  currentMenuName = '';

  @observable
  isLeaf = 0;

  @observable
  currrentMenuPath = '';

  @observable
  currentMenus = [];

  @observable
  selectedMenu = {};

  @observable
  menuAddVisiblef = false;

  @observable
  menuModifyFormVisible=false;

  @action
  initRoot = async () => {
    let json = await get(`${baseUrl}/menuManage/menu/-1`);
    runInAction(() => {
      this.treeData = json;
      this.treeData[0].text='菜单管理';
    })
  };

  onLoadData = async (treeNode) => {
    const parentId = treeNode.props.dataRef.id;
    let json = await get(`${baseUrl}/menuManage/menu/${parentId}`);
    runInAction(() => {
      treeNode.props.dataRef.children = json;
      this.treeData = [...this.treeData];
    })
  };

  @action
  treeSelect = (selectedKeys, e) => {
    this.currentMenuId = e.node.props.dataRef.id;
    this.hierachy=e.node.props.dataRef.hierachy;
    this.currentMenuName = e.node.props.dataRef.text;
    this.isLeaf=e.node.props.dataRef.is_leaf;
    this.currrentMenuPath = e.node.props.dataRef.menu_path;
    this.loadCurrentMenu();
  };

  @action
  loadCurrentMenu = async () => {
    if (this.isLeaf === '0') {
      let json = await get(`${baseUrl}/menuManage/currentMenus/${this.currentMenuId}`);
      runInAction(() => {
        this.currentMenus = json;
      })
    }
    if (this.isLeaf === '1'){
      let json = await get(`${baseUrl}/menuManage/currentMenusIsLeaf/${this.currentMenuId}`);
      runInAction(() => {
        this.currentMenus = json;
      })
    }
  };

  @action
  showAddMenuForm = (record) => (() => {
      if (this.currentMenuId === -1) {
        message.error('请先选中一个菜单！');
        return;
      } else if (this.currentMenuId === 20) {
        Modal.warning({title: '服务目录菜单下不允许新建菜单'})
      } else if (this.currentMenuId === 27) {
        Modal.warning({title: '个人云盘菜单下不允许新建菜单'})
      } else if (this.currentMenuId === 17) {
        Modal.warning({title: '平台功能配置菜单下不允许新建菜单'})
      }else{
      this.selectedMenu = record;
      this.toggleMenuAddVisible();}
    }
  );

  @action
  showMenuModifyForm=(record)=>(()=>{
    this.selectedMenu = record;
    this.toggleMenuModifyVisible();
  });

  @action
  toggleMenuAddVisible = () => {
    this.menuAddVisiblef = !this.menuAddVisiblef;
  };

  @action
  toggleMenuModifyVisible=()=>{
    this.menuModifyFormVisible=!this.menuModifyFormVisible;
  };

  @action
  deleteMenu=(id)=>(async ()=>{
    if (id === 20) {
      Modal.warning({title: '服务目录菜单不允许删除'})
    } else if (id === 27) {
      Modal.warning({title: '个人云盘菜单不允许删除'})
    } else if (id === 17) {
      Modal.warning({title: '平台功能配置菜单不允许删除'})
    }else{
      let json=await get(`${baseUrl}/menuManage/delete/${id}`);
      if(json.success){
        notification.success({
          message:'删除成功'})
      }else{
        notification.error({
          message:'后台错误，请联系管理员'
        })
      }
      this.loadCurrentMenu();
     }
  });

}
