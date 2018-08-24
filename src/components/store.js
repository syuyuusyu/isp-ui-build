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

    loadAllDictionary=()=>{
        get(`${baseUrl}/dictionary/dictionary`).then(json=>{this.allDictionary=json})
    };

    loadAllColumns=()=>{
        get(`${baseUrl}/entity/columns`).then(json=>{this.allColumns=json});
    };

    loadAllEntitys=()=>{
        get(`${baseUrl}/entity/entitys`).then(json=>{this.allEntitys=json});
    };

    @observable
    tableRows=[];

    @observable
    loading=false;

    queryObj={};

    @observable
    pagination={
        current:1,
        total:100,
        size:'small',
        pageSize:10,
        showTotal:(total, range) => `${range[0]}-${range[1]} of ${total} items`,
        onChange:this.pageChange
    };

    pageChange=(page, limit)=>{
        let start=(page-1)*pageSize;
        this.queryObj={...queryObj,page,start,limit};
        this.queryTable()
    };

    @action
    queryTable=async ()=>{
        runInAction(()=>{
            this.loading=true;
        });
        let json=await post(`${baseUrl}/entity/query/${this.currentEntity.entityId}`,this.queryObj);
        runInAction(()=>{
            this.tableRows=json.data;
            this.pagination={
                ...this.pagination,
                current:this.queryObj?this.queryObj.page:1,
                total:json.total,
            };
            this.loading=false;
        });
    }


}