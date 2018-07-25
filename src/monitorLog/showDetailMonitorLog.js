import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Form, Row, Col, Input} from 'antd';
import {baseUrl} from "../util";

const FormItem = Form.Item;

@inject('rootStore')
@observer
class ShowDetailMonitorLog extends Component {
  render() {
    const store = this.props.rootStore.monitorLogStore;
    return (
      <Form>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='虚拟机名称'><Input readOnly='readOnly' value={store.logRecord.instance_name}/></FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='硬盘使用量'><Input readOnly='readOnly' value={store.logRecord.disk_usage}/></FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='硬盘总量'><Input readOnly='readOnly' value={store.logRecord.disk_root_size}/></FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='内存使用量'><Input readOnly='readOnly' value={store.logRecord.memory_usage}/></FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='内存总量'><Input readOnly='readOnly' value={store.logRecord.memory}/></FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='CUP使用百分比'><Input readOnly='readOnly' value={store.logRecord.cpu_util}/></FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='虚拟CPU数量'><Input readOnly='readOnly' value={store.logRecord.vcpus}/></FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='数据采集时间'><Input readOnly='readOnly' value={store.logRecord.operate_date}/></FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
export default Form.create()(ShowDetailMonitorLog);
