import React from 'react';
import {Form, Row, Col, Input, Button, Select, Modal, Progress, InputNumber, notification} from 'antd';
import {inject, observer} from 'mobx-react';
import {baseUrl, get, post} from "../util";
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/ambiance.css';
import '../style.css';

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;


//id,entityId,entityName,
// columnIndex, code, columnType, columnName,
// text, width,\ render, hidden, dicGroupId
@inject('rootStore')
@observer
class ColumnForm extends React.Component {

    funMirrValue;

    state={
        foreignColumns:[]
    };

    foreignEntitySelected=async (entityId)=>{
        let json=await get(`${baseUrl}/entity/columns/${entityId}`);
        this.setState({foreignColumns:json});
    };


    checkUnique = (key) => ((rule, value, callback) => {
        const store = this.props.rootStore.entityStore;
        if (store.currentColumns.filter(d => d).filter((o) => o[key] == value).length > 0 && !store.isFormUpdate) {
            callback(new Error());
        } else {
            callback();
        }
    });

    save = () => {
        const store = this.props.rootStore.entityStore;
        this.props.form.validateFields(async (err, values) => {
            if (err) return;
            let json = await post(`${baseUrl}/entity/saveColumn`, {
                ...values,
                render: this.funMirrValue,
                entityId: store.currentEntity.id,
                id: store.currentColumn ? store.currentColumn.id : null,
                entityName: store.currentEntity.tableName
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
            store.toggleColumnFormVisible();
            store.loadColumns();
        });
    };

    componentDidMount() {
        const store = this.props.rootStore.entityStore;
        if (store.currentColumn) {
            this.props.form.setFieldsValue(
                store.currentColumn
            );
        }
    }


    render() {
        const store = this.props.rootStore.entityStore;
        const {getFieldDecorator,} = this.props.form;
        return (
            <div>
                <Form>
                    <Row gutter={24}>
                        <Col span={6}>
                            <FormItem label="排序">
                                {getFieldDecorator('columnIndex', {
                                    rules: [{validator: this.checkUnique('columnIndex'), message: '不能和现有字段重复',}],
                                    validateTrigger: 'onBlur'
                                })(
                                    <InputNumber style={{width: '100%'}} placeholder="输入排序"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="编码">
                                {getFieldDecorator('code', {
                                    rules: [{validator: this.checkUnique('code'), message: '不能和现有字段重复',}],
                                    validateTrigger: 'onBlur'
                                })(
                                    <Input placeholder="编码"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="数据类型">
                                {getFieldDecorator('columnType')(
                                    <Input placeholder="输入数据类型"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="是否隐藏">
                                {getFieldDecorator('hidden', {
                                    initialValue: '0'
                                })(
                                    <Select>
                                        <Option value="0">显示</Option>
                                        <Option value="1">隐藏</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={6}>
                            <FormItem label="列名">
                                {getFieldDecorator('columnName', {
                                    rules: [{
                                        validator: this.checkUnique('columnName'),
                                        message: '不能和现有字段重复',
                                        required: true
                                    }],
                                    validateTrigger: 'onBlur'
                                })(
                                    <Input placeholder="输入列名"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="中文名">
                                {getFieldDecorator('text', {
                                    rules: [{
                                        validator: this.checkUnique('text'),
                                        message: '不能和现有字段重复',
                                        required: true
                                    }],
                                    validateTrigger: 'onBlur'
                                })(
                                    <Input placeholder="中文名"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="渲染宽度">
                                {getFieldDecorator('width')(
                                    <InputNumber style={{width: '100%'}} placeholder="输入渲染宽度"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="关联字典">
                                {getFieldDecorator('dicGroupId', {})(
                                    <Select>
                                        <Option value={null}>&nbsp;</Option>
                                        {
                                            store.allDictionary.map(o =>
                                                <Option key={o.groupId} value={o.groupId}>{o.groupName}</Option>)
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={6}>
                            <FormItem label="外键对应实体">
                                <Select onSelect={this.foreignEntitySelected}>
                                    <Option value={null}>&nbsp;</Option>
                                    {
                                        store.entitys.filter(d=>d).map(o =>
                                            <Option key={o.id} value={o.id}>{o.entityName}</Option>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="外键对应实体ID字段">
                                {getFieldDecorator('foreignKeyId')(
                                    <Select>
                                        <Option value={null}>&nbsp;</Option>
                                        {
                                            this.state.foreignColumns.map(o =>
                                                <Option key={o.id} value={o.id}>{o.text?o.text:o.columnName}</Option>)
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem label="外键对应实体名称字段">
                                {getFieldDecorator('foreignKeyNameId')(
                                    <Select>
                                        <Option value={null}>&nbsp;</Option>
                                        {
                                            this.state.foreignColumns.map(o =>
                                                <Option key={o.id} value={o.id}>{o.text?o.text:o.columnName}</Option>)
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <div>
                                <div style={{marginBottom: '5px', marginTop: '10px'}}>渲染函数</div>
                                <CodeMirror
                                    ref="editorFun"
                                    value={store.currentColumn ? store.currentColumn.render : ''}
                                    options={
                                        {
                                            mode: 'javascript',
                                            theme: 'material',
                                            lineNumbers: true,
                                            extraKeys: {"Ctrl": "autocomplete"},
                                        }
                                    }
                                    onChange={(editor, data, value) => {
                                        this.funMirrValue = value;
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{textAlign: 'right'}}>
                            <Button icon="save" onClick={this.save}>保存</Button>
                            <Button type="reload" onClick={store.toggleColumnFormVisible}>取消</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );

    }
}

export default Form.create()(ColumnForm);