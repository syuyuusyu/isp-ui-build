import React, {Component} from 'react';
import { Divider, Popconfirm, Table, Modal, Row, Col,Card} from 'antd';
import {inject, observer} from 'mobx-react';
import RoleButton from '../roleButton';
import InvokeForm from './invokeForm';
import InvokePromiss from './invokePromiss';
import '../style.css';

@inject('rootStore')
@observer
class InvokeTable extends Component{

    columns = [
        {dataIndex: 'name', title: '名称', width: 100,},
        // {dataIndex: 'code', title: '编码', width: 100,},
        {dataIndex: 'path', title: '路径', width: 100,},
        {dataIndex: 'method', title: '请求方法', width: 60,},
        {
            title: '操作',
            width: 200,
            render: (text, record) => {
                return (
                    <span>
                        {/*<Button icon="edit" onClick={this.props.rootStore.sysOperationStore.showOpForm(record)} size='small'>修改</Button>*/}
                        <RoleButton buttonId={23} onClick={this.props.rootStore.invokeOpStore.showForm(record)}/>
                        <Divider type="vertical"/>
                        <Popconfirm onConfirm={this.props.rootStore.invokeOpStore.delete(record.id)}
                                    title="确认删除?">
                            {/*<Button icon="delete" onClick={null} size='small'>删除</Button>*/}
                            <RoleButton buttonId={24}/>
                        </Popconfirm>
                        {
                            this.props.rootStore.invokeOpStore.currentSys.code!=='s01'?
                                (
                                    <span>
                                        <Divider type="vertical"/>
                                        <RoleButton buttonId={27} onClick={this.props.rootStore.invokeOpStore.showInvokePromiss(record)}/>
                                    </span>
                                )
                                :''
                        }
                    </span>
                );
            }
        }
    ];

    expandedRowRender=(record)=>(
        <div className="box-code-card" style={{ background: '#ECECEC', padding: '1px' }}>
            <Row type="flex" justify="center" align="top" gutter={8}>
                <Col span={8} >
                    <Card  title="请求头示例" bordered={true}><pre>{record.head}</pre></Card>
                </Col>
                <Col span={8} >
                    <Card  title="请求体示例" bordered={false}><pre>{record.body}</pre></Card>
                </Col>
                <Col span={8} >
                    <Card  title="返回结果示例" bordered={false}><pre>{record.result}</pre></Card>
                </Col>

            </Row>
            <Row>
                <Col >
                    <Card title="说明" bordered={false}>{record.info}</Card>
                </Col>
            </Row>
        </div>
    );

    async componentDidMount() {
        let sysId=-1;
        this.props.match.path.replace(/\/(\d+)$/,(w,p1)=>{
            sysId=parseInt(p1,10);
        });
        await this.props.rootStore.invokeOpStore.loadCurrentSys(sysId);
        await this.props.rootStore.invokeOpStore.loadOperationById(sysId);
    }

    render(){
        const store=this.props.rootStore.invokeOpStore;
        return (
            <div>
                <div>
                    <Row gutter={24}>
                        <Col span={20}><span style={{fontSize: '16px'}}>当前平台:{store.currentSys.name}-url:{store.currentSys.url}</span></Col>
                        <Col span={4} style={{textAlign: 'right'}}>
                            <RoleButton buttonId={22} onClick={store.showForm(null)}/>
                        </Col>
                    </Row>
                  <br/>
                </div>
                <Modal visible={store.fromVisible}
                       width={1200}
                       title={`平台接口配置:${store.currentSys.name}-url:${store.currentSys.url}`}
                       footer={null}
                       onCancel={store.toggleFormVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <InvokeForm/>
                </Modal>
                <Modal visible={store.invokePromissFormVisible}
                       width={700}
                       title={`平台访问接口权限配置:${store.currentSys.name}`}
                       footer={null}
                       onCancel={store.toggleInvokePromissFormVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <InvokePromiss/>
                </Modal>
                <Table columns={this.columns}
                       rowKey={record => record.id}
                       dataSource={store.currentOperations.filter(d => d)}
                       rowSelection={null}
                       size="small"
                       scroll={{y: 800,}}
                       expandedRowRender={this.expandedRowRender}
                    //pagination={this.state.pagination}
                    //loading={this.state.loading}
                    //onChange={this.handleTableChange}
                />
            </div>
        );
    }

}

export default InvokeTable;
