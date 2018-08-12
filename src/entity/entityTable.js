import React, {Component} from 'react';
import { Divider, Popconfirm, Table, Modal, Row, Col,Button,Drawer,Select} from 'antd';
import {inject, observer} from 'mobx-react';
import {dateFtt} from '../util';
import ColumnTable from './columnTable';

const Option=Select.Option;

//import {SysOperationStore} from "./store";

//const TreeNode = Tree.TreeNode;
//const {Content, Sider} = Layout;

@inject('rootStore')
@observer
class EntityTable extends Component {

    columns = [
        {
            dataIndex: 'tableName', title: '表名', width: 80
        },
        {dataIndex: 'entityCode', title: '编码', width: 80,},
        {dataIndex: 'entityName', title: '名称', width: 100,},
        {dataIndex: 'idField', title: 'ID字段', width: 80,},
        {dataIndex: 'parentId', title: '父类实体', width: 80,},
        {dataIndex: 'pidField', title: '父ID字段', width: 80,},
        {
            title: '操作',
            width: 320,
            render: (text, record) => {
                return (
                    <span>
                        <Button icon="menu-unfold"
                                onClick={this.props.rootStore.entityStore.checkColumn(record)} size='small'>查看表字段</Button>
                        <Divider type="vertical"/>
                        <Button icon="play-circle-o" onClick={null} size='small'>设置表关联</Button>
                        <Divider type="vertical"/>
                        <Button icon="play-circle-o" onClick={null} size='small'>SQL配置</Button>
                        <Divider type="vertical"/>
                        <Button icon="edit" onClick={null} size='small'>修改</Button>
                        <Divider type="vertical"/>
                        <Popconfirm onConfirm={null} title="确认删除?">
                            <Button icon="edit" onClick={null} size='small'>删除</Button>
                        </Popconfirm>
                    </span>
                )
            }
        }
    ];



    componentDidMount() {
        this.props.rootStore.entityStore.loadEntitys();
    }

    componentWillUpdate(){
        //console.log('componentWillUpdate:'+this.constructor.name);
        //this.props.rootStore.sysOperationStore.loadCurrentSys(this.props.match.params.sysId);
    }

    render() {
        const store = this.props.rootStore.entityStore;
        return (
            <div>
                <Row gutter={2} className="table-head-row">
                    <Col span={4} style={{ textAlign: 'right' }} className="col-button">
                            <Button icon="plus-circle-o">新建</Button>
                    </Col>

                </Row>
                <Drawer
                    title={store.currentEntity.entityName}
                    placement="right"
                    width={1020}
                    zIndex={999}
                    closable={true}
                    maskClosable={false}
                    destroyOnClose={true}
                    onClose={store.toggleColumnTableVisible}
                    visible={store.columnTableVisible}

                >
                    <ColumnTable/>
                </Drawer>
                <Table columns={this.columns}
                       rowKey={record => record.id}
                       dataSource={store.entitys.filter(d => d)}
                       rowSelection={null}
                       size="small"
                       scroll={{y: 800,}}
                />
            </div>
        );
    }
}

export default EntityTable;