import React from 'react';
import {Button,Row,Col,Transfer} from 'antd';
import {inject,observer} from 'mobx-react';

@inject('rootStore')
@observer
class ButtonRoleConf extends React.Component{

    componentDidMount(){
        this.props.rootStore.buttonStore.loadAllRoles();
        this.props.rootStore.userRoleStore.loadCurrentButtonRole();
    }



    render(){
        const store=this.props.rootStore.userRoleStore;
        return (
            <div>
                <Transfer
                    dataSource={this.props.rootStore.buttonStore.allRoles.filter(d=>d).map(r=>({
                        key:r.id,
                        title:r.code,
                        description:r.description,
                        name:r.name,
                        sname:r.sname
                    }))}
                    showSearch
                    listStyle={{width: 400, height: 310,}}
                    titles={['所有角色', '可以使用此按钮的角色']}
                    targetKeys={store.targetKeys.filter(d=>d)}
                    selectedKeys={store.selectedKeys.filter(d=>d)}
                    onChange={store.handleChange}
                    onSelectChange={store.handleSelectChange}
                    onScroll={store.handleScroll}
                    render={item => `${item.sname}-${item.title}-${item.name}-${item.description}`}
                />
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button icon="save" onClick={store.saveButtonRole}>保存</Button>
                        <Button icon="reload" onClick={store.handleReset}>重置</Button>

                    </Col>
                </Row>
            </div>
        );
    }
}

export default ButtonRoleConf;