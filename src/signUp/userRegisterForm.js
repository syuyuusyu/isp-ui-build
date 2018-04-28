import React,{Component} from 'react';
import { Form, Row, Col, Input, Button ,Select,notification} from 'antd';
import {baseUrl, get} from "../util";
import {inject, observer} from "mobx-react/index";

const FormItem = Form.Item;
const Option = Select.Option;

const crypto = require('crypto');

@inject('rootStore')
@observer
class UserRegisterForm extends Component {
  componentDidMount() {
    const store = this.props.rootStore.authorityStore
  }

  checkUserUnique = async (rule, value, callback) => {
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
  }

   checkNickNameUnique = async (rule, value, callback) => {
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
  }

  checkIDnumberUnique = async (rule, value, callback) => {
    if (!value) {
      callback()
    }
    const url = `${baseUrl}/userRegister/uniqueIDnumber/${value}`;
    let json = await get(url);
    if (json.total === 0) {
      callback();
    }else{
      callback(new Error())
    }
  }

    checkIdValid=async (rule, value, callback) => {
     let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
     if(!regIdNo.test(value)){
       callback('身份证号填写有误');
     }else{
       callback(new Error())
     }
    }


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
  }

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
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致');
    } else {
      callback();
    }
  }
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
  }


  render()
  {
    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        <Form>
          <Row>
            <FormItem label="账号">
              {
                getFieldDecorator('userName', {
                  rules: [{required: true, message: '账号不能为空'},
                    {pattern:'^[a-zA-Z0-9_]{1,}$',message:'账号只能输入字母数字下划线'},
                    {validator: this.checkUserUnique, message: '账号已存在'},
                  ],
                  validateTrigger: 'onBlur'
                })(
                  <Input placeholder="请输入账号"/>
                )
              }
            </FormItem>
          </Row>
          <Row>
            <FormItem label="用户名称">
              {
                getFieldDecorator('nickName', {
                  rules: [{required: true, message: '用户名称不能为空'},
                           {validator: this.checkNickNameUnique, message: '用户名称已存在'}
                  ],
                  validateTrigger: 'onBlur'
                })(
                  <Input placeholder="请输入用户名称"/>
                )
              }
            </FormItem>
          </Row>
          <Row>
            <FormItem label="密码">
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '密码不能为空',
                }, {
                  validator: this.validateToNextPassword,
                }],
                validateTrigger: 'onBlur'
              })(
                <Input type="password" placeholder="请输入密码"/>
              )}
            </FormItem>
            <Row>
              <FormItem
                label="确认密码"
              >
                {getFieldDecorator('confirmPassword', {
                  rules: [{
                    required: true, message: '确认密码不能为空',
                  }, {
                    validator: this.compareToFirstPassword,
                  }],
                  validateTrigger: 'onBlur'
                })(
                  <Input type="password" placeholder="请输入确认密码" />
                )}
              </FormItem>
            </Row>
          </Row>
          <Row>
            <FormItem label="身份证编号">
              {
                getFieldDecorator('IDnumber', {
                  rules: [{required: true, message: '身份证编号不能为空'},
                           {pattern:'(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)',message:'身份证编号输入有误'},
                           {validator: this.checkIDnumberUnique,message: '身份证编号已存在'}

                  ],
                  validateTrigger: 'onBlur'
                })(
                  <Input placeholder="请输入身份证编号"/>
                )
              }
            </FormItem>
          </Row>
          <Row>
            <FormItem label="电话号码">
              {
                getFieldDecorator('phone', {
                  rules: [{required: true, message: '电话号码不能为空'},
                    {validator: this.checkPhoneUnique, message: '电话号码已存在'}
                  ],
                  validateTrigger: 'onBlur'
                })(
                  <Input placeholder="请输入电话号码"/>
                )
              }
            </FormItem>
          </Row>
          <Row>
            <FormItem label="邮箱">
              {
                getFieldDecorator('email', {
                  rules: [{type: 'email', message: '请输入有效的邮箱'},
                    {required: false, message: '邮箱不能为空'},
                    {validator: this.checkEmailUnique, message: '邮箱已存在'}
                  ],
                  validateTrigger: 'onBlur'
                })(
                  <Input placeholder="请输入邮箱(选填)"/>
                )
              }
            </FormItem>
          </Row>
          <Row>
            <FormItem>
              <Button type="primary" htmlType="submit" onClick={this.save}>Register</Button>
            </FormItem>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create()(UserRegisterForm);
