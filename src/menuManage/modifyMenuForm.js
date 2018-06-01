import React, { Component } from 'react';
import {inject,observer} from 'mobx-react';
import { Form, Input,Row,Col,Button,notification} from 'antd';
import {baseUrl,post} from "../util";
const FormItem = Form.Item;

@inject('rootStore')
@observer
class ModifyMenuForm extends Component{
  componentDidMount(){
    const store=this.props.rootStore.menuManageStore;
    if(store.selectedMenu){
      this.props.form.setFieldsValue({
        text:store.selectedMenu.text,
        name:store.selectedMenu.name,
        path:store.selectedMenu.path,
        page_path:store.selectedMenu.page_path,
        page_class:store.selectedMenu.page_class,
        menu_order:parseInt(store.selectedMenu.menu_order)
      })
    }
  }

  checkMenuOrder=(rule, value, callback)=>{
    const result=isNaN(value);//为false说明为数字，为true说明不为数字
    if(result){
      callback("菜单顺序必须是数值");
    }else(callback());
  }

  save=()=>{
    const store=this.props.rootStore.menuManageStore;
    this.props.form.validateFields(async (err,values)=>{
      if(err) return;
      if(store.selectedMenu){
        values.id=store.selectedMenu.id;
      }
      let json=await post(`${baseUrl}/menuManage/saveModify` ,  JSON.stringify(values));
      if(json.success){
        notification.success({
          message:'保存成功',
        })
      }else{
        notification.error({
          message:'后台错误，请联系管理员',
        })
      }
      store.toggleMenuModifyVisible();
      store.loadCurrentMenu();
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };
  render() {
    const {getFieldDecorator,} = this.props.form;
    return (
      <Form>
        <Row gutter={26}>
          <Col span={10}>
            <FormItem label="菜单名称">
              {getFieldDecorator('text', {
                rules: [{required: true, message: '此项为必填项!!'}],
              })(
                <Input placeholder="请输入菜单名称"/>
              )}
            </FormItem>
          </Col>
          <Col span={10} offset={3}>
            <FormItem label="菜单编码">
              {getFieldDecorator('name', {
                rules: [{required: true, message: '此项为必填项!!'}],
              })(
                <Input placeholder="请输入菜单编码"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={26}>
          <Col span={10}>
            <FormItem label="跳转路径">
              {getFieldDecorator('path', {
                rules: [{required: false, message: '此项为必填项!!'}],
              })(
                <Input placeholder="请输入跳转路径"/>
              )}
            </FormItem>
          </Col>
          <Col span={10} offset={3}>
            <FormItem label="菜单目录路径">
              {getFieldDecorator('page_path', {
                rules: [{required: false, message: '此项为必填项!!'}],
              })(
                <Input placeholder="请输入菜单目录路径"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={26}>
          <Col span={10}>
            <FormItem label="菜单类路径">
              {getFieldDecorator('page_class', {
                rules: [{required: false, message: '此项为必填项!!'}],
              })(
                <Input placeholder="请输入菜单类路径"/>
              )}
            </FormItem>
          </Col>
          <Col span={10} offset={3}>
            <FormItem label="菜单顺序">
              {getFieldDecorator('menu_order', {
                rules: [{required: false, message: '此项为必填项!!'},
                         {validator: this.checkMenuOrder}
                ],
              })(
                <Input placeholder="请输入菜单顺序"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button icon="save" onClick={this.save}>保存</Button>
            <Button icon="reload" onClick={this.handleReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default Form.create()(ModifyMenuForm);
