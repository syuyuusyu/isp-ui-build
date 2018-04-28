import {observable, configure,action,runInAction,} from 'mobx';
import {baseUrl,post} from '../util';
import {EventEmitter} from 'events';
import SysMsg from "./SysMsg";

console.log(EventEmitter);



configure({ enforceActions: true });

export default class DashBoardStore{

    constructor(rootStore){
        this.rootStore=rootStore;
        Object.assign(this,EventEmitter.prototype);
    }

    @observable
    onLoading=false;

    @observable
    loadingText='';


    @action
    loadDashboardData=async()=> {
        runInAction(() => {
            this.onLoading = true;
            this.loadingText = '正在向云平台获取监控信息...';
        });
        let json = await post(`${baseUrl}/invoke/cloud_monitor`);
        console.log(json);
        runInAction(() => {
            this.onLoading = false;
        });
        if (json.getTopology) this.emit('topo', json.getTopology);
        if (json.UserSourceMsg) this.emit('UserSourceMsg', json.UserSourceMsg);
        if (json.getSysMsg) this.emit('SysMsg', json.getSysMsg);
        if (json.getCpuInfo) this.emit('CpuInfo',json.getCpuInfo);
        if (json.CloudSource) this.emit('CloudSource',json.CloudSource);
    };

}