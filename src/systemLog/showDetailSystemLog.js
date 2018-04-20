import React, { Component } from 'react';
import {Form,Row,Col } from 'antd';
import {Input} from "antd/lib/index";
import {inject, observer} from "mobx-react/index";

const FormItem = Form.Item;

@inject('rootStore')
@observer
class ShowDetailSystemLog extends Component{
  componentDidMount(){
    const store=this.props.rootStore.systemLogStore;
  }
  render(){
    return(
      <Form>
        <Row gutter={24}>
          <Col span={4}>
            <FormItem  label='登录用户'><Input  readOnly='readOnly'  value={this.props.rootStore.systemLogStore.logRecord.login_name}/></FormItem>
          </Col>
          <Col span={4}>
            <FormItem  label='操作类型'><Input  readOnly='readOnly'  value={this.props.rootStore.systemLogStore.logRecord.operate_type}/></FormItem>
          </Col>
          <Col span={5}>
            <FormItem  label='操作ip'><Input  readOnly='readOnly'  value={this.props.rootStore.systemLogStore.logRecord.operate_ip}/></FormItem>
          </Col>
          <Col span={5}>
            <FormItem  label='操作详情'><Input  readOnly='readOnly'  value={this.props.rootStore.systemLogStore.logRecord.operate_detail}/></FormItem>
          </Col>
          <Col span={5}>
            <FormItem  label='操作时间'><Input  readOnly='readOnly'  value={this.props.rootStore.systemLogStore.logRecord.operate_date}/></FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default Form.create()(ShowDetailSystemLog);
