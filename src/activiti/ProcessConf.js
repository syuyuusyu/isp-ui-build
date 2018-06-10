import React from 'react';
import {Table,Button,Divider,Popconfirm,Modal,Icon,Spin,Row,Col,Progress} from 'antd';
import {inject, observer} from 'mobx-react';
import CreateModelForm from './createModelForm';
import '../style.css';
import FileFrom from './fileFrom';
import {activitiUrl} from "../util";


const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@inject('rootStore')
@observer
class ProcessConf extends React.Component {

    componentDidMount(){
        this.props.rootStore.activitiStore.loadProcess();
    }

    // "id": "process:1:25010",
    // "url": "http://localhost:5002/repository/process-definitions/process:1:25010",
    // "key": "process",
    // "version": 1,
    // "name": null,
    // "description": null,
    // "tenantId": "",
    // "deploymentId": "25001",
    // "deploymentUrl": "http://localhost:5002/repository/deployments/25001",
    // "resource": "http://localhost:5002/repository/deployments/25001/resources//Users/syu/project/bzworkspace/activiti-server/target/classes/processes/test.bpmn20.xml",
    // "diagramResource": "http://localhost:5002/repository/deployments/25001/resources//Users/syu/project/bzworkspace/activiti-server/target/classes/processes/test.process.png",
    // "category": "http://www.activiti.org/processdef",
    // "graphicalNotationDefined": true,
    // "suspended": false,
    // "startFormDefined": false


    columns=[
        {dataIndex: 'id', title: 'ID', width: 120},
        {dataIndex: 'name', title: '名称', width: 100},
        {dataIndex: 'key', title: '标识', width: 80},
        {dataIndex: 'deploymentId',title:'部署ID',width:50},
        {dataIndex: 'version', title: '版本号', width: 50},
        {dataIndex: 'deploymentUrl', title: '部署URL', width: 150},
        // {dataIndex: 'resource', title: '流程XML', width: 150},
        // {dataIndex: 'diagramResource', title: '流程图片', width: 150},
        {dataIndex: 'suspended', title: '状态', width: 50,
            render:(text)=>{
                return text?'暂停':'激活';
            }
        },//deploymentId

        {
            title: '操作',
            width: 440,
            render: (text, record) => {
                return (
                    <span>
                        <Button icon="upload" onClick={this.props.rootStore.activitiStore.changeState(record.id,record.suspended)} size='small'>
                            {
                                record.suspended?'激活':'挂起'
                            }
                            </Button>
                        <Divider type="vertical"/>
                        <Button icon="upload" onClick={this.props.rootStore.activitiStore.toModel(record)} size='small'>转化为模型</Button>
                         <Divider type="vertical"/>
                        <Button icon="upload" href={`${activitiUrl}/process/resource/read?procDefId=${record.id}&resType=xml`} target='_blank' size='small'>查看流程XML</Button>
                         <Divider type="vertical"/>
                        <Button icon="upload" href={`${activitiUrl}/process/resource/read?procDefId=${record.id}&resType=image`} target='_blank' size='small'>查看流程图片</Button>
                        <span>
                            <Divider type="vertical"/>
                            <Popconfirm onConfirm={this.props.rootStore.activitiStore.deleteProcess(record.deploymentId)} title="确认删除?">
                                <Button  icon="delete" onClick={null} size='small'>删除</Button>
                            </Popconfirm>
                        </span>
                    </span>
                );

            }
        }
    ];


    render() {
        const store = this.props.rootStore.activitiStore;
        return (
            <div>
                <Row gutter={8} className="table-head-row">
                    <Col span={8} style={{ textAlign: 'right' }} className="col-button">
                        <Button icon="upload" onClick={store.togglerFileFormVisible} size='default'>上传模型</Button>
                    </Col>
                </Row>
                <Modal visible={store.fileFormVisible}
                       width={400}
                       title={`上传模型`}
                       footer={null}
                       onCancel={store.togglerFileFormVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <FileFrom />
                </Modal>
                <Table columns={this.columns}
                       rowKey={record => record.id}
                       dataSource={store.process.filter(d => d)}
                       rowSelection={null}
                       size="small"
                       scroll={{y: 800}}
                       pagination={null}
                />
            </div>
        );
    }
}

export default ProcessConf;