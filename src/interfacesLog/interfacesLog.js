import React, { Component } from 'react';
import {Table,Col,Button,Row,Select} from 'antd';
import {inject,observer} from 'mobx-react';
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
    {dataIndex:'id',title:'id',width:20},
    {dataIndex:'system',title:'系统编号',width:25},
    {dataIndex:'system_cn',title:'系统名',width:50},
    {dataIndex:'ip',title:'调用接口的ip',width:50},
    {dataIndex:'interfaces_name',title:'调用接口名',width:50},
    /*{dataIndex:'reqdate_info',title:'请求体信息',width:50},*/
    {dataIndex:'response_info',title:'响应信息',width:40},
    {dataIndex:'response_status',title:'响应状态',width:30},
    {dataIndex:'message',title:'响应状态信息',width:50},
    {dataIndex:'invoke_date',title:'调用时间',width:90,
           render:(invokeDate)=>{
              const time=new Date(invokeDate);
              const localtime=time.toLocaleString();
              return localtime;

           }
    }
    ];
   componentDidMount(){

    this.props.rootStore.interfacesLog.initAllInterfacesLog();
    this.props.rootStore.interfacesLog.initAllsystem();
    this.props.rootStore.interfacesLog.initAllInterfaces();
    //await this.props.rootStore.interfacesLog.loadQueryLog();
  }
  render(){

    const store=this.props.rootStore.interfacesLog;
    //const a=Object.create(store.pagination);
    return(
      <div>
        <Row gutter={25}>
        <Col span={2}  offset={0} style={{ textAlign: 'right' }}>
          <Button icon="plus-circle" onClick={this.props.rootStore.interfacesLog.getRefreshLog}>刷新</Button>
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
          <Col span={2} offset={3} style={{lineHeight:'32px'}}>调用接口名:</Col>
          <Col span={2}>
            <Select style={{width:150}}  onChange={store.setInterfacesName}>
              <Option  value={''} style={{color:'white'}}>&nbsp;</Option>
              {
                store.allInterfaces.filter(d=>d).map(s=>
                  <Option key={s.interfaces_name} value={s.interfaces_name}>{s.interfaces_name}</Option>)
              }
            </Select>
          </Col>
          <Col span={4} style={{ textAlign: 'right',float:'right' }}>
            <Button icon="search" onClick={store.loadQueryLog}>查询</Button>
          </Col>
        </Row>
    <Table columns={this.columns}
           rowKey={record => record.id}
           dataSource={store.allInterfacesLog.filter(d=>d)}
           rowSelection={null}
           size="small"
           scroll={{ y: 800 }}
           pagination={{
             defaultCurrent:1,
             defaultPageSize:8,
             total:store.logTotal,
             showQuickJumper:true,
             showTotal:(total)=>`总共 ${total}条`
           }}
    >
{/*      <Pagination
        showQuickJumper={true}
        defaultCurrent={1}
        total={store.logTotal}
        pageSize={5}
      />*/}
    </Table>
     </div>   );
  }
}
export default InterfacesLog;
