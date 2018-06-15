import React, { Component } from 'react';
import {Table,Col,Button,Row,Select,Modal} from 'antd';
import {inject,observer} from 'mobx-react';
import ShowDetailSystemLog from './showDetailSystemLog';

const Option = Select.Option;

@inject('rootStore')
@observer
class SystemLog extends Component{
  columns=[
    {dataIndex:'login_name',title:'登录用户',width:25},
    {dataIndex:'operate_type',title:'操作类型',width:25},
    {dataIndex:'operate_ip',title:'操作ip',width:25},
    {dataIndex:'operate_detail',title:'操作详情',width:25},
    {dataIndex:'operate_date',title:'操作时间',width:25,
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

      }}
  ]

  componentDidMount(){
     this.props.rootStore.systemLogStore.initAllSystemLog();
     this.props.rootStore.systemLogStore.initAllLoginName();
     this.props.rootStore.systemLogStore.initOperateType();
  }
  render(){
    const store=this.props.rootStore.systemLogStore;
    return(
      <div>
        <div style={{paddingBottom:"12px"}}>
        <Row gutter={25}>
          {/*<Col span={2}  offset={0} style={{ textAlign: 'right' }}>
            <Button icon="plus-circle" onClick={store.getRefreshSystemLog}>刷新</Button>
          </Col>*/}
          <Col span={2} offset={0} style={{lineHeight:'32px'}}>登录用户:</Col>
          <Col span={2}>
            <Select style={{width:150}}  onChange={store.setLoginName}>
              <Option  value={''} style={{color:'white'}}>&nbsp;</Option>
              {
                store.allLoginName.filter(d=>d).map(s=>
                  <Option key={s.login_name} value={s.login_name}>{s.login_name}</Option>)
              }
            </Select>
          </Col>
          <Col span={2} offset={2} style={{lineHeight:'32px'}}>操作类型:</Col>
          <Col span={2}>
            <Select style={{width:150}}  onChange={store.setOperateType}>
              <Option  value={''} style={{color:'white'}}>&nbsp;</Option>
              {
                store.allOperateType.filter(d=>d).map(s=>
                  <Option key={s.operate_type} value={s.operate_type}>{s.operate_type}</Option>)
              }
            </Select>
          </Col>
          <Col span={4} style={{ textAlign: 'right',float:'right' }}>
            <Button icon="search" onClick={store.loadQuerySystemLog}>查询</Button>
          </Col>
        </Row>
        </div>
        <Modal visible={store.detailSystemLog}
               width={900}
               title="日志详情"
               footer={null}
               onCancel={store.toggleDetailSystemLog}
               maskClosable={false}
               destroyOnClose={true}
        >
          <ShowDetailSystemLog />
        </Modal>
          <Table columns={this.columns}
                  rowKey={record => record.id}
                  dataSource={store.allSystemLog.filter(d=>d)}
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
                        store.loadDetailSystemLog(record);
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
export default SystemLog;
