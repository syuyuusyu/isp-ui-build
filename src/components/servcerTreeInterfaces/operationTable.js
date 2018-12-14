import React, {Component} from 'react';
import {notification, Table,Row,Col,Breadcrumb,Button,Select,Input,Icon} from 'antd';
import {inject, observer} from 'mobx-react';
import {baseUrl, post} from '../../util';
import '../../style.css';

const Option = Select.Option;


@inject('rootStore')
@observer
class OperationTable extends Component {

    pageChange = (page, pageSize) => {
        console.log('pageChange',page, pageSize);
        let start = (page - 1) * pageSize;
        this.queryObj = {...this.queryObj, page, start, pageSize};
        this.query();
    };

    state = {
        dataSource: [],
        pagination: {
            current: 1,
            total: 0,
            size: 'small',
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange: this.pageChange
        },
        selectedRowKeys: [],
        systems:[]
    };

    queryObj = {
        null_service_tree_id:null,
        uneq_system_id:1,
        type: 3,
        page: 0,
        start: 0,
        pageSize: this.state.pagination.pageSize
    };

    componentWillMount() {

        this.query();
        this.queryCandidate();
    }

    query=async ()=>{
        let json = await post(`${baseUrl}/entity/query/1003`, this.queryObj);
        this.setState({
                pagination: {
                    ...this.state.pagination,
                    total: json.total,
                    current: this.queryObj ? this.queryObj.page : 1,
                },
                dataSource: json.data
            }
        );
    };

    queryCandidate=async ()=>{
        let json = await post(`${baseUrl}/entity/queryCandidate/201`, {stateflag:1});
        json=json.filter(d=>d.value!==1);
        this.setState({systems:json});
    };

    onSelectRows = (selectedRowKeys) => {
        this.setState({selectedRowKeys: selectedRowKeys});
    };

    selected=(value)=>{
        this.queryObj={...this.queryObj,system_id:value};
    };

    connect=async ()=>{
        const store=this.props.rootStore.commonStore;
        if(this.state.selectedRowKeys.length==0){
            notification.error({
                message: '至少选中一个接口'
            });
            return;
        }
        let json=await post(`${baseUrl}/sys/updateServiceTree`,{treeId:store.currentTableRow.id,ids:this.state.selectedRowKeys});
        if(json.success){
            notification.info({
                message: '关联成功'
            });
        }else {
            notification.error({
                message: '系统错误'
            });
        }
        store.toggleOperationVisible(this.props.operationId)();

    };



    columns = [
        {dataIndex: 'system_name', title: '系统名称', width: 200,},
        {dataIndex: 'name', title: '名称', width: 200,},
        {dataIndex: 'path', title: '路径', width: 200,},
        {dataIndex: 'method', title: '请求方法', width: 60,},
    ];

    render() {
        const store=this.props.rootStore.commonStore;
        return (
            <div>
                <Row gutter={2} className="table-head-row">
                    <Col span={2} className="col-label">系统名称:</Col>
                    <Col span={6} >
                        <Select style={{ minWidth: '200px' }} onSelect={this.selected} >
                            <Option key={-1} value={null}>&nbsp;</Option>
                            {
                                this.state.systems.map(s=>{
                                    return <Option key={s.value} value={s.value}>{s.text}</Option>
                                })
                            }
                        </Select>
                    </Col>
                    <Col span={2} ><Button icon="search" onClick={this.query}></Button></Col>
                </Row>
                <Row>
                    <Col span={16} style={{textAlign: 'left'}}>
                        <Breadcrumb style={{ margin: '10px 8px' }}>
                            <Breadcrumb.Item>当前树节点:</Breadcrumb.Item>
                            {
                                store.currentRoute
                                    .filter(d=>d).map(r=><Breadcrumb.Item key={r.id}>{r.text}</Breadcrumb.Item>)
                            }
                        </Breadcrumb>
                    </Col>
                    <Col span={8} style={{textAlign: 'right'}}>
                        <Button icon="link" onClick={this.connect}>将选中接口关联到当前树节点</Button>
                    </Col>
                </Row>
                <Table style={{height: "100%"}}
                       columns={this.columns}
                       rowKey={record => record['id']}
                       dataSource={this.state.dataSource}
                       rowSelection={{selectedRowKeys: this.state.selectedRowKeys, onChange: this.onSelectRows}}
                       size="small"
                       scroll={{y: 800, x: 700}}
                       pagination={this.state.pagination}
                />
            </div>
        );
    }
}

export default OperationTable;