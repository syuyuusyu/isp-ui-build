import React, { Component } from 'react';
import {inject,observer} from 'mobx-react';
import {Form,Row,Col } from 'antd';
import {baseUrl} from "../util";
import {Input} from "antd/lib/index";
const FormItem = Form.Item;
const {TextArea}=Input;

@inject('rootStore')
@observer
class ShowDetailLog extends Component{
  componentDidMount(){
    const store=this.props.rootStore.interfacesLog;
  }


render(){

  return(
    <Form>
      <Row gutter={24}>
      <Col span={3}>
        <FormItem  label='系统编号'><Input  readOnly='readOnly'  value={this.props.rootStore.interfacesLog.logRecord.system}/></FormItem>
      </Col>
      <Col span={6}>
        <FormItem  label='系统名称'><Input  readOnly='readOnly'  value={this.props.rootStore.interfacesLog.logRecord.system_cn}/></FormItem>
      </Col>
      <Col span={6}>
        <FormItem  label='调用接口的ip'><Input  readOnly='readOnly'  value={this.props.rootStore.interfacesLog.logRecord.ip}/></FormItem>
      </Col>
        <Col span={6}>
          <FormItem  label='接口名'><Input  readOnly='readOnly'  value={this.props.rootStore.interfacesLog.logRecord.interfaces_name}/></FormItem>
        </Col>
    </Row>
    <Row gutter={24}>
      <Col span={6}>
        <FormItem  label='请求报文'><textarea readOnly='readOnly' style={{width:'747px',height:'80px'}}>{this.props.rootStore.interfacesLog.logRecord.reqdate_info}</textarea></FormItem>
      </Col>
    </Row>
    <Row gutter={24}>
      <Col span={6}>
        <FormItem  label='响应状态'><Input  readOnly='readOnly'  value={this.props.rootStore.interfacesLog.logRecord.response_status}/></FormItem>
      </Col>
      <Col span={6}>
        <FormItem  label='响应状态信息'><Input  readOnly='readOnly'  value={this.props.rootStore.interfacesLog.logRecord.message}/></FormItem>
      </Col>
      <Col span={6}>
        <FormItem  label='调用时间'><Input  readOnly='readOnly'  value={this.props.rootStore.interfacesLog.logRecord.invoke_date}/></FormItem>
      </Col>
    </Row>


{/*      <FormItem  label='系统编号'><Input  readOnly='readOnly'  style={{width:'50px'}}   value={this.props.rootStore.interfacesLog.logRecord.system}/></FormItem>
      <FormItem  label='系统名称'><Input  readOnly='readOnly'  style={{width:'150px'}}   value={this.props.rootStore.interfacesLog.logRecord.system_cn}/></FormItem>
      <FormItem  label='调用接口的ip'><Input  readOnly='readOnly'  style={{width:'150px'}}   value={this.props.rootStore.interfacesLog.logRecord.ip}/></FormItem>
      <FormItem  label='接口名'><Input  readOnly='readOnly'  style={{width:'100px'}}   value={this.props.rootStore.interfacesLog.logRecord.interfaces_name}/></FormItem>
      <FormItem label='请求报文'><textarea readOnly='readOnly' style={{width:'500px',height:'80px'}}>{this.props.rootStore.interfacesLog.logRecord.reqdate_info}</textarea></FormItem>
      <FormItem  label='接口名'><Input  readOnly='readOnly'  style={{width:'100px'}}   value={this.props.rootStore.interfacesLog.logRecord.interfaces_name}/></FormItem>*/}

    </Form>
  );
}}
export default Form.create()(ShowDetailLog);
