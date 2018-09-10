import React from 'react';
import {Form, Row, Col, Input, Button, Select, Modal, Progress, InputNumber, notification} from 'antd';
import {inject, observer} from 'mobx-react';
import {baseUrl, get, post} from "../util";
import '../style.css';

const FormItem = Form.Item;
const Option = Select.Option;


@inject('rootStore')
@observer
class OperationForm extends React.Component {

    state={type:'1'};

    save = () => {
        const store = this.props.rootStore.entityStore;
        this.props.form.validateFields(async (err, values) => {
            if (err) return;
            let json = await post(`${baseUrl}/entity/saveConfig/entity_operation/id`, {
                ...values,
                id: store.currentOperation ? store.currentOperation.id : null,
                entityId:store.currentEntity.id
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

        });
        store.toggleOperationFormVisible();
        store.loadEntityOperations();
    };

    typeSelect=(value)=>{
        this.setState({type:value});
    };


    componentDidMount() {
        const store = this.props.rootStore.entityStore;
        if (store.currentOperation) {
            this.props.form.setFieldsValue(
                {
                    ...store.currentOperation,
                }

            );
        }

    }


    render() {
        const store = this.props.rootStore.entityStore;
        const {getFieldDecorator,} = this.props.form;
        return (
            <div>
                <Form>
                    <FormItem label="操作名称">
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: '不能为空',}],
                            validateTrigger: 'onBlur'
                        })(
                            <Input placeholder="关系名称"/>
                        )}
                    </FormItem>
                    <FormItem label="图标">
                        {getFieldDecorator('icon', {

                        })(
                            <Input placeholder="图标"/>
                        )}
                    </FormItem>
                    <FormItem label="类型">
                        {getFieldDecorator('type', {
                            rules: [{required: true, message: '不能为空',}],
                            validateTrigger: 'onBlur'
                        })(
                            <Select onSelect={this.typeSelect}>
                                <Option value={'1'}>关联关系</Option>
                                <Option value={'2'}>自定义</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="关系名称">
                        {getFieldDecorator('monyToMonyId', {
                            rules: [{required: this.state.type=='1'?true:false, message: '不能为空',}],
                            validateTrigger: 'onBlur'
                        })(
                            <Select disabled={this.state.type=='1'?false:true}>
                                {
                                    store.monyToMonys
                                        .filter(m=>m.firstTable===store.currentEntity.tableName
                                            || m.secondTable===store.currentEntity.tableName)
                                        .map(m=>(
                                            <Option key={m.id} value={m.id}>{m.name}</Option>
                                        ))
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="类所在目录">
                        {getFieldDecorator('pagePath', {
                            rules: [{required: this.state.type=='1'?false:true, message: '不能为空',}],
                            validateTrigger: 'onBlur'
                        })(
                            <Input disabled={this.state.type=='1'?true:false} placeholder="类所在目录"/>
                        )}
                    </FormItem>
                    <FormItem label="页面类名">
                        {getFieldDecorator('pageClass', {
                            rules: [{required: this.state.type=='1'?false:true, message: '不能为空',}],
                            validateTrigger: 'onBlur'
                        })(
                            <Input disabled={this.state.type=='1'?true:false} placeholder="页面类名"/>
                        )}
                    </FormItem>


                    <Row>
                        <Col span={24} style={{textAlign: 'right'}}>
                            <Button icon="save" onClick={this.save}>保存</Button>
                            <Button type="reload" onClick={store.toggleOperationFormVisible}>取消</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );

    }
}

export default Form.create()(OperationForm);