import React from 'react';
import {Form, Row, Col, Button, notification, Select, Spin, Icon, Input,Modal} from 'antd';
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
      console.log("json的值为:",json);
      if(json.code===200){
        notification.success({
          message:'新建成功'})
        this.props.history.push('/cloudapply');
      }else{
        Modal.error({title: '新建失败',content:`失败信息为：${json.msg}`})
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
        <div className="cloud-box" >
          <Spin indicator={antIcon} tip={store.loadingtest} spinning={store.loading}>
            <br/>
            <Form style={{display:store.keyPairsDisplay}}>
              <p style={{fontSize: '16px'}}>请选择密钥:</p>
              <Select className="col-input" onChange={store.selectKeyPairs} >
                {store.keyPairs.filter(d=>d).map(s=>
                  <Option key={s.publicKey} value={s.name}>{s.name}</Option>
                )}
              </Select>
            </Form>
            <hr className="dotted01" style={{display:store.formDisplay}}/>
            <Form style={{display:store.formDisplay}}>
              <p style={{fontSize: '16px'}}>请选择虚拟机类型:</p>
              <p>C代表虚拟cpu数量，第一个G代表内存大小，第二个G代表磁盘大小</p>
              {store.flavors.filter(d => d).map(a => {
                return (
                  <Button className="cloudselect-button" key={a.id} title={'内存大小:' + a.ram + 'M' + ' 虚拟cpu数:' + a.vcpus + ' 磁盘大小:' + a.disk + 'G'} size="large"
                          style={{backgroundColor: store.flavorsColor[a.id],border:store.flavorsBorder[a.id],color:store.flavorsFontColor[a.id]}} onClick={() => {
                    store.onClickFlavors(a.id)
                  }}>{a.name}</Button>
                );
              })}
            </Form>
            <hr style={{display:store.formDisplay}}/>
            <Form style={{display:store.formDisplay}}>
              <p style={{fontSize: '16px'}}>请选择网络类型:</p>
              {store.networks.filter(d => d).map(b => {
                return (
                  <Button className="cloudselect-button" key={b.id} title={'网段地址:' + b.neutronSubnets[0].cidr} size="large"
                          style={{backgroundColor: store.networksColor[b.id],border:store.networksBorder[b.id],color:store.networksFontColor[b.id]}} onClick={() => {
                    store.onClickNetworks(b.id)
                  }}>{b.name}</Button>
                );
              })}
            </Form>
            <hr style={{display:store.formDisplay}}/>
            <Form style={{display:store.formDisplay}}>
              <p style={{fontSize: '16px'}}>请选择镜像类型:</p>
              {store.images.filter(d => d).map(c => {
                return (
                  <Button className="cloudselect-button" key={c.id} size="large" style={{backgroundColor: store.imagesColor[c.id],border:store.imagesBorder[c.id],color:store.imagesFontColor[c.id]}}
                          onClick={() => {
                            store.onClickImages(c.id)
                          }}>{c.name}</Button>
                );
              })}
            </Form>
            <hr style={{display:store.formDisplay}}/>
            <Form style={{display:store.formDisplay}}>
              <Row>
                <FormItem label="虚拟机名称" className="machine-input">
                  {getFieldDecorator('virtualMachineName', {
                    rules: [{required: true, message: '必填'}],
                  })(
                    <Input placeholder='输入虚拟机名称'/>
                  )}
                </FormItem>
              </Row>
            </Form>

            <div className="cloud-button">
              <Button icon="save" onClick={this.save} type="primary" htmlType="submit" style={{display:store.formDisplay}}>保存</Button>
              <Button icon="reload" href="/cloudapply" style={{display:store.formDisplay}}>返回</Button>
            </div>

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

      </div>
    );
  }
}


export default Form.create()(CloudFrom);
