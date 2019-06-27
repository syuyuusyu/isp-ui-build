import {observable, configure, action, runInAction} from 'mobx';
import {notification} from 'antd';
import {baseUrl, get, post,del} from '../util';

configure({ enforceActions: 'observed' });

export default class NotificationSotre {

    constructor(rootStore){
        this.rootStore=rootStore;
    }


    @observable
    applyPlatformVisible = false;

    @observable
    messageTableVisible=false;

    @observable
    systemAccess = [];

    @observable
    selectedRowKeys = [];

    @observable
    messages = [];


    @action
    setSelectedRowKeys = (selectedRowKeys) => {
        this.selectedRowKeys = selectedRowKeys;
    };

    @action
    onRowChange = (selectedRowKeys) => {
        this.selectedRowKeys = selectedRowKeys;
    };

    getCheckboxProps = record => ({
        disabled: record.count > 0, // Column configuration not to be checked
        name: record.name,
    });

    @action
    loadSystemAccess = async () => {
        let json = await get(`${baseUrl}/sys/sysAccess/${JSON.parse(sessionStorage.getItem("user")).id}`);
        runInAction(() => {
            this.systemAccess = json;
        });
    };

    apply = async () => {
        let json = await post(`${baseUrl}/msg/sendApplyPlateformMsg`, {
            applySystemIds: this.selectedRowKeys.filter(d => d)
        });
        if(json.success){
            notification.success({
                message:'申请成功,请等待审批'})
        }else{
            notification.error({
                message:'系统错误,请联系管理员'});
        }
        this.toggleApplyPlatformVisible();
    };



    @action
    toggleApplyPlatformVisible = () => {
        this.applyPlatformVisible = !this.applyPlatformVisible;
    };

    @action
    toggleMessageTableVisible=()=>{
        this.messageTableVisible=!this.messageTableVisible;
    };


    @action
    loadMessage=async ()=>{
        const json=await get(`${baseUrl}/msg/receive`);
        runInAction(()=>{
            this.messages=json;
        })
    };

    approvalPlatform=async (record)=>{
        const json=await post(`${baseUrl}/msg/approvalPlatform`,record);

        if(json.success){
            notification.success({
                message:'已向对应平台发出请求,等待对方回应'});
        }else{
            notification.error({
                message:'系统错误,请联系管理员'});
        }
        this.toggleMessageTableVisible();

    };

    approval=(record)=>(()=>{
        switch (record.message_type){
            case '1':
                this.approvalPlatform(record);
                break;
            default:
                return;
        }
    });

    disApproval=(record)=>(async ()=>{
        const json=await post(`${baseUrl}/msg/disApproval`,record);
        if(json.success){
            notification.success({
                message:'操作成功'});
            this.loadMessage();
        }else{
            notification.error({
                message:'系统错误,请联系管理员'});
        }
    });

    deleteMsg=(record)=>(async ()=>{
        const json=await del(`${baseUrl}/msg/deleteMsg/${record.id}`);
        if(json.success){
            notification.success({
                message:'删除成功'});
            this.loadMessage();
        }else{
            notification.error({
                message:'系统错误,请联系管理员'});
        }
    });
}
