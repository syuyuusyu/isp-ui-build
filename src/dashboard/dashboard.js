import React from 'react';
import {Row,Col,Icon,Spin} from 'antd';
import {inject,observer} from 'mobx-react';
import CloudTopology from './cloudTopology';
import UserSourceMsg from './UserSourceMsg';
import CloudSource from './CloudSource';
import SysMsg from './SysMsg';
import CpuInfo from './CpuInfo';


const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;


@inject('rootStore')
@observer
class DashBoard extends React.Component{

     componentDidMount(){
        const store=this.props.rootStore.dashBoardStore;
        store.loadDashboardData();

    }

    render(){
        const store=this.props.rootStore.dashBoardStore;
        return (
            <div>
                <Spin indicator={antIcon} tip={store.loadingText} spinning={store.onLoading}>
                <Row gutter={24}>
                    <Col span={12} style={{height:300}} >
                        <CloudSource/>
                    </Col>
                    <Col span={12} style={{height:300}} >
                        <UserSourceMsg/>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={16} style={{height:300}} >
                        <CloudTopology/>
                    </Col>
                    <Col span={8} style={{height:300}} >
                        <SysMsg/>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24} style={{height:300}} >
                        <CpuInfo/>
                    </Col>
                </Row>

                </Spin>
            </div>
        );
    }

}

export default DashBoard;