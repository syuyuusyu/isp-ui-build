import {configure,observable,action,runInAction,} from 'mobx';
import {notification} from 'antd';
import {baseUrl,get,post} from '../util';

configure({ enforceActions: true });
export class SignUpStore{
  constructor(rootStore){
    this.rootStore=rootStore;
  }

  @observable
  validSave=false;

  @observable
  orgVisible=false;

  @observable
  orgCheckedKeys=[];

  @observable
  treeData=[];



  @action
  save=()=> {
    this.props.form.validateFields(async (err, values) => {
      if(err) return;
      //console.log("values的值为:",values);
      const randomNumber=Math.random().toString().substr(2,10);
      const hmac = crypto.createHmac('sha256', randomNumber);
      values.password= hmac.update(values.password).digest('hex');
      values.confirmPassword= hmac.update(values.confirmPassword).digest('hex');
      values.randomNumber=randomNumber;

      let json=await post(`${baseUrl}/userRegister/svae` ,JSON.stringify(values));
      if(json.success){
        notification.success({
          message:'保存成功'})
      } else{
        notification.error({
          message:'后台错误，请联系管理员'
        })
      }
    });
    this.validSave=true;
  };

  @action
  toggleOrgVisible=()=>{
    this.orgVisible=!this.orgVisible;
  };

  @action
  initRoot=async ()=>{
    let json=await get(`${baseUrl}/userRegister/getOrg`);
    //将取回来机构数据转为树转结构的数据
    let newData=this.toTreeData(json, 'id', 'parent_id', 'children');
    runInAction(()=>{
      this.treeData=newData;
    });
  };

  @action
  initOrgCheckedKeys=()=>{
    this.orgCheckedKeys=[];
  };


  @action
  onCheck=(checkedKeys)=>{
    //this.orgCheckedKeys=checkedKeys.checked;
    this.orgCheckedKeys=checkedKeys;
  };

  @action
  saveSelect=()=>{
    this.toggleOrgVisible();
  };

  @action
  toTreeData=(a, idStr, pidStr, childrenStr)=>{
    let r = [], hash = {}, id = idStr.toString(), pid = pidStr.toString(), children = childrenStr, i = 0, j = 0, len = a.length;
    for(; i < len; i++){
      hash[a[i][id]] = a[i];
    }
    for(; j < len; j++){
      var aVal = a[j], hashVP = hash[aVal[pid]];
      if(hashVP){
        !hashVP[children] && (hashVP[children] = []);
        hashVP[children].push(aVal);
      }else{
        r.push(aVal);
      }
    }
    return r;
  }

}



