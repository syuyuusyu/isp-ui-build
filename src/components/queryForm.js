import React from 'react';
import {Form, Row, Col, Input, Button, Select, Modal, Progress, InputNumber, notification} from 'antd';
import {inject, observer} from 'mobx-react';
import {baseUrl, get, post} from "../util";
import '../style.css';

const FormItem = Form.Item;
const Option = Select.Option;


@inject('rootStore')
@observer
class QueryForm extends React.Component {


    componentDidMount() {


    }


    render() {
        const store = this.props.rootStore.entityStore;
        const {getFieldDecorator,} = this.props.form;
        return (
            <div>
                <Form>
                    <Row>
                        <Col span={24} style={{textAlign: 'right'}}>
                            <Button icon="save" onClick={null}>查询</Button>
                            <Button type="reload" onClick={null}>新建</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );

    }
}

export default Form.create()(QueryForm);