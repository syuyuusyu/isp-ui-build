import React, { Component } from 'react';
import {Table,Col,Button,Row,Select,Modal} from 'antd';
import {inject,observer} from 'mobx-react';
import ShowDetailLog from './showDetailLog';
//import {InterfacesLogStory} from "./store";

const Option = Select.Option;

@inject('rootStore')
@observer
class InterfacesLog extends Component{
/*  constructor(){
    super(...arguments);
    this.store=this.props.rootStore.interfacesLog;
  }*/


  columns=[
    /*{dataIndex:'id',title:'id',width:20},*/
    {dataIndex:'initiativeSystem',title:'调用方系统编号',width:40},
    {dataIndex:'initiativeSystem_CN',title:'调用方系统名称',width:60},
    {dataIndex:'initiative_ip',title:'调用方地址',width:60},
    {dataIndex:'system',title:'被调用方系统编号',width:40},
    {dataIndex:'system_cn',title:'被调用方系统名称',width:60},
    {dataIndex:'ip',title:'被调用方地址',width:50},
    /*{dataIndex:'reqdate_info',title:'请求体信息',width:50},*/
    /*{dataIndex:'response_info',title:'响应信息',width:40},*/
    {dataIndex:'response_status',title:'响应状态',width:30},
    {dataIndex:'message',title:'响应状态信息',width:50},
    {dataIndex:'invoke_date',title:'调用时间',width:60,
           render:(invokeDate)=>{
              /*const time=new Date(invokeDate);
              const localtime=time.toLocaleString();
              return localtime;*/

             const logDate=new Date(invokeDate);
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
  /*  {title:'操作' ,width:100,
      render:(record)=>{
      return(
        <span>
          <Button icon='eye-o' onClick={null} size='small'>查看</Button>
        </span>
      );
      }
    }*/
    ];
   componentDidMount(){

    this.props.rootStore.interfacesLog.initAllInterfacesLog();
    this.props.rootStore.interfacesLog.initAllsystem();
    this.props.rootStore.interfacesLog.initAllstatus();
  }
  /*componentDidUpdate(){
    this.props.rootStore.interfacesLog.initAllsystem();
    this.props.rootStore.interfacesLog.initAllstatus();
  }*/

  render(){

    const store=this.props.rootStore.interfacesLog;
    return(
      <div>
        <div style={{paddingBottom:"12px"}}>
        <Row gutter={25}>
        <Col span={2}  offset={0} style={{ textAlign: 'right' }}>
          <Button icon="reload" onClick={this.props.rootStore.interfacesLog.getRefreshLog}>刷新</Button>
        </Col>
          <Col span={2} offset={2} style={{lineHeight:'32px'}}>系统平台:</Col>
          <Col span={2}>
            <Select style={{width:150}}  onChange={store.setSystemName}>
              <Option  value={''} style={{color:'white'}}>&nbsp;</Option>
              {
                store.allSystems.filter(d=>d).map(s=>
                  <Option key={s.system_cn} value={s.system_cn}>{s.system_cn}</Option>)
              }
            </Select>
          </Col>
          <Col span={2} offset={2} style={{lineHeight:'32px'}}>响应状态:</Col>
          <Col span={2}>
            <Select style={{width:150}}  onChange={store.setStatus}>
              <Option  value={''} style={{color:'white'}}>&nbsp;</Option>
              {
                store.allStatus.filter(d=>d).map(s=>
                  <Option key={s.response_status} value={s.response_status}>{s.response_status}</Option>)
              }
            </Select>
          </Col>
      {/*    <Col span={2} offset={3} style={{lineHeight:'32px'}}>调用接口名:</Col>
          <Col span={2}>
            <Select style={{width:150}}  onChange={store.setInterfacesName}>
              <Option  value={''} style={{color:'white'}}>&nbsp;</Option>
              {
                store.allInterfaces.filter(d=>d).map(s=>
                  <Option key={s.interfaces_name} value={s.interfaces_name}>{s.interfaces_name}</Option>)
              }
            </Select>
          </Col>*/}
          <Col span={4} style={{ textAlign: 'right',float:'right' }}>
            <Button icon="search" onClick={store.loadQueryLog}>查询</Button>
          </Col>
        </Row>
        </div>
        <Modal visible={store.detailLog}
               width={900}
               title="日志详情"
               footer={null}
               onCancel={store.toggleDetailLog}
               maskClosable={false}
               destroyOnClose={true}
        >
          <ShowDetailLog />
        </Modal>

    <Table columns={this.columns}
           rowKey={record => record.id}
           dataSource={store.allInterfacesLog.filter(d=>d)}
           rowSelection={null}
           size="small"
           /*scroll={{ y: 800 }}*/
           /*rowSelection={rowSelection}*/
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
                store.loadDtailLog(record);
               }
             };
           }
           }

    >
    </Table>
     </div>   );
  }
}
export default InterfacesLog;
