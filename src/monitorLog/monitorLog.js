import React, { Component } from 'react';
import {Table,Col,Button,Row,Select,Modal,DatePicker} from 'antd';
import {inject,observer} from 'mobx-react';
import ShowDetailMonitorLog from './showDetailMonitorLog';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

const Option = Select.Option;

@inject('rootStore')
@observer
class MonitorLog extends Component{
  columns=[
    {dataIndex:'instance_name',title:'虚拟机名称',width:25},
    {dataIndex:'disk_usage',title:'硬盘使用量',width:25},
    {dataIndex:'disk_root_size',title:'硬盘总量',width:25},
    {dataIndex:'memory_usage',title:'内存使用量',width:25},
    {dataIndex:'memory',title:'内存总量',width:25},
    {dataIndex:'cpu_util',title:'CUP使用百分比',width:25},
    {dataIndex:'vcpus',title:'虚拟CPU数量',width:25},
    {dataIndex:'operate_date',title:'数据采集时间',width:25,
     render:(operateDate)=>{
    const logDate=new Date(operateDate);
    const Y=logDate.getFullYear()+'-';
    const M=(logDate.getMonth()+1 < 10 ? '0'+(logDate.getMonth()+1) : logDate.getMonth()+1) + '-';
    const D=(logDate.getDate()<10? '0'+(logDate.getDate()):logDate.getDate())+' ';
    const h=(logDate.getHours()<10? '0'+(logDate.getHours()):logDate.getHours())+':';
    const m=(logDate.getMinutes()<10? '0'+(logDate.getMinutes()):logDate.getMinutes())+':';
    const s=(logDate.getSeconds()<10? '0'+(logDate.getSeconds()):logDate.getSeconds());
    const date=Y+M+D+h+m+s;
    return date;
  }
    },
  ];

  componentDidMount(){
    this.props.rootStore.monitorLogStore.initAllMonitorLog();
    this.props.rootStore.monitorLogStore.initAllInstanceName();
  }

  render(){
    const store=this.props.rootStore.monitorLogStore;
    return(
      <div>
        <div style={{paddingBottom:"12px"}}>
          <LocaleProvider locale={zh_CN}>
          <Row gutter={25}>
            <Col span={2} offset={0} style={{lineHeight:'32px'}}>虚拟机名称:</Col>
            <Col span={2}>
              <Select style={{width:150}}  onChange={store.setInstanceName}>
                <Option  value={''} style={{color:'white'}}>&nbsp;</Option>
                {
                  store.allInstanceName.filter(d=>d).map(s=>
                    <Option key={s.id} value={s.instance_name}>{s.instance_name}</Option>)
                }
              </Select>
            </Col>
            <Col span={2} offset={3} style={{lineHeight:'32px'}}>数据采集时间:</Col>
            <Col span={2}>
              <DatePicker
                disabledDate={store.disabledStartDate}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                value={store.startValue}
                placeholder="开始时间"
                onChange={store.onStartChange}
                onOpenChange={store.handleStartOpenChange}
                style={{width:170}}
              />
            </Col>
            <Col span={2} offset={1}>
              <DatePicker
                disabledDate={store.disabledEndDate}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                value={store.endValue}
                placeholder="结束时间"
                onChange={store.onEndChange}
                open={store.endOpen}
                onOpenChange={store.handleEndOpenChange}
                style={{width:170}}
              />
            </Col>

            {/*<Col span={2} offset={2} style={{lineHeight:'32px'}}>操作类型:</Col>
            <Col span={2}>
              <Select style={{width:150}}  onChange={store.setOperateType}>
                <Option  value={''} style={{color:'white'}}>&nbsp;</Option>
                {
                  store.allOperateType.filter(d=>d).map(s=>
                    <Option key={s.operate_type} value={s.operate_type}>{s.operate_type}</Option>)
                }
              </Select>
            </Col>*/}
            <Col span={4} style={{ textAlign: 'right',float:'right' }}>
              <Button icon="search" onClick={store.loadQueryMonitorLog}>查询</Button>
            </Col>
          </Row>
          </LocaleProvider>
        </div>
        <Modal visible={store.detailMonitorLog}
               width={900}
               title="日志详情"
               footer={null}
               onCancel={store.toggleDetailLog}
               maskClosable={false}
               destroyOnClose={true}
        >
          <ShowDetailMonitorLog />
        </Modal>
        <Table columns={this.columns}
               rowKey={record => record.id}
               dataSource={store.allMonitorLog.filter(d=>d)}
               rowSelection={null}
               size="small"
               pagination={{
                 defaultCurrent:1,
                 defaultPageSize:8,
                 total:store.logTotal,
                 showQuickJumper:true,
                 showTotal:(total)=>`总共 ${total}条`
               }}
               onRow={(record) => {
                 return {
                   onClick: ()=>{
                     store.loadDtailMonitorLog(record);
                   }
                 };
               }
               }
        >
        </Table>
      </div>
    );
  }
}
export default  MonitorLog;
