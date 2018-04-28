import {observable,action,runInAction,} from 'mobx';
import {notification} from 'antd';
import {baseUrl,get,post} from '../util';
import {useStrict} from "mobx/lib/mobx";

useStrict(true);
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

      let response=await fetch(`${baseUrl}/userRegister/svae` , {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Access-Token': sessionStorage.getItem('access-token') || ''
          }),
          body: JSON.stringify(values),
        }
      );
      let json=await response.json()
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
