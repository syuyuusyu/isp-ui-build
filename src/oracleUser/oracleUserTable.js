import React from 'react';
import {Table,Icon,Spin,Modal,Row,Col,Button,Select} from 'antd';
import {inject,observer} from 'mobx-react';
import {Link} from "react-router-dom";
import CreateOracleUserForm from "./createOracleUserForm";

const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@inject('rootStore')
@observer
class OracleUserTable extends React.Component{
  componentDidMount(){
    this.props.rootStore.oracleUserStore.loadDataAcc();
  }

  columns=[
    {dataIndex:'user_id',title:'用户id',width:60},
    {dataIndex:'username',title:'用户名',width:120},
    {dataIndex:'defaultTbs',title:'默认表空间',width:100},
    {dataIndex:'tempTbs',title:'临时表空间',width:100},
    {dataIndex:'account_status',title:'是否可用',width:100, render:(account_status)=>{return account_status==='OPEN'?'是':'否'}},
    {dataIndex:'instanceName',title:'所属实例',width:100},
    {dataIndex:'created',title:'创建时间',width:100, sorter:(a,b)=>Date.parse(b.created)-Date.parse(a.created)},
  ];

 render(){
   const store=this.props.rootStore.oracleUserStore;
   return(
     <div>
       <Spin indicator={antIcon} tip={store.loadingInfo} spinning={store.loading}>
         <Modal visible={store.formVisible}
                width={1000}
                title={`新建用户`}
                footer={null}
                onCancel={store.toggleFormVisible}
                maskClosable={false}
                destroyOnClose={true}
         >
           <CreateOracleUserForm />
         </Modal>
         <Row gutter={2} className="table-head-row">
           <Col span={4} style={{ textAlign: 'right' }} className="col-button">
             <Button onClick={store.toggleFormVisible} icon="plus-circle-o">新建用户</Button>
             {/*<Icon type="profile" />&nbsp;&nbsp; <Link to="/createOracleUser">新建用户</Link>*/}
           </Col>
           <Col span={2} offset={0} style={{lineHeight:'32px'}}>用户名:</Col>
           <Col span={3} offset={1}>
             <Select style={{width:150}}  onChange={store.setQueryOracleUser}>
               <Option  value={''} style={{color:'white'}}>&nbsp;</Option>
               {
                 store.allOracleUserBack.filter(d=>d).map(s=>
                   <Option key={s.username} value={s.username}>{s.username}</Option>)
               }
             </Select>
           </Col>
           <Col span={4}>
             <Button icon="search" onClick={store.loadQueryOracleUser}>查询</Button>
           </Col>
         </Row>
         <Table columns={this.columns}
                rowKey={record => record.user_id}
                dataSource={store.allOracleUser.filter(d=>d).sort((a,b)=>Date.parse(b.created)-Date.parse(a.created))}
                rowSelection={null}
                size="small"
                scroll={{ y: 800 }}
                //pagination={null}
         />
       </Spin>
     </div>
   );
 }
}
export default OracleUserTable;
