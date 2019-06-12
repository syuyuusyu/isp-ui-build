import {observable, configure,action,runInAction,computed} from 'mobx';
import {baseUrl,get} from '../util';

configure({ enforceActions: true });

export class TreeStore{

    constructor(rootStore){
        this.rootStore=rootStore;
    }

    @observable
    treeData=[];


    @observable
    currentRoleMenu=[];

    @observable
    menuTreeData=[];

    @observable
    currentRoleSys=[];

    @observable
    winWidth=0;

    @observable
    winHeight=0;

    @observable
    headerHeight = 60;

    @observable
    menuHeight = 60;

    @observable
    footerHeight = 40;

    @action
    loadMenuTree=async()=>{
        let json=await get(`${baseUrl}/menu/menuTree`);
        runInAction(()=>{
           this.menuTreeData=json;
            this.currentRoleMenu=[];
        });
        this.initMenuTreeData(json);
    };

    initMenuTreeData=(data)=>{
        data.forEach(item=>{
            this.pushMenuTreeData(item);
            if(item.children){
                this.initMenuTreeData(item.children);
            }
        })
    };

    @action
    pushMenuTreeData=(item)=>{
        if(item.path){
            this.currentRoleMenu.push(item);
        }

    };

    @action
    initCurrentRoleMenu=async ()=>{
        let json=await get(`${baseUrl}/menu/currentRoleMenu`);
        runInAction(()=>{
            this.currentRoleMenu=json;
        });
    };

    @action
    initRoot=async (parentId)=>{
        let json=await get(`${baseUrl}/menu/currentMenu/1`);
        runInAction(()=>{
            this.treeData=json;
        });
    };

    @action
    onLoadData=async (treeNode)=>{
        const parentId=treeNode.props.dataRef.id;
        let json=await get(`${baseUrl}/menu/currentMenu/${parentId}`);
        //let json=await response.json();
        runInAction(()=>{
            treeNode.props.dataRef.children=json;
            this.treeData=[...this.treeData];
        })
    };

    @observable
    currentRoute=[];

    // @computed
    // get currentRoute

    @action
    onSelect=(key,e)=>{
        this.treeData.filter(d=>d).forEach(data=>{
            getPathById(e.node.props.dataRef.id,Object.create(data),(result)=>{
                runInAction(()=>{
                    this.currentRoute=result;
                });
            })
        });

    };

    @action
    onMenuClick=(e)=>{
        //this.rootStore.notificationStore.loadMessage();
        this.rootStore.activitiStore.loadCurrentTask();
        let clone=this.menuTreeData.filter(d=>d);
        clone.forEach(data=>{
          getPathById(e.key,data,(result)=>{
            runInAction(()=>{
                console.log(result);
              this.currentRoute=result;
            });
          })
        });

    };


    onMenuSelect=(a,b,c)=>{
        console.log(a,b,c);
    };

    // @observable
    // sysMartix=[];

    @computed
    get sysMartix(){
        let temp=[];
        let index=0;
        for(let i=0;i<this.currentRoleSys.filter(d=>d).length;i++){
            if(i%4===0){
                temp[index]=[];
                index++;
            }
            temp[index-1].push(this.currentRoleSys[i]);
        }
        return temp;
    }

    @action
    loadCurrentRoleSys=async ()=>{
        let json=await get(`${baseUrl}/sys/currentRoleSys`);
        // if(!json.length) return;
        // let temp=[];
        // let index=0;
        // for(let i=0;i<this.json.length;i++){
        //     if(i%4===0){
        //         temp[index]=[];
        //         index++;
        //     }
        //     temp[index-1].push(json[i]);
        // }
        runInAction(()=>{
            this.currentRoleSys=json;
            //this.sysMartix=temp;
        });
        //this.setMartix();
    };

    @action
    updateWinSize = ({ width, height }) => {
      if (width !== undefined) {
        this.winWidth = width
      }
      if (height !== undefined) {
        this.winHeight = height
      }
    };



}

const getPathById= (id, catalog, callback) =>{
    //定义变量保存当前结果路径
    let temppath = [];
    try {
        function getNodePath(node) {
            temppath.push(node);
            //找到符合条件的节点，通过throw终止掉递归
            if (node.id+'' === id+'') {
                throw (new Error("got it!"));
            }
            if (node.children && node.children.length > 0) {
                for (let i = 0; i < node.children.length; i++) {
                    getNodePath(node.children[i]);
                }
                //当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
                temppath.pop();
            }
            else {
                //找到叶子节点时，删除路径当中的该叶子节点
                temppath.pop();
            }
        }
        getNodePath(catalog);
    }
    catch (e) {
        callback(temppath);
    }
};


