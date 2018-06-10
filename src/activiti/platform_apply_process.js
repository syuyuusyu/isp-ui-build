import {notification} from 'antd';

//平台访问权限申请流程的相关方法

//用户申请访问权限后提交的信息
const applyVariable=(values,formData)=>{
    let username = JSON.parse(sessionStorage.getItem("user")).user_name;
    let msg=username+'申请:';
    let applySystemCode=[];
    formData.forEach(data=>{
        if(values[data.key] && data.editable){
            msg=msg+data.label+',';
            applySystemCode.push(data.key);
        }
    });
    msg=msg+'访问权限';
    if(applySystemCode.length===0){
        notification.info({
            message: '至少选择一个当前没有权限的平台'
        });
        return null;
    }
    return {
        message:msg,
        nextForm:[
            {"editable":true,"key":"message","label":"拒绝原因","type":"string","value":''},
            {"editable":true,"key":"approval","label":"是否同意","type":"switch","value":false},
            ],
        applySystemCode:applySystemCode.join(',')
    }
};

//平台访问权限角色审批后提交的信息
const approval=(values)=>{
    return values;
};

export const paltfromApplyProcess=(taskName,values,formData)=>{
    if(taskName==='用户申请平台访问权限'){
        return applyVariable(values,formData);
    }
    if(taskName==='平台访问权限角色审批'){
        return approval(values);
    }
};



