import React, {Component} from 'react';
import {   Table, Row, Col,Button} from 'antd';
import {inject, observer} from 'mobx-react';

import '../style.css';

@inject('rootStore')
@observer
class ApplyPlatform extends Component{

    columns = [
        {dataIndex: 'name', title: '平台名称', width: 200,},
        {dataIndex: 'count', title: '是否可以访问', width: 100,
            render:(value)=>{
                if(value>0){
                    return <span style={{width:10,backgroundColor:'green'}}>是</span>
                }else{
                    return <span style={{width:10,backgroundColor:'red'}}>否</span>
                }
            }
        }
    ];

    async componentDidMount() {
        this.props.rootStore.notificationStore.loadSystemAccess();
    }

    render(){
        const rowSelection = {
            selectedRowKeys:this.props.rootStore.notificationStore.selectedRowKeys.filter(d=>d),
            onChange:this.props.rootStore.notificationStore.onRowChange,
            getCheckboxProps:this.props.rootStore.notificationStore.getCheckboxProps
        };
        return (
            <div>
                <Row>
                    <Col style={{textAlign: 'right', float: 'right'}}>
                        <Button onClick={this.props.rootStore.notificationStore.apply}
                                disabled={this.props.rootStore.notificationStore.selectedRowKeys.filter(d=>d).length===0}>
                            申请选中平台
                        </Button>
                    </Col>
                </Row>

                <Table columns={this.columns}
                       rowKey={record => record.id}
                       dataSource={this.props.rootStore.notificationStore.systemAccess.filter(d => d)}
                       size="small"
                       scroll={{y: 800,}}
                       rowSelection={rowSelection}
                />
            </div>
        );
    }

}

export default ApplyPlatform;