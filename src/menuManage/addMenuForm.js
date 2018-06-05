import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Form, Input, Row, Col, Button, notification} from 'antd';
import {baseUrl, post} from "../util";

const FormItem = Form.Item;

@inject('rootStore')
@observer
class AddMenuForm extends Component {
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
      if(store.currentMenuId!==-1){
        values.hierachy=store.hierachy+1;
        values.parent_id=store.currentMenuId;
        values.is_leaf=store.isLeaf;
        values.menu_path=store.currrentMenuPath;
      }
      let json=await post(`${baseUrl}/menuManage/saveAdd` ,  JSON.stringify(values));
      if(json.success){
        notification.success({
          message:'保存成功',
        })
      }else{
        notification.error({
          message:'后台错误，请联系管理员',
        })
      }
      store.toggleMenuAddVisible();
      store.loadCurrentMenu();
    });
  }
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
                rules: [
                  {pattern:'^\\+?[1-9][0-9]*$',message:'菜单顺序必须是数值'},
                ],
                validateTrigger: 'onBlur'
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

export default Form.create()(AddMenuForm);

