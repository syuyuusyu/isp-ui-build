import React from 'react';
import {Button,Row,Col,Transfer} from 'antd';
import {inject,observer} from 'mobx-react';

@inject('rootStore')
@observer
class InvokePromiss extends React.Component{

    componentDidMount(){
        this.props.rootStore.invokeOpStore.initAllsystem();
        this.props.rootStore.invokeOpStore.loadCurrentInvokePromiss();
    }


    render(){
        const store=this.props.rootStore.invokeOpStore;
        return (
            <div>
                <Transfer
                    dataSource={store.allSystem.filter(d=>d).filter(d=>d.code!==store.currentSys.code).map(r=>({
                        key:r.id,
                        title:r.name,
                        code:r.code
                    }))}
                    showSearch
                    listStyle={{width: 300, height: 310,}}
                    titles={['所有系统平台', '有权访问该接口的平台']}
                    targetKeys={store.targetKeys.filter(d=>d)}
                    selectedKeys={store.selectedKeys.filter(d=>d)}
                    onChange={store.handleChange}
                    onSelectChange={store.handleSelectChange}
                    onScroll={store.handleScroll}
                    render={item => `${item.code}-${item.title}`}
                />
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button icon="save" onClick={store.saveInvokePromiss}>保存</Button>
                        <Button icon="reload" onClick={store.handleReset}>重置</Button>

                    </Col>
                </Row>
            </div>
        );
    }
}

export default InvokePromiss;