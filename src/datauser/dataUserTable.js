import React from 'react';
import {Table,Icon,Spin,Modal,Row,Col,Button,Select} from 'antd';
import {inject,observer} from 'mobx-react';
import UserForm from './userForm';
//import {baseUrl, get} from "../util";
import '../style.css';

const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@inject('rootStore')
@observer
class DataUserTable extends React.Component{

    timeoutid=0;

    componentDidMount(){
        this.props.rootStore.dataUserStore.loadDataAcc();
        //this.props.rootStore.dataUserStore.loadDataUsers();
        this.timeoutid=setInterval(
            this.props.rootStore.cloudStore.scheduleToken,
            1000*60*20
        )
    }

    componentWillUnmount(){
        clearInterval(this.timeoutid);
    }
    columns=[
        {dataIndex:'username',title:'用户名',width:100},
        {dataIndex:'instanceName',title:'所属实例',width:120},
        {dataIndex:'host',title:'可连接主机',width:120,
        render:(host)=>{
          if(host==='%'){
            return '所有主机';
          }else{
            return host;
          }
        }
        },
    ];

    render(){
        const store=this.props.rootStore.dataUserStore;
        return (<div>
            <Spin indicator={antIcon} tip={store.loadingtest} spinning={store.loading}>
                <Modal visible={store.formVisible}
                       width={400}
                       title={`新建用户`}
                       footer={null}
                       onCancel={store.toggleFormVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                       afterClose={this.props.rootStore.dataUserStore.afterClose}
                >
                    <UserForm/>
                </Modal>
                <Row gutter={2} className="table-head-row">
                    {/*<Col span={2} className="col-label">数据库实列:</Col>
                    <Col span={4} >
                        <Select className="col-input"  onChange={store.selectedAcc}>
                            {
                                store.dataAcc.filter(d=>d).filter(d=>d.dbType==='0'||d.dbType==='1').map(s=>
                                    <Option key={s.id} value={s.id}>{s.name}</Option>)
                            }
                        </Select>
                    </Col>*/}
                    <Col span={4} style={{ textAlign: 'right' }} className="col-button">
                        <Button onClick={store.showForm} icon="plus-circle-o">新建用户</Button>
                    </Col>
                </Row>
                <Table columns={this.columns}
                       /*rowKey={record => record.username}*/
                       dataSource={store.allDataUsers.filter(d=>d)}
                       rowSelection={null}
                       size="small"
                       scroll={{ y: 800 }}
                       //pagination={null}
                    //pagination={this.state.pagination}
                    //loading={this.state.loading}
                    //onChange={this.handleTableChange}
                />
            </Spin>
        </div>);
    }
}

export default DataUserTable;
