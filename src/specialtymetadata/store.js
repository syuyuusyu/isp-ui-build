import {observable, configure,action,runInAction,} from 'mobx';
import {baseUrl,post,getPathById} from '../util';
import {notification} from 'antd';


configure({ enforceActions: 'observed' });

const json=`
{
    

    "FFXX": {
        "FFZ_WZ": "网址",
        "FFZ_TXDZ": "通讯地址",
        "ZXLJ": "在线连接",
        "FFZ_LXRMC": "联系人",
        "FFZ_CZ": "传真",
        "FFZ_ZZ": "职责",
        "FFZ_DZXXDZ": "电子信箱地址",
        "FFZ_FZDWMC": "负责单位名称",
        "FFZ_DH":"电话",
        "FFZ_YZBM":"邮政编码"
    },
    "NRXX": {
        "YSLXMC": "要素类型名称",
        "SGNRMS": "栅格影像内容描述",
        "TCMC": "图层名称",
        "SXLB":"属性列表"
    },
    "YSJ": {
        "YSJ_LXRMC": "联系人",
        "YSJ_DH": "电话",
        "YSJ_YZBM":"邮政编码",
        "YSJ_CZ": "传真",
        "YSJ_WZ": "网址",
        "YSJ_RQ": "日期，日期格式",
        "YSJ_FZDWMC": "云南省地质科学研究所",
        "YSJ_ZZ":  "职责",
        "YSJ_DZXXDZ": "电子信箱地址",
        "YSJ_TXDZ": "通讯地址"
    },
    "KJCZXTXX": {
        "SYCS": "投影坐标系统参数",
        "ZBXTMC": "坐标系统名称",
        "MC": "名称",
        "DDZBCZXTMC": "大地坐标参照系统名称",
        "CXZBCSXTMC": "垂向坐标参照系统名称",
        "ZBXTLX": "坐标系统类型"
    },
    "SJZLXX": {
        "SJZ": "概述",
        "GS": "数据志"
    },
    "XXBS": {
        "BB": "版本",
        "SYXZDM": "使用限制代码",
        "BSFS":"表示方式",
        "WJMC":"文件名称",
        "XZ":"现状",
        "LX_ZZ": "职责",
        "LX_TXDZ":"通讯地址",
        "XBJD":"西边经度",
        "LX_DH":"电话",
        "BBWD":"北边纬度",
        "KJFBL":"空间分辨率",
        "LX_CZ":"传真",
        "YXGDBS":"影像轨道标识",
        "MC":"名称",
        "ZXCXZB":"最小垂向坐标",
        "LX_YZBM":"邮政编码",
        "LX_LXRMC":"联系人",
        "QSSJ":"起始时间",
        "SJJGSBB":"数据集格式版本",
        "LX_FZDWMC":"云南省地质科学研究所",
        "YZ": "语种",
        "NBWD":"南边纬度",
        "DBJD":"东边经度",
        "DLBSF":"地理坐标标识",
        "LX_WZ":"网址",
        "LX_DZXXDZ":"电子信箱地址",
        "ZDCXZB":"最大垂向坐标",
        "SJJGSMC":"数据集格式名称",
        "LB":"类别",
        "JLDW":"计量单位",
        "ZZSJ":"终止时间",
        "RQ":"日期，2018年6月24日",
        "ZY":"摘要",
        "AQDJDM":"安全等级代码"
    },
    "tabName": {
        "FFXX":"分发信息",
        "NRXX":"内容信息",
        "YSJ":"元数据信息",
        "KJCZXTXX":"空间参照系统信息",
        "SJZLXX":"数据质量信息",
        "XXBS":"标识信息"
        
    },
    "tabName": {
        "FFXX":"分发信息",
        "NRXX":"内容信息",
        "YSJ":"元数据信息",
        "KJCZXTXX":"空间参照系统信息",
        "SJZLXX":"数据质量信息",
        "XXBS":"标识信息"
        
    }
}
`;

export class SpecialtyMetdataStore{

    @observable
    treeData=[];

    @observable
    currentMetdata={};




    @observable
    currentTreeName='';

    @observable
    isLoading=false;

    @observable
    loadingTree=false;

    @observable
    currentRoute=[];

    @observable
    loadError=true;

    metadataObj=JSON.parse(json);

    @action
    loadTree=async ()=>{
        this.loadingTree=true;
        let json=await post(`${baseUrl}/invoke/specialty_metdata_dir_api`,{});
        if(json){
            runInAction(()=>{
                this.treeData=json;
                this.loadingTree=false;
                this.loadError=false;
            });
        }


    };

    @action
    treeSelect=async (selectedKeys,e)=>{
        this.treeData.filter(d=>d).forEach(data=>{
            getPathById(e.node.props.dataRef.ID,Object.create(data),(result)=>{
                runInAction(()=>{
                    this.currentRoute=result;
                });
            },'ID')
        });
        this.currentTreeName=e.node.props.dataRef.NAME;
        if(e.node.props.dataRef['LX']==='1'){
            this.isLoading=true;
            try{
                let json=await post(`${baseUrl}/invoke/specialty_metdata_api`,{id:e.node.props.dataRef.ID});
                runInAction(()=>{
                    this.currentMetdata=json;
                    this.isLoading=false;
                })
            }catch (e){
                runInAction(()=>{
                    this.currentMetdata={};
                    this.isLoading=false;
                });
                notification.error({
                    message:'调用专业数据库管理系统接口错误!'});
            }

        }else{
            this.currentMetdata=[];
            notification.info({
                message:'当前节点下没有对应的元数据'});
        }


    };

}