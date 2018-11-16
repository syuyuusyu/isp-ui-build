import {notification} from 'antd';

//平台访问权限申请流程的相关方法

//用户申请访问权限后提交的信息
const applyVariable=(values,formData)=>{
    let username = JSON.parse(sessionStorage.getItem("user")).name;
    let msg=username+'注销:';
    let applySystemCode=[];
    formData.forEach(data=>{
        if(values[data.key] && data.editable){
            msg=msg+data.label+',';
            applySystemCode.push(data.key);
        }
    });
    msg=msg+'权限';
    if(applySystemCode.length===0){
        // notification.info({
        //     message: '至少选择一个当前有权限的平台'
        // });
        //return false;
        return {
            applySystemLength:applySystemCode.length,
            isLast:true
        };
    }
    return {
        message:msg,
        nextForm:[
            {"editable":true,"key":"message","label":"拒绝原因","type":"string","value":''},
            {"editable":true,"key":"approval","label":"是否同意","type":"switch","value":false},
        ],
        applySystemCode:applySystemCode.join(','),
        applySystemLength:applySystemCode.length,
    }
};

//平台访问权限角色审批后提交的信息
const approval=(values)=>{
    if(values.approval===true){
        return {
            approval:true,
            message:'',
            nextForm:[],
            opType:'cancel',
        }
    }else{
        let username = JSON.parse(sessionStorage.getItem("user")).name;
        return {
            approval:false,
            message:username+'拒绝了你的申请,原因:'+values.message,
            nextForm:[]
        }
    }
    return values;
};

export const paltfromCancelProcess=(taskName,values,formData)=>{
    //let username = JSON.parse(sessionStorage.getItem("user")).name;
    if(taskName===`用户申请注销平台权限`){
        return applyVariable(values,formData);
    }
    if(taskName==='审批注销平台权限'){
        return approval(values);
    }
    if(taskName==='注销权限结果'){
        return {
            isLast:true
        }
    }
};



