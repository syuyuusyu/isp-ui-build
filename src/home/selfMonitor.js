import React from 'react';
import {Table,Modal,Icon,Spin} from 'antd';
import {inject,observer} from 'mobx-react';
import '../style.css';
//import RoleButton from "../roleButton";
//const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@inject('rootStore')
@observer
class SelfMonitor extends React.Component{

    componentDidMount(){
        this.props.rootStore.homeStore.loadSelfMonitor();
    }

    // "instanceName":"S01012",
    // "disk.usage":0,
    // "disk.root.size":50,
    // "memory.usage":412.5005875440658,
    // "memory":8192,
    // "cpu_util":0.09556513314931972,
    // "vcpus":2

    columns = [
        {dataIndex: 'instanceName', title: '虚拟机名称', width: 200,},
        {dataIndex: 'disk.usage', title: '硬盘使用量', width: 200,},
        {dataIndex: 'disk.root.size', title: '硬盘总量', width: 200,},
        {dataIndex: 'memory.usage', title: '内存使用量', width: 200,},
        {dataIndex: 'memory', title: '内存总量', width: 200,},
        {dataIndex: 'cpu_util', title: 'CUP使用百分比', width: 200,},
        {dataIndex: 'vcpus', title: '虚拟CPU数', width: 200,},


    ];



    render(){
        const store=this.props.rootStore.homeStore;
        return (
            <div>
                <Spin indicator={antIcon} tip='获取监控数据' spinning={store.isLoadingMonitor}>
                    <Table columns={this.columns}
                           rowKey={record => record.id}
                           dataSource={store.selfMonitor.filter(d=>d)}
                           //rowSelection={null}
                           size="small"
                           scroll={{ y: 800 }}
                        //expandedRowRender={this.expandedRowRender}
                        //pagination={this.state.pagination}
                        //loading={this.state.loading}
                        //onChange={this.handleTableChange}
                    />
                </Spin>
            </div>
        );
    }
}

export default SelfMonitor;
