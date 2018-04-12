import React from 'react';
import {Row,Col,} from 'antd';
import {inject,observer} from 'mobx-react';

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
                                                    ?<a  target="_blank" href={`${col.url}${col.operations.filter(o=>o.type===1).map(o=>o.path)[0]}?token=${col.token}`} >{col.name}</a>
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
        );
    }
}

export default SysConnect;