import React from 'react';
import {Form, Row, Col, Input, Button, Select, Modal, Progress, InputNumber, notification} from 'antd';
import {inject, observer} from 'mobx-react';
import {baseUrl, get, post} from "../util";
import '../style.css';

const FormItem = Form.Item;
const Option = Select.Option;


@inject('rootStore')
@observer
class EntityForm extends React.Component {

    state={
        parentEntityIdSeleted:false,
        parentEntityIdSeletedMsg:'',
        pidFieldColumns:(function(_this){
            const store = _this.props.rootStore.entityStore;
            if(store.isFormUpdate){
                return store.originalColumns.filter(d => d.table_name===store.currentEntity.tableName);
            }else{
                return [];
            }
        })(this)
    };

    parentEntityIdSeleted=(value)=>{
        const store = this.props.rootStore.entityStore;
        if(value){
            this.setState({
                parentEntityIdSeleted:true,
                parentEntityIdSeletedMsg:'选中父实体ID时该字段必填',
            });
        }else{
            this.setState({
                parentEntityIdSeleted:false,
                parentEntityIdSeletedMsg:'',
            });
        }
    };

    selectTable=(value)=>{
        const store = this.props.rootStore.entityStore;
        let columns=store.originalColumns
            .filter(d=>d.table_name===value );
        if(columns.filter(d=>d.column_key==='PRI').length===1){
            this.props.form.setFieldsValue(
                {idField:columns[0]['column_name']}
            );
            this.setState({pidFieldColumns:columns});
        }else{
            this.props.form.setFieldsValue(
                {idField:null}
            );
            this.setState({pidFieldColumns:[]});
            notification.error({
                message: '实体配置对应的表必须有唯一主键'
            });
        }
    };


    save = () => {
        const store = this.props.rootStore.entityStore;
        this.props.form.validateFields(async (err, values) => {
            if (err) return;
            let json = await post(`${baseUrl}/entity/saveConfig/entity/id`, {
                ...values,
                id: store.currentEntity ? store.currentEntity.id : null,
                queryField:values.queryField.length>0?values.queryField.join(','):null
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
        store.toggleEntityFormVisible();
        store.loadEntitys();
    };

    queryFieldChange=(value)=>{
        console.log(value);
    };

    componentDidMount() {
        const store = this.props.rootStore.entityStore;
        store.loadFilterTableNames();
        store.loadColumns();
        if (store.currentEntity) {
            console.log(store.currentEntity.queryField?store.currentEntity.queryField.split(',').map(c=>parseInt(c)):[]);
            this.props.form.setFieldsValue(
                {
                    ...store.currentEntity,
                    queryField:store.currentEntity.queryField?store.currentEntity.queryField.split(',').map(c=>parseInt(c)):[]
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

                    <FormItem label="表名">
                        {getFieldDecorator('tableName', {
                            rules: [{required: true, message: '表名不能为空',}],
                            validateTrigger: 'onBlur'
                        })(
                            <Select onSelect={this.selectTable} disabled={store.isFormUpdate}>
                                {
                                    store.tableNames.filter(d => d).map(o =>
                                        <Option key={o.tableName} value={o.tableName}>{o.tableName}</Option>)
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="编码">
                        {getFieldDecorator('entityCode', {})(
                            <Input placeholder="编码"/>
                        )}
                    </FormItem>
                    <FormItem label="名称">
                        {getFieldDecorator('entityName')(
                            <Input placeholder="输入表名称"/>
                        )}
                    </FormItem>
                    <FormItem label="名称字段">
                        {getFieldDecorator('nameField', {
                            rules: [{required: true, message: '不能为空',}],
                            validateTrigger: 'onBlur'
                        })(
                            <Select>
                                {
                                    store.currentColumns.filter(d => d).map(o =>
                                        <Option key={o.id} value={o.columnName}>{o.text?o.columnName+'-'+o.text:o.columnName}</Option>)
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="查询字段">
                        {getFieldDecorator('queryField')(
                            <Select mode="multiple" onChange={this.queryFieldChange}>
                                {
                                    store.currentColumns.filter(d => d).map(o =>
                                        <Option key={o.id} value={o.id}>{o.text?o.columnName+'-'+o.text:o.columnName}</Option>)
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="ID字段">
                        {getFieldDecorator('idField',{
                            rules: [{required: true, message: '不能为空',}],
                            validateTrigger: 'onBlur'
                        })(
                            <Input placeholder="输入ID字段" disabled={true}/>
                        )}
                    </FormItem>
                    <FormItem label="父实体表名">
                        {getFieldDecorator('parentEntityId', {

                        })(
                            <Select onSelect={this.parentEntityIdSeleted}>
                                <Option value={null}>&nbsp;</Option>
                                {
                                    store.entitys.filter(d => d).map(o =>
                                        <Option key={o.id} value={o.id}>{o.tableName}</Option>)
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="父实体ID字段">
                        {getFieldDecorator('pidField',{
                            rules: [{required: this.state.parentEntityIdSeleted, message: this.state.parentEntityIdSeletedMsg,}],
                            validateTrigger: 'onBlur'
                        })(
                            <Select disabled={!this.state.parentEntityIdSeleted}>
                                {
                                    this.state.pidFieldColumns.map(o =>
                                        <Option key={o.column_name} value={o.column_name}>{o.column_name}</Option>)
                                }
                            </Select>
                        )}
                    </FormItem>


                    <Row>
                        <Col span={24} style={{textAlign: 'right'}}>
                            <Button icon="save" onClick={this.save}>保存</Button>
                            <Button type="reload" onClick={store.toggleEntityFormVisible}>取消</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );

    }
}

export default Form.create()(EntityForm);