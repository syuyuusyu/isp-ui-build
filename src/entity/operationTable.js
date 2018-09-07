import React, {Component} from 'react';
import { Divider, Popconfirm, Table, Modal, Row, Col,Button,Drawer,Select,notification} from 'antd';
import {inject, observer} from 'mobx-react';
import {baseUrl, get} from '../util';
import MonyToMonyForm from './monyTomonyForm';
import '../style.css';

const Option=Select.Option;

//import {SysOperationStore} from "./store";

//const TreeNode = Tree.TreeNode;
//const {Content, Sider} = Layout;

@inject('rootStore')
@observer
class OperationTable extends Component {

    columns = [
        {dataIndex: 'name', title: '操作名称', width: 120,},
        {
            dataIndex: 'icon', title: '图标', width: 50
        },
        {dataIndex: 'pagePath', title: '类所在目录', width: 120,},
        {dataIndex: 'pageClass', title: '页面类名', width: 120,},
        {
            title: '操作',
            width: 320,
            render: (text, record) => {
                return (
                    <span>
                        <Divider type="vertical"/>
                        <Button icon="edit"
                                onClick={this.props.rootStore.entityStore.showMonyToMonyForm(true,record)} size='small'>修改</Button>
                        <Divider type="vertical"/>
                        <Popconfirm onConfirm={this.delete(record.id)} title="确认删除?">
                            <Button icon="delete" onClick={null} size='small'>删除</Button>
                        </Popconfirm>
                    </span>
                )
            }
        }
    ];

    delete=(id)=>(async ()=>{
        let json=await get(`${baseUrl}/entity/deleteConfig/entity_mony_to_mony/id/${id}`);
        if(json.success){
            notification.info({
                message: '删除成功'
            });
        }else{
            notification.error({
                message: '删除失败'
            });
        }
        this.props.rootStore.entityStore.loadMonyToMonys();
    });


    componentDidMount() {
        this.props.rootStore.entityStore.loadEntityOperations();
    }


    render() {
        const store = this.props.rootStore.entityStore;
        return (
            <div>
                <Modal visible={store.monyToMonyFormVisible}
                       width={400}
                       title="配置表多对多关系"
                       footer={null}
                       onCancel={store.toggleMonyToMonyFormVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <MonyToMonyForm/>
                </Modal>
                <Row gutter={2} className="table-head-row">
                    <Col span={4} style={{ textAlign: 'right' }} className="col-button">
                        <Button icon="plus-circle-o" onClick={store.showMonyToMonyForm(false,null)}>新建操作</Button>
                    </Col>
                </Row>
                <Table columns={this.columns}
                       rowKey={record => record.id}
                       dataSource={store.entityOperations.filter(d => d)}
                       rowSelection={null}
                       size="small"
                       scroll={{y: 800,}}
                />
            </div>
        );
    }
}

export default OperationTable;