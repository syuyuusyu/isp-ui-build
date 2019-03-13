import React from 'react';
import {Row,Col,} from 'antd';
import {inject,observer} from 'mobx-react';
import {DashBoard} from '../dashboard';

@inject('rootStore')
@observer
class SysConnect extends React.Component{

    componentDidMount(){
        this.props.rootStore.treeStore.loadCurrentRoleSys();
        //this.props.rootStore.treeStore.setMartix()
    }

    render(){
        const store=this.props.rootStore.treeStore;
        return (
            <div>
                <div style={{height:200}}>
                    {
                        store.sysMartix.filter(d=>d).map((row,index)=>{
                            return (
                                <Row gutter={16} key={index}>
                                    {
                                        row.filter(d=>d).map(col=>{
                                            return (
                                                <Col span={4} key={col.id}>
                                                    {
                                                        col.operations.filter(o=>o.type===1).length>0
                                                        ?<a  target="_blank" href={`${col.url}${col.operations.filter(o=>o.type===1).map(o=>o.path)[0]}?ispToken=${col.token}`} >{col.name}</a>
                                                        :col.name
                                                    }

                                                </Col>
                                            );
                                        })
                                    }
                                </Row>
                            )
                        })
                    }
                </div>
                <div>
                    {
                        !this.props.rootStore.notificationStore.systemAccess.filter(d=>d).length>0?'':
                            (this.props.rootStore.notificationStore.systemAccess.filter(d=>d.id===2)[0].count>0?
                                    <DashBoard/>
                                    :''
                            )

                    }
                </div>
            </div>
        );
    }
}

export default SysConnect;