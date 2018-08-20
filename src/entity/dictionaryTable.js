import React from 'react';
import {Table, Row, Col, Divider, notification, Popconfirm, Input, Icon, Button,Form} from 'antd';
import {inject, observer} from 'mobx-react';
import {baseUrl, del, post, get} from '../util';

const FormItem = Form.Item;
const Option = Select.Option;

const DicFormCreated=Form.create()(DicForm);
const DicFieldFormCreated=Form.create()(DicFieldForm);



@inject('rootStore')
@observer
class DictionaryTable extends React.Component {

    columns = [
        {dataIndex: 'groupId', title: '分组ID', width: 50},
        {dataIndex: 'groupName', title: '字典名称', width: 200},
        {
            title: '操作',
            width: 200,
            render: (text, record) => {
                return (
                    <span>
                        <Button icon="edit" onClick={this.props.rootStore.entityStore.showAddDicFieldForm(record,false)} size='small'>新增字段</Button>
                        <Divider type="vertical"/>
                        <Popconfirm onConfirm={null} title="确认删除?">
                            <Button icon="delete" onClick={null} size='small'>删除</Button>
                        </Popconfirm>
                    </span>
                )
            }
        }
    ];

    expandedRowRender=(record)=>{
        return (
            <DictionaryFieldTable group={record}/>
        );
    };

    render() {
        const store = this.props.rootStore.entityStore;
        return (
            <div>
                <Row gutter={2} className="table-head-row">
                    <Col span={4} style={{ textAlign: 'right' }} className="col-button">
                        <Button icon="plus-circle-o" onClick={null}>新建字典</Button>
                    </Col>
                </Row>
                <Modal visible={store.addDicVisible}
                       width={300}
                       title="字典"
                       footer={null}
                       onCancel={store.toggleAddDicVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <DicFormCreated/>
                </Modal>
                <Modal visible={store.addDicFieldVisible}
                       width={300}
                       title="字典字段"
                       footer={null}
                       onCancel={store.toggleAddDicFieldVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <DicFieldFormCreated/>
                </Modal>
                <Table columns={this.columns}
                       rowKey={record => record.id}
                       dataSource={store.allDictionary.filter(d => d)}
                       rowSelection={null}
                       size="small"
                       scroll={{y: 500}}
                       bordered={true}
                       pagination={true}
                       expandedRowRender={this.expandedRowRender}
                />
            </div>
        );
    }
}

@inject('rootStore')
@observer
class DicForm extends React.Component{

    componentDidMount(){
        const store=this.props.rootStore.entityStore;
        if (store.selectDic) {
            this.props.form.setFieldsValue(
                {groupName:store.selectDic.groupName}
            );
        }
    }

    save(){
        const store = this.props.rootStore.entityStore;
        this.props.form.validateFields(async (err, values) => {
            if (err) return;
            let json = await post(`${baseUrl}/entity/saveDic`, {
                groupId:store.selectDic?store.selectDic.groupId:null,
                groupName:values.groupName
            });
            if (json.success) {
                notification.info({
                    message: '保存成功'
                });
            } else {
                notification.error({
                    message: '保存失败'
                });
            }
            store.loadallDictionary();
        });
    }

    render(){
        const store=this.props.rootStore.entityStore;
        const {getFieldDecorator,} = this.props.form;
        return (
            <div>
                <Form>
                    <Row gutter={24}>
                        <Col span={6}>
                            <FormItem label="字典名称">
                                {getFieldDecorator('groupName', {
                                    rules: [{required: true, message: '不能为空',}],
                                })(
                                    <Input placeholder="输入字典名称"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{textAlign: 'right'}}>
                            <Button icon="save" onClick={this.save}>保存</Button>
                            <Button type="reload" onClick={store.toggleAddDicVisible}>取消</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );

    }
}

@inject('rootStore')
@observer
class DicFieldForm extends React.Component{

    componentDidMount(){
        const store=this.props.rootStore.entityStore;
        if (store.selectDicField) {
            this.props.form.setFieldsValue(
                {
                    text:store.selectDicField.text,
                    value:store.selectDicField.value,
                }
            );
        }
    }

    save(){
        const store = this.props.rootStore.entityStore;
        this.props.form.validateFields(async (err, values) => {
            if (err) return;
            let json = await post(`${baseUrl}/entity/saveDic`, {
                groupId:store.selectDic?store.selectDic.groupId:null,
                groupName:values.groupName
            });
            if (json.success) {
                notification.info({
                    message: '保存成功'
                });
            } else {
                notification.error({
                    message: '保存失败'
                });
            }
            store.loadallDictionary();
        });
    }

    render(){
        const store=this.props.rootStore.entityStore;
        const {getFieldDecorator,} = this.props.form;
        return (
            <div>
                <Form>
                    <Row gutter={24}>
                        <Col span={12}>
                            <FormItem label="字典字段">
                                {getFieldDecorator('text', {
                                    rules: [{required: true, message: '不能为空',}],
                                })(
                                    <Input placeholder="输入字段"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="字典值">
                                {getFieldDecorator('value', {
                                    rules: [{required: true, message: '不能为空',}],
                                })(
                                    <Input placeholder="输入值"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{textAlign: 'right'}}>
                            <Button icon="save" onClick={this.save}>保存</Button>
                            <Button type="reload" onClick={store.toggleAddDicVisible}>取消</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );

    }
}

class DictionaryFieldTable extends React.Component {

    columns = [
        {dataIndex: 'text', title: '字段名称', width: 150},
        {dataIndex: 'value', title: '值', width: 100},
        {
            title: '操作',
            width: 150,
            render: (text, record) => {
                return (
                    <span>
                        <Button icon="edit" onClick={null} size='small'>修改</Button>
                        <Divider type="vertical"/>
                        <Popconfirm onConfirm={null} title="确认删除?">
                            <Button icon="delete" onClick={null} size='small'>删除</Button>
                        </Popconfirm>
                    </span>
                )
            }
        }
    ];

    state = {
        currentFields: []
    };

    async componentDidMount(){
        let json=await get(`${baseUrl}/entity/dictionary/${this.props.group.groupId}`);
        this.setState({currentFields:json});
    }

    render() {
        return (
            <Table columns={this.columns}
                   rowKey={record => record.id}
                   dataSource={this.state.currentFields}
                   rowSelection={null}
                   size="small"
                   scroll={{y: 800}}
                   bordered={true}
                   pagination={false}
            />
        );
    }

}


export default DictionaryTable;