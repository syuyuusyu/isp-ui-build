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
    })
    this.validSave=true;
  }
}
