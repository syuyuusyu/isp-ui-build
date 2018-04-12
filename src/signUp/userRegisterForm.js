import React,{Component} from 'react';
import { Form, Row, Col, Input, Button ,Modal,Progress} from 'antd';
import {baseUrl, get} from "../util";
import {inject, observer} from "mobx-react/index";

const FormItem = Form.Item;

@inject('rootStore')
@observer
class UserRegisterForm extends Component{
  componentDidMount(){
    const store=this.props.rootStore.authorityStore
  }

  checkUserUnique=async(rule, value, callback)=>{
    if(this.props.data){
      console.log("UserRegisterForm中this.props.data的值为:",this.props.data);
      if(this.props.data.name===value){
        callback();
      }
    }
    const url=`${baseUrl}/userRegister/uniqueUser/${value}`;
    let json=await get(url);
    if(json.total===0){
      callback()
    }else{
      callback(new Error())
    }
  }

  checkPhoneUnique=async(rule, value, callback)=>{
    if(this.props.data){
      if(this.props.data.name===value){
        callback();
      }
    }
    const url=`${baseUrl}/userRegister/uniqueUser/${value}`;
    let json=await get(url);
    if(json.total===0){
      callback()
    }else{
      callback(new Error())
    }
  }

  checkEmailUnique=async(rule, value, callback)=>{
    if(this.props.data){
      if(this.props.data.name===value){
        callback();
      }
    }
    const url=`${baseUrl}/userRegister/uniqueEmail/${value}`;
    let json=await get(url);
    if(json.total===0){
      callback()
    }else{
      callback(new Error())
    }
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return(
      <Form>
        <Row>
          <FormItem label="用户名">
            {
              getFieldDecorator('userName',{
                rules:[{ required:true,  validator:this.checkUserUnique,  message: '用户名已存在'}],
                validateTrigger:'onBlur'
              })(
                <Input placeholder="请输入用户名" />
              )
            }
          </FormItem>
        </Row>
        <Row>
          <FormItem label="电话号码">
            {
              getFieldDecorator('phone',{
                rules:[{ required:true,  validator:this.checkPhoneUnique,  message: '电话号码已存在'}],
                validateTrigger:'onBlur'
              })(
                <Input placeholder="请输入用户名" />
              )
            }
          </FormItem>
        </Row>
        <Row>
          <FormItem label="邮箱">
            {
              getFieldDecorator('email',{
                rules:[{ required:true,  validator:this.checkEmailUnique,  message: '邮箱已存在'}],
                validateTrigger:'onBlur'
              })(
                <Input placeholder="请输入邮箱" />
              )
            }
          </FormItem>
        </Row>
      </Form>
    );
  }
}
export default Form.create()(UserRegisterForm);
