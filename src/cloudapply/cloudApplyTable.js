import React from 'react';
import {Table,Icon,Spin,Modal,Row,Col,Button} from 'antd';
import {inject,observer} from 'mobx-react';
import CloudForm from './cloudForm';
//import {baseUrl, get} from "../util";
import '../style.css';

//const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@inject('rootStore')
@observer
class CloudApplyTable extends React.Component{

    timeoutid=0;

    componentDidMount(){
        //this.props.rootStore.cloudStore.scheduleToken();
        this.props.rootStore.cloudStore.loadServerInfo();
        // this.timeoutid=setInterval(
        //     this.props.rootStore.cloudStore.loadServerInfo,
        //     1000*60
        // )
        this.timeoutid=setInterval(
            this.props.rootStore.cloudStore.scheduleToken,
            1000*60*20
        )
    }

    componentWillUnmount(){
        clearInterval(this.timeoutid);
    }
    columns=[
        {dataIndex:'id',title:'实列ID',width:200},
        {dataIndex:'name',title:'实列名称',width:180},
        {dataIndex:'status',title:'状态',width:100,
            render:(text)=>{
                switch (text){
                    case 'active':
                        return '运行中';
                    case '2':
                        return '创建成功';
                    case '3':
                        return '创建失败';
                    default :
                        return text;
                }
            }
        },
        {
            title:'操作',width:100,
            render:(text,record)=>{
                return (
                    <span>
                        <Button onClick={this.props.rootStore.cloudStore.detail(record)} icon="desktop">查看详细信息</Button>
                    </span>
                );
            }
        }


    ];

    render(){
        const store=this.props.rootStore.cloudStore;
        console.log(store.serverInfo);
        return (<div>
            <Spin indicator={antIcon} tip={store.loadingtest} spinning={store.loading}>
                <Modal visible={store.formVisible}
                       width={400}
                       title={`新建云机`}
                       footer={null}
                       onCancel={store.toggleFormVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <CloudForm />
                </Modal>
                <Row gutter={2} className="table-head-row">

                    <Col span={4} style={{ textAlign: 'right' }} className="col-button">
                            <Button onClick={store.toggleFormVisible} icon="plus-circle-o">新建云机</Button>
                    </Col>

                </Row>
            <Table columns={this.columns}
                   rowKey={record => record.id}
                   dataSource={store.serverInfo.filter(d=>d)}
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

export default CloudApplyTable;