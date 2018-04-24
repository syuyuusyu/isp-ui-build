import React, { Component } from 'react';
import {Table,Col,Button,Row,Select,Modal} from 'antd';
import {inject,observer} from 'mobx-react';
import ShowDetailLog from './showDetailLog';

const Option = Select.Option;

@inject('rootStore')
@observer
class DaibanLog extends Component{
  columns=[
    {dataIndex:'operate_user',title:'登录用户',width:25},
    {dataIndex:'operate_ip',title:'登录的ip',width:25},
    {dataIndex:'daiban_info',title:'待办信息',width:25},
    {dataIndex:'daiban_status',title:'待办状态',width:25},
    {dataIndex:'create_time',title:'操作时间',width:25,
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
    }
  ];

  componentDidMount(){
    this.props.rootStore.daibanLogStore.initAllDaibanLog();
    this.props.rootStore.daibanLogStore.initAllLoginName();
    this.props.rootStore.daibanLogStore.initDaibanStatus();
  }
  render(){
    const store=this.props.rootStore.daibanLogStore;
    return(
     <div>
       <Row gutter={25}>
         <Col span={2}  offset={0} style={{ textAlign: 'right' }}>
           <Button icon="plus-circle" onClick={store.getRefreshDaibanLog}>刷新</Button>
         </Col>
         <Col span={2} offset={2} style={{lineHeight:'32px'}}>登录用户:</Col>
         <Col span={2}>
           <Select style={{width:150}}  onChange={store.setLoginName}>
             <Option  value={''} style={{color:'white'}}>&nbsp;</Option>
             {
               store.allLoginName.filter(d=>d).map(s=>
                 <Option key={s.operate_user} value={s.operate_user}>{s.operate_user}</Option>)
             }
           </Select>
         </Col>
         <Col span={2} offset={2} style={{lineHeight:'32px'}}>待办状态:</Col>
         <Col span={2}>
           <Select style={{width:150}}  onChange={store.setDaibanStatus}>
             <Option  value={''} style={{color:'white'}}>&nbsp;</Option>
             {
               store.allDaibanStatus.filter(d=>d).map(s=>
                 <Option key={s.daiban_status} value={s.daiban_status}>{s.daiban_status}</Option>)
             }
           </Select>
         </Col>
         <Col span={4} style={{ textAlign: 'right',float:'right' }}>
           <Button icon="search" onClick={store.loadQuerySystemLog}>查询</Button>
         </Col>
       </Row>
       <Modal visible={store.detailDaibanLog}
              width={850}
              title="日志详情"
              footer={null}
              onCancel={store.toggleDetailSystemLog}
              maskClosable={false}
              destroyOnClose={true}
       >
         <ShowDetailLog />
       </Modal>
      <Table
        columns={this.columns}
        rowKey={record => record.id}
        dataSource={store.allDaibanLog.filter(d=>d)}
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
              store.loadDetailDaibanLog(record);
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
export default DaibanLog;
