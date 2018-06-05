import React, { Component } from 'react';
import {Table,Col,Button,Row,Select,Modal} from 'antd';
import {inject,observer} from 'mobx-react';
import ShowDetailLog from './showDetailLog';

const Option = Select.Option;

@inject('rootStore')
@observer
class BacklogLog extends Component{
  columns=[
    {dataIndex:'operate_user',title:'登录用户',width:25},
    {dataIndex:'operate_ip',title:'登录的ip',width:25},
    {dataIndex:'backlog_info',title:'待办信息',width:25},
    {dataIndex:'backlog_status',title:'待办状态',width:25},
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
    this.props.rootStore.backlogLogStore.initAllBacklogLog();
    this.props.rootStore.backlogLogStore.initAllLoginName();
    this.props.rootStore.backlogLogStore.initBacklogStatus();
  }
  render(){
    const store=this.props.rootStore.backlogLogStore;
    return(
     <div>
       <Row gutter={25}>
         <Col span={2}  offset={0} style={{ textAlign: 'right' }}>
           <Button icon="plus-circle" onClick={store.getRefreshBacklogLog}>刷新</Button>
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
           <Select style={{width:150}}  onChange={store.setBacklogStatus}>
             <Option  value={''} style={{color:'white'}}>&nbsp;</Option>
             {
               store.allBacklogStatus.filter(d=>d).map(s=>
                 <Option key={s.backlog_status} value={s.backlog_status}>{s.backlog_status}</Option>)
             }
           </Select>
         </Col>
         <Col span={4} style={{ textAlign: 'right',float:'right' }}>
           <Button icon="search" onClick={store.loadQuerySystemLog}>查询</Button>
         </Col>
       </Row>
       <Modal visible={store.detailBacklogLog}
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
        dataSource={store.allBacklogLog.filter(d=>d)}
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
              store.loadDetailBacklogLog(record);
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
export default BacklogLog;
