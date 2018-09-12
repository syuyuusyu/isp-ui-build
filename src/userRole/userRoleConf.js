import React from 'react';
import {Button,Row,Col,Transfer} from 'antd';
import {inject,observer} from 'mobx-react';

@inject('rootStore')
@observer
class UserRoleConf extends React.Component{


    componentDidMount(){
        this.props.rootStore.userRoleStore.loadUserRoleConfRoles();
        this.props.rootStore.userRoleStore.loadCurrentUserRole();
    }



    render(){
        const store=this.props.rootStore.userRoleStore;
        return (
            <div>
            <Transfer
                dataSource={this.props.rootStore.userRoleStore.userRoleConfRoles.filter(d=>d).map(r=>({
                    key:r.id,
                    title:r.code,
                    description:r.description,
                    name:r.name,
                    sname:r.sname
                }))}
                showSearch
                listStyle={{width: 400, height: 310,}}
                titles={['所有角色', '用户关联角色']}
                targetKeys={store.targetKeys.filter(d=>d)}
                selectedKeys={store.selectedKeys.filter(d=>d)}
                onChange={store.handleChange}
                onSelectChange={store.handleSelectChange}
                onScroll={store.handleScroll}
                render={item => `${item.title}-${item.name}-${item.description}`}
            />
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button icon="save" onClick={store.saveUserRole}>保存</Button>
                        <Button icon="reload" onClick={store.handleReset}>重置</Button>

                    </Col>
                </Row>
            </div>
        );
    }
}

export default UserRoleConf;