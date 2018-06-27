import React from 'react';
import {Form, Row, Col, Button, notification, Select, Spin, Icon, Input} from 'antd';
import {inject, observer} from 'mobx-react';
import {baseUrl, post} from '../util';

const Option = Select.Option;
const FormItem = Form.Item;
const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;


@inject('rootStore')
@observer
class CloudFrom extends React.Component {

  componentDidMount() {
    this.props.rootStore.cloudStore.loadFormInput();
    this.props.rootStore.cloudStore.loadKeyPairs();
    this.props.rootStore.cloudStore.getS02Url();
  }

  save = () => {
    const store = this.props.rootStore.cloudStore;
    this.props.form.validateFields(async (err, values) => {
      if (err) return;
      if(store.flavorId===''){
        return notification.error({
          message:'请选择虚拟机类型'});
      }else if(store.networkId===''){
         return notification.error({
          message:'请选择网络类型'});
      }else if(store.imageId===''){
        return notification.error({
          message:'请选择镜像类型'});
      }
      let json = await post(`${baseUrl}/invoke/cloud_create`, {
        keypairName:store.selectKeyPairValue,
        flavorId: store.flavorId,
        name: values.virtualMachineName,
        networkId: store.networkId,
        imageId: store.imageId
      });
      if(json.code===200){
        notification.success({
          message:'新建成功'})
        this.props.history.push('/cloudapply');
      }else{
        notification.error({
          message:'失败,请联系管理员'});
      }
      store.loadServerInfo();
    });
  };

  /*save=()=>{
      this.props.form.validateFields(async (err,values)=>{
          if(err) return;
          let json=await post(`${baseUrl}/invoke/cloud_create`,{
              flavorId:values.flavorId,
              name:values.name,
              networkId:values.networkId,
              imageId:values.imageId
          });
          if(json.code===200){
              notification.success({
                  message:'新建成功'})
          }else{
              notification.error({
                  message:'失败,请联系管理员'});
          }
          this.props.rootStore.cloudStore.toggleFormVisible();
          this.props.rootStore.cloudStore.loadServerInfo();

      })
  };*/

  render() {
    const store = this.props.rootStore.cloudStore;
    const {getFieldDecorator,} = this.props.form;
    const treeStore = this.props.rootStore.treeStore;
    const { winWidth, winHeight, headerHeight, menuHeight, footerHeight } = treeStore;
    return (
      <div id="contentBox" style={{ width: winWidth - 32, height: winHeight - headerHeight - menuHeight - footerHeight - 16 }}>
        <Spin indicator={antIcon} tip={store.loadingtest} spinning={store.loading}>
            <br/><br/>
          <Form style={{display:store.keyPairsDisplay}}>
            <p style={{fontSize: '16px'}}>请选择密钥:</p>
            <Select className="col-input" onChange={store.selectKeyPairs} style={{width:'300px'}}>
              {store.keyPairs.filter(d=>d).map(s=>
                <Option key={s.publicKey} value={s.name}>{s.name}</Option>
              )}
            </Select>
          </Form>
            <br/><br/>
            <Form style={{display:store.formDisplay}}>
              <p style={{fontSize: '16px'}}>请选择虚拟机类型:</p>
              {store.flavors.filter(d => d).map(a => {
                return (
                  <Button key={a.id} title={'内存大小:' + a.ram + 'M' + ' 虚拟cpu数:' + a.vcpus + ' 磁盘大小:' + a.disk + 'G'} size="large"
                          style={{backgroundColor: store.flavorsColor[a.id], fontWeight: 'bold'}} onClick={() => {
                    store.onClickFlavors(a.id)
                  }}>{a.name}</Button>
                );
              })}
            </Form>
            <br/><br/>
            <Form style={{display:store.formDisplay}}>
            <p style={{fontSize: '16px'}}>请选择网络类型:</p>
            {store.networks.filter(d => d).map(b => {
              return (
                <Button key={b.id} title={'网段地址:' + b.neutronSubnets[0].cidr} size="large"
                        style={{backgroundColor: store.networksColor[b.id], fontWeight: 'bold'}} onClick={() => {
                  store.onClickNetworks(b.id)
                }}>{b.name}</Button>
              );
            })}
            </Form>
            <br/><br/>
            <Form style={{display:store.formDisplay}}>
            <p style={{fontSize: '16px'}}>请选择镜像类型:</p>
            {store.images.filter(d => d).map(c => {
              return (
                <Button key={c.id} size="large" style={{backgroundColor: store.imagesColor[c.id], fontWeight: 'bold'}}
                        onClick={() => {
                          store.onClickImages(c.id)
                        }}>{c.name}</Button>
              );
            })}
            </Form>
         <br/>
          <Form style={{display:store.formDisplay}}>
            <Row>
              <FormItem label="虚拟机名称">
                {getFieldDecorator('virtualMachineName', {
                  rules: [{required: true, message: '必填'}],
                })(
                  <Input placeholder='输入虚拟机名称'/>
                )}
              </FormItem>
            </Row>
          </Form>
          <Button icon="save" onClick={this.save} style={{display:store.formDisplay}}>保存</Button>&nbsp;&nbsp;
          <Button icon="reload" href="/cloudapply" style={{display:store.formDisplay}}>返回</Button>
          {/* <br/><br/>
                  <p style={{fontSize:'16px'}}>请输入虚拟机名称:</p>
                  <input style={{fontSize:'16px'}} placeholder='请输入虚拟机名称'onChange={this.onChange} />*/}

          {/*<Form>
                  <br/>
                    <Row>
                        <FormItem label="虚拟机名称">
                            {getFieldDecorator('name',{
                                rules: [{ required: true, message: '必填' }],
                            })(
                               <Input placeholder='输入虚拟机名称'/>
                            )}
                        </FormItem>
                        <FormItem label="虚拟机类型">
                            {getFieldDecorator('flavorId',{
                                rules: [{ required: true, message: '必填' }],
                            })(
                                <Select>
                                    {
                                        store.flavors.filter(d=>d).map(d=>
                                            <Option key={d.id}>{d.name}</Option>
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="网络">
                            {getFieldDecorator('networkId',{
                                rules: [{ required: true, message: '必填' }],
                            })(
                                <Select>
                                    {
                                        store.networks.filter(d=>d).map(d=>
                                            <Option key={d.id}>{d.name}</Option>
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="镜像">
                            {getFieldDecorator('imageId',{
                                rules: [{ required: true, message: '必填' }],
                            })(
                                <Select>
                                    {
                                        store.images.filter(d=>d).map(d=>
                                            <Option key={d.id}>{d.name}</Option>
                                        )
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button icon="save" onClick={this.save}>保存</Button>
                        </Col>
                    </Row>
                </Form>*/}
        </Spin>
      </div>
    );
  }
}


export default Form.create()(CloudFrom);
