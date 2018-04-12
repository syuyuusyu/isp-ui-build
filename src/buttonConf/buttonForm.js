import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Form, Input, Row, Col, Button, notification, Select, Icon} from 'antd';
import {baseUrl} from "../util";

const FormItem = Form.Item;
//const {TextArea}=Input;
const Option = Select.Option;

@inject('rootStore')
@observer
class ButtonForm extends Component {

    componentDidMount() {
        const store = this.props.rootStore.buttonStore;
        this.props.form.setFieldsValue({
            size: 'default',
        });
        if (store.selectedButton) {
            this.props.form.setFieldsValue({
                icon: store.selectedButton.icon,
                text: store.selectedButton.text,
                size: store.selectedButton.size,
                color: store.selectedButton.color,
                info: store.selectedButton.info,
            });
        }
    }

    save = () => {
        const store = this.props.rootStore.buttonStore;
        this.props.form.validateFields(async (err, values) => {
            if (err) return;
            values.menu_id = store.currentMenuId;
            values.menu_name = store.currentMenuName;
            if (store.selectedButton) {
                values.id = store.selectedButton.id;
            }
            let response = await fetch(`${baseUrl}/btn/save`, {
                    method: 'POST',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Access-Token': sessionStorage.getItem('access-token') || '' // 从sessionStorage中获取access token
                    }),
                    body: JSON.stringify(values),
                }
            );
            let json = await response.json();
            if (json.success) {
                notification.success({
                    message: '保存成功',
                })
            } else {
                notification.error({
                    message: '后台错误，请联系管理员',
                })
            }
            store.toggleButtonFormVisible();
            store.loadCurrentMenuButton();
            this.props.rootStore.authorityStore.loadAllbuttons();
        })
    };

    render() {
        const {getFieldDecorator,} = this.props.form;
        return (
            <Form>
                <Row>
                    <FormItem label="图标">
                        {getFieldDecorator('icon', {})(
                            <Select>
                                {
                                    this.props.rootStore.buttonStore.iconType.map((i, index) =>
                                        <Option key={index} value={i}><Icon type={i}/>&nbsp;&nbsp;
                                            <span>{i}</span></Option>)
                                }
                            </Select>
                        )}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="按钮文字">
                        {getFieldDecorator('text', {
                            rules: [{required: true, message: '此项为必填项!!'}],
                        })(
                            <Input placeholder="输入按钮文字"/>
                        )}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="大小">
                        {getFieldDecorator('size', {})(
                            <Select>
                                <Option key={1} value="large">大</Option>
                                <Option key={2} value="default">中</Option>
                                <Option key={3} value="small">小</Option>
                            </Select>
                        )}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="颜色">
                        {getFieldDecorator('color', {})(
                            <Input placeholder="输入颜色"/>
                        )}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="描述信息">
                        {getFieldDecorator('info', {})(
                            <Input placeholder="输入调用名称"/>
                        )}
                    </FormItem>
                </Row>
                <Row>
                    <Col span={24} style={{textAlign: 'right'}}>
                        <Button icon="save" onClick={this.save}>保存</Button>
                        <Button icon="reload" onClick={this.handleReset}>重置</Button>

                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(ButtonForm);
