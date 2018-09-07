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

    state={
        idFileds:[]
    };


    save = () => {
        const store = this.props.rootStore.entityStore;
        this.props.form.validateFields(async (err, values) => {
            if (err) return;
            let json = await post(`${baseUrl}/entity/saveConfig/entity_operation/id`, {
                ...values,
                id: store.currentMonyToMony ? store.currentMonyToMony.id : null,
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
        store.toggleMonyToMonyFormVisible();
        store.loadMonyToMonys();
    };

    selectelationTable=(value)=>{
        const store = this.props.rootStore.entityStore;
        let columns=store.originalColumns
            .filter(d=>d.table_name===value && d.column_key!=='PRI');
        this.setState({idFileds:columns});

    };

    componentDidMount() {
        const store = this.props.rootStore.entityStore;
        store.loadTableNames();
        if (store.currentMonyToMony) {
            this.props.form.setFieldsValue(
                {
                    ...store.currentMonyToMony,
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
                    <FormItem label="类所在目录">
                        {getFieldDecorator('pagePath', {
                            rules: [{required: true, message: '不能为空',}],
                            validateTrigger: 'onBlur'
                        })(
                            <Input placeholder="类所在目录"/>
                        )}
                    </FormItem>
                    <FormItem label="页面类名">
                        {getFieldDecorator('pageClass', {
                            rules: [{required: true, message: '不能为空',}],
                            validateTrigger: 'onBlur'
                        })(
                            <Input placeholder="页面类名"/>
                        )}
                    </FormItem>

                    <Row>
                        <Col span={24} style={{textAlign: 'right'}}>
                            <Button icon="save" onClick={this.save}>保存</Button>
                            <Button type="reload" onClick={store}>取消</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );

    }
}

export default Form.create()(OperationForm);