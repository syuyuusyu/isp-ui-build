import {observable, configure, action, runInAction,} from 'mobx';
import {notification} from 'antd';
import {activitiUrl, get, post, del, baseUrl} from '../util';



configure({enforceActions: true});



export class CommonStore {

    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    allDictionary=[];

    allColumns=[];

    allEntitys=[];

    currentEntity={};

    currentParentEntity={};

    entityId=0;

    @observable
    hasParent=false;

    isParentSame=false;

    setEntityId=(entityId)=>{
        this.entityId=entityId;
    };

    @action
    setCurrentEntity=()=>{
        this.currentEntity = this.allEntitys.filter(d => d.id === this.entityId)[0];
        console.log(this.currentEntity);
        if(this.currentEntity.parentEntityId){
            this.hasParent=true;
            this.currentParentEntity=this.allEntitys.filter(d => d.id === this.currentEntity.parentEntityId)[0];
            if(this.currentEntity.parentEntityId==this.currentEntity.id){
                this.isParentSame=true;
            }
        }
    };

    loadAllDictionary=async ()=>{
        let json=await get(`${baseUrl}/dictionary/dictionary/0`);
        this.allDictionary=json;
    };

    loadAllColumns=async ()=>{
        let json=await get(`${baseUrl}/entity/columns/0`);
        this.allColumns=json;
    };

    loadAllEntitys=async ()=>{
        let json=await get(`${baseUrl}/entity/entitys`);
        this.allEntitys=json;
        this.setCurrentEntity();
    };

    //table
    //--------------------

    @observable
    tableRows=[];

    @observable
    loading=false;

    @observable
    columns=[];

    queryObj={};

    @observable
    pagination={
        current:1,
        total:0,
        size:'small',
        pageSize:10,
        showTotal:(total, range) => `${range[0]}-${range[1]} of ${total} items`,
        onChange:this.pageChange
    };

    @action
    loadColumns=async ()=>{
        let json=await get(`${baseUrl}/entity/columns/${this.entityId}`);
        runInAction(()=>{
            this.columns=json.filter(c=>c.hidden!='1').map(c=>{
                let column={
                    dataIndex:c.columnName,
                    title:c.text?c.text:c.columnName,
                    width:c.width?c.width:100
                };
                //TODO
                return column;
            })
        });
    };

    pageChange=(page, pageSize)=>{
        let start=(page-1)*pageSize;
        this.queryObj={...this.queryObj,page,start,pageSize};
        this.queryTable()
    };

    @action
    queryTable=async ()=>{
        runInAction(()=>{
            this.loading=true;
        });
        let json=await post(`${baseUrl}/entity/query/${this.entityId}`,this.queryObj);
        runInAction(()=>{
            this.tableRows=json.data;
            this.pagination={
                ...this.pagination,
                current:this.queryObj?this.queryObj.page:1,
                total:json.total,
            };
            this.loading=false;
        });
    };

    //tree
    //---------------------
    @observable
    treeData=[];

    @action
    initTree=async ()=>{
        let {topParentId}=await get(`${baseUrl}/entity/topParentId/${this.currentParentEntity.parentEntityId}`);
        let json=await post(`${baseUrl}/entity/query/${this.currentParentEntity.parentEntityId}`,{[this.currentParentEntity.pidField]:topParentId});
        runInAction(()=>{
            this.treeData=json.data;
        });
    };


    @action
    onLoadTreeData=async(treeNode)=>{
        const parentId=treeNode.props.dataRef[this.currentParentEntity.idField];
        let json=await post(`${baseUrl}/entity/query/${this.currentParentEntity.parentEntityId}`,{[this.currentParentEntity.pidField]:parentId});
        runInAction(()=>{
            treeNode.props.dataRef.children=json.data;
            this.treeData=[...this.treeData];
        })
    };

    treeSelect=(selectedKeys,e)=>{
        let id=e.node.props.dataRef[this.currentEntity.idField];
        this.queryObj={start:0,pageSize:this.pagination.pageSize,page:1,[this.currentEntity.pidField]:id};
        this.queryTable();

    };


}