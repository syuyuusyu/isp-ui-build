import React, { Component } from 'react';
import {Form,Row,Col,Input } from 'antd';
import {inject, observer} from "mobx-react/index";

const FormItem = Form.Item;

@inject('rootStore')
@observer
class ShowDetailLog extends Component{
  componentDidMount(){
    const store=this.props.rootStore.backlogLogStore;
  }
  render(){
    return(
      <Form>
       <Row gutter={24}>
        <Col span={4}>
          <FormItem  label='登录用户'><Input  readOnly='readOnly'  value={this.props.rootStore.backlogLogStore.logRecord.operate_user}/></FormItem>
        </Col>
        <Col span={4} offset={1}>
          <FormItem  label='登录的ip'><Input  readOnly='readOnly'  value={this.props.rootStore.backlogLogStore.logRecord.operate_ip}/></FormItem>
        </Col>
         <Col span={4} offset={1}>
           <FormItem  label='待办状态'><Input  readOnly='readOnly'  value={this.props.rootStore.backlogLogStore.logRecord.backlog_status}/></FormItem>
         </Col>
         <Col span={6} offset={1}>
           <FormItem  label='操作时间'><Input  readOnly='readOnly'  value={this.props.rootStore.backlogLogStore.logRecord.create_time}/></FormItem>
         </Col>
       </Row>
        <Row gutter={24}>
          <Col span={6}>
            <FormItem  label='待办信息'><textarea readOnly='readOnly' style={{width:'700px',height:'80px'}}>{this.props.rootStore.backlogLogStore.logRecord.backlog_info}</textarea></FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default Form.create()(ShowDetailLog);
