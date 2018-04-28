import {baseUrl, get,del} from "../util";
import {action, observable, runInAction} from "mobx";
import {message,notification} from 'antd';


export class ButtonStore{

    constructor(rootSotre){
        this.rootStore=rootSotre;
    }
    @observable
    currentMenuButtons=[];

    @observable
    currentMenuId=-1;

    @observable
    currentMenuName='';

    @observable
    buttonRoleConfVisible=false;

    @observable
    currentButtonId=-1;

    @observable
    buttonFormVisible=false;

    @observable
    selectedButton={};

    @observable
    allRoles=[];

    iconType=["edit",'delete',"question","question-circle-o","question-circle",'play-circle','play-circle-o',"plus","plus-circle-o",
        "plus-circle","pause","minus", "minus-circle-o",'profile',
        "solution","info","info-circle-o","exclamation-circle-o","close","close-circle-o","check","check-circle-o","save"
    ];

    @action
    toggleButtonFormVisible=()=>{
        this.buttonFormVisible=!this.buttonFormVisible;
    };

    @action
    loadAllRoles=async ()=>{
        console.log('loadAllRoles');
        let json=await get(`${baseUrl}/btn/allRoles`);
        runInAction(()=>{
            this.allRoles=json;
        });
    };



    @action
    toggleButtonRoleConfVisible=()=>{
        this.buttonRoleConfVisible=!this.buttonRoleConfVisible;
    };

    @action
    treeSelect=(selectedKeys,e)=>{
        this.currentMenuId=e.node.props.dataRef.id;
        this.currentMenuName=e.node.props.dataRef.text;
        this.loadCurrentMenuButton();

    };

    @action
    loadCurrentMenuButton=async ()=>{
        let json=await get(`${baseUrl}/btn/menuButton/${this.currentMenuId}`);
        runInAction(()=>{
            this.currentMenuButtons=json;
        });
    }

    @action
    showButtonRoleConf=(record)=>(()=>{
        this.currentButtonId=record.id;
        this.toggleButtonRoleConfVisible();
    });

    @action
    showButtonForm=(record)=>(()=>{
        if(this.currentMenuId===-1){
            message.error('请先选中一个菜单！');
            return;
        }
        this.selectedButton=record;
        this.toggleButtonFormVisible();
    });

    deleteButton=(id)=>(async ()=>{
      console.log("dddswwq");
        let json=await del(`${baseUrl}/btn/delete/${id}`);
        if(json.success){
            notification.success({
                message:'删除成功',
            })
        }else{
            notification.error({
                message:'后台错误，请联系管理员',
            })
        }
        this.loadCurrentMenuButton();
    });

}
