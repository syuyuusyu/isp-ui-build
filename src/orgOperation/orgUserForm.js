import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Form, Input, Row, Col, Button, notification, Table} from 'antd';
import {baseUrl, post} from "../util";

const FormItem = Form.Item;
const Search = Input.Search;

@inject('rootStore')
@observer
class OrgUserForm extends Component {

  columns = [
    {title: '账号', dataIndex: 'user_name', width: 260},
    {title: '用户姓名', dataIndex: 'name', width: 260},
    {title: '电话号码', dataIndex: 'phone', width: 260},
  ];

  componentDidMount() {
    this.props.rootStore.orgOperationStore.getAllUser();
  }


  /*onSelectChange = (selectedRowKeys) => {
    //console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.props.rootStore.orgOperationStore.selectedRowKeys=selectedRowKeys;
    console.log('selectedRowKeys: ', this.props.rootStore.orgOperationStore.selectedRowKeys);
  }*/

  render() {
    const {getFieldDecorator,} = this.props.form;
    const rowSelection = {
      selectedRowKeys: this.props.rootStore.orgOperationStore.selectedRowKeys.filter(d => d),
      onChange: (selectedRowKeys, selectedRows) => {
        this.props.rootStore.orgOperationStore.getSelectedRowKeys(selectedRowKeys);
        ///console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
    };
    return (
      <Form>
        <Row>
          {/*<Col span={2} offset={2} style={{lineHeight: '32px'}}>系统平台:</Col>*/}
          <Search
            placeholder="请输入查询信息"
            onSearch={value => this.props.rootStore.orgOperationStore.getQueryUser(value)}
            enterButton
            style={{width: '70%'}}
          />
        </Row><br/><br/>
        <Table columns={this.columns}
               rowKey={record => record.id + ''}
               dataSource={this.props.rootStore.orgOperationStore.allUser.filter(d => d)}
               rowSelection={rowSelection}
               size="small"
               scroll={{y: 200,}}
        />
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button icon="save" onClick={this.props.rootStore.orgOperationStore.saveOrgUser} size='small'>保存</Button>&nbsp;&nbsp;
            <Button icon="close-circle" onClick={this.props.rootStore.orgOperationStore.closeModal} size='small'>关闭</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(OrgUserForm);

