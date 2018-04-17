import React from 'react';
import {Table,Icon,Spin,Modal,Row,Col,Button,Select} from 'antd';
import {inject,observer} from 'mobx-react';
import SpaceForm from './spaceForm';
import {convertGiga} from "../util";
import '../style.css';

const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@inject('rootStore')
@observer
class DataSpaceTable extends React.Component{

    timeoutid=0;

    componentDidMount(){
        this.props.rootStore.dataSpaceStore.loadDataAcc();
        this.timeoutid=setInterval(
            this.props.rootStore.dataSpaceStore.scheduleToken,
            1000*60*20
        )
    }

    componentWillUnmount(){
        clearInterval(this.timeoutid);
    }

    renderUnit=(value)=>{const {number,unit}=convertGiga(value);return number+unit};

    columns=[
        {dataIndex:'tablespace_name',title:'表空间',width:100},
        {dataIndex:'type',title:'类型',width:120},
        {dataIndex:'total',title:'总大小',width:100,render:this.renderUnit},
        {dataIndex:'free',title:'空闲',width:100,render:this.renderUnit},
        {dataIndex:'used',title:'已使用',width:100,render:this.renderUnit},
        {title:'使用率',width:120,render:(value,record)=>Math.round(record.used/record.total*100)+'%' },


    ];

    render(){
        const store=this.props.rootStore.dataSpaceStore;
        return (<div>
            <Spin indicator={antIcon} tip={store.loadingtest} spinning={store.loading}>
                <Modal visible={store.formVisible}
                       width={400}
                       title={`新建表空间`}
                       footer={null}
                       onCancel={store.toggleFormVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <SpaceForm/>
                </Modal>
                <Row gutter={2} className="table-head-row">
                    <Col span={2} className="col-label">数据库实列:</Col>
                    <Col span={4} >
                        <Select className="col-input"  onChange={store.selectedAcc}>
                            {
                                store.dataAcc.filter(d=>d).filter(d=>d.dbType==='1').map(s=>
                                    <Option key={s.id} value={s.id}>{s.name}</Option>)
                            }
                        </Select>
                    </Col>
                    <Col span={4} style={{ textAlign: 'right' }} className="col-button">
                        <Button onClick={store.showForm} icon="plus-circle-o">新建表空间</Button>
                    </Col>
                </Row>
                <Table columns={this.columns}
                       rowKey={record => record.tablespace_name}
                       dataSource={store.spaces.filter(d=>d)}
                       rowSelection={null}
                       size="small"
                       scroll={{ y: 800 }}
                       pagination={null}
                    //pagination={this.state.pagination}
                    //loading={this.state.loading}
                    //onChange={this.handleTableChange}
                />
            </Spin>
        </div>);
    }
}

export default DataSpaceTable;