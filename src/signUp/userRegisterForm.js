import React,{Component} from 'react';
import { Form, Row, Col, Input, Button ,Select, Modal,notification,Cascader} from 'antd';
import {baseUrl, get,post} from "../util";
import {inject, observer} from "mobx-react";
import {Link} from 'react-router-dom';
import SelectOrg from './selectOrg';


const FormItem = Form.Item;
const Option = Select.Option;

const crypto = require('crypto');

@inject('rootStore')
@observer
class UserRegisterForm extends Component {
  componentDidMount(){
    this.props.rootStore.signUpStore.initNewNodeNames();
  }

 /* checkUserUnique = async (rule, value, callback) => {
    if (!value) {
      callback()
    }
    const url = `${baseUrl}/userRegister/uniqueUser/${value}`;
    let json = await get(url);
    if (json.total === 0) {
      callback()
    } else {
      callback(new Error())
    }
  }*/

   /*checkNickNameUnique = async (rule, value, callback) => {
    if (!value) {
      callback()
    }
    const url = `${baseUrl}/userRegister/uniqueNickName/${value}`;
    let json = await get(url);
    if (json.total === 0) {
      callback()
    } else {
      callback(new Error())
    }
  }*/
  checkIDnumberUnique = async (rule, value, callback) => {
    if (!value) {
      callback()
    }
    const url = `${baseUrl}/userRegister/uniqueIDnumber/${value}`;
    let json = await get(url);
    if (json.total !== 0) {
      callback("身份证编号已存在");
    }
    const format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
    //号码规则校验
    if(!format.test(value)){
      callback("身份证号码不合规");
    }
    //区位码校验
    // 出生年月日校验，限制起始年份为1900;
    const year = value.substr(6,4);//身份证年
    const month = value.substr(10,2);//身份证月
    const date = value.substr(12,2);//身份证日
    const time = Date.parse(month+'-'+date+'-'+year);//身份证日期时间戳date
    const now_time = Date.parse(new Date());//当前时间戳
    const dates = (new Date(year,month,0)).getDate();//身份证当月天数
    if(time>now_time||date>dates){
      callback("出生日期不合规");
    }
    //校验码判断
    const coefficient = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];  //系数
    const checkCode = ['1','0','X','9','8','7','6','5','4','3','2']; //校验码对照表
    let  id_array = value.split("");
    let sum = 0;
    for(let k=0;k<17;k++){
      sum+=parseInt(id_array[k])*parseInt(coefficient[k]);
    }
    if(id_array[17].toUpperCase() != checkCode[sum%11].toUpperCase()){
      callback("身份证校验码不合规");
    }else(callback());
  };

  checkPhoneUnique = async (rule, value, callback) => {
    if (!value) {
      callback();
    }
    const url = `${baseUrl}/userRegister/uniquePhone/${value}`;
    let json = await get(url);
    if (json.total === 0) {
      callback();
    } else {
      callback(new Error())
    }
  };

  checkEmailUnique = async (rule, value, callback) => {
    if (!value) {
      callback();
    }
    const url = `${baseUrl}/userRegister/uniqueEmail/${value}`;
    let json = await get(url);
    if (json.total === 0) {
      callback()
    } else {
      callback(new Error())
    }
  };


  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && false) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致');
    } else {
      callback();
    }
  };
  save=()=> {
    const store=this.props.rootStore.signUpStore;
    this.props.form.validateFields(async (err, values) => {
      if(err) return;

      if(store.orgCheckedKeys.length===0){
        notification.error({
          message:'请选择所属机构'
        })
        return
      }

      //对输入的密码和确认密码进行加密
      const randomNumber=Math.random().toString().substr(2,10);
      const hmac = crypto.createHmac('sha256', randomNumber);
      values.password= hmac.update(values.password).digest('hex');
      values.confirmPassword= hmac.update(values.confirmPassword).digest('hex');
      values.randomNumber=randomNumber;
      values.orgCheckedKeys=store.orgCheckedKeys;

      let json=await post(`${baseUrl}/userRegister/save`,values);
     if(json.success==='账号已经存在'){
       notification.error({
         message:'账号已经存在！'
       });
       this.reset();
     }else if(json.success){
        Modal.success({
          title: '注册成功！',
          onOk: () => {
            this.props.history.push('/login');
          },
        });
     } else{
       notification.error({
         message:'后台错误，请联系管理员。点击返回按钮返回登录页面'
       })
     }
    })
  };

  reset=()=>{
    this.props.form.resetFields();
  };


  render()
  {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 14},
    };
    const store=this.props.rootStore.signUpStore;
    return (
      <div className="sign">
        <Modal visible={store.orgVisible}
               width={600}
               title="选择机构(请展开选择注册的用户所属机构)"
               footer={null}
               onCancel={store.toggleOrgVisible}
               maskClosable={false}
               destroyOnClose={true}
        >
          <SelectOrg/>
        </Modal>
        <Form layout="horizontal" className="sign-content">
            <h2 className="sign-title">注册</h2>
          <Row gutter={26}>
            <Col span={10}>
              <div className="col1">
            <FormItem label="登录名称" {...formItemLayout} >
              {
                getFieldDecorator('userName', {
                  rules: [{required: true, message: '登录名称不能为空'},
                    {pattern:'^[a-zA-Z0-9_]{1,}$',message:'登录名称只能包含字母数字下划线'},
                  ],
                  validateTrigger: 'onBlur'
                })(
                  <Input className="signUpInput" placeholder="请输入账号"/>
                )
              }
            </FormItem>
              </div>
            </Col>
            <Col span={10}>
              <div className="col2">
            <FormItem label="用户名称" {...formItemLayout}>
              {
                getFieldDecorator('nickName', {
                  rules: [{required: true, message: '用户名称不能为空'},
                  ],
                  validateTrigger: 'onBlur'
                })(
                  <Input className="signUpInput" placeholder="请输入用户名称"/>
                )
              }
            </FormItem>
              </div>
            </Col>
          </Row>
          <Row gutter={26}>
            <Col span={10}>
              <div className="col1">
            <FormItem label="密码" {...formItemLayout}>
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '密码不能为空',
                }, {
                  validator: this.validateToNextPassword,
                }],
                validateTrigger: 'onBlur'
              })(
                <Input className="signUpInput" type="password" placeholder="请输入密码"/>
              )}
            </FormItem>
              </div>
            </Col>
            <Col span={10}>
              <div className="col2">
              <FormItem label="确认密码" {...formItemLayout}>
                {getFieldDecorator('confirmPassword', {
                  rules: [{
                    required: true, message: '确认密码不能为空',
                  }, {
                    validator: this.compareToFirstPassword,
                  }],
                  validateTrigger: 'onBlur'
                })(
                  <Input className="signUpInput" type="password" placeholder="请输入确认密码" />
                )}
              </FormItem>
              </div>
            </Col>
          </Row>
          <Row gutter={26}>
            <Col span={10}>
              <div className="col1">
            <FormItem label="身份证编号" {...formItemLayout}>
              {
                getFieldDecorator('IDnumber', {
                  rules: [
                           {validator: this.checkIDnumberUnique}

                  ],
                  validateTrigger: 'onBlur'
                })(
                  <Input className="signUpInput" placeholder="请输入身份证编号(选填)"/>
                )
              }
            </FormItem>
              </div>
            </Col>
            <Col span={10}>
              <div className="col2">
            <FormItem label="电话号码" {...formItemLayout}>
              {
                getFieldDecorator('phone', {
                  rules: [{required: true, message: '电话号码不能为空'},
                    {validator: this.checkPhoneUnique, message: '电话号码已存在'},
                    {pattern:'^1[0-9]{10}$',message:'电话号码需以1开头并且含11位数字'},
                  ],
                  validateTrigger: 'onBlur'
                })(
                  <Input className="signUpInput" placeholder="请输入电话号码"/>
                )
              }
            </FormItem>
              </div>
            </Col>
          </Row>
          <Row gutter={26}>
            <Col span={10}>
              <div className="col1">
            <FormItem label="邮箱" {...formItemLayout}>
              {
                getFieldDecorator('email', {
                  rules: [{type: 'email', message: '请输入有效的邮箱'},
                    {required: false, message: '邮箱不能为空'},
                    {validator: this.checkEmailUnique, message: '邮箱已存在'}
                  ],
                  validateTrigger: 'onBlur'
                })(
                  <Input className="signUpInput" placeholder="请输入邮箱(选填)"/>
                )
              }
            </FormItem>
              </div>
            </Col>
          </Row>
          <div  className="sign-button02">
            <Button onClick={this.props.rootStore.signUpStore.toggleOrgVisible}>选择所属机构</Button>：
            <div className="orgName">{this.props.rootStore.signUpStore.newNodeNames.filter(d=>d).map(a=>{
              return(
                <p key={a}>{a}</p>
              );
            })}
            </div>
          </div>
            <div className="sign-button">
                <Button type="primary" htmlType="submit" onClick={this.save}>注册</Button>
                <Button className="sign-button01" onClick={this.reset}>重置</Button>
                <Link to="/login">返回</Link>
            </div>
        </Form>
      </div>
    );
  }
}

export default Form.create()(UserRegisterForm);
