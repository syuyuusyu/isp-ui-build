import React from 'react';
import {Table, Button, Divider, Popconfirm, Modal, Icon, Spin, Row, Col, Progress} from 'antd';
import {inject, observer} from 'mobx-react';
import CreateForm from './createForm';
import FileForm from './fileForm';
import '../style.css';
import {convertGiga} from "../util";
import DargTable from './dargTable';

const ButtonGroup = Button.Group;
//const Option = Select.Option;
const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;

@inject('rootStore')
@observer
class SwiftTable extends React.Component {

    timeoutid = 0;

    componentDidMount() {
        //this.props.rootStore.swiftStore.scheduleToken();
        if (this.props.match.path.endsWith('self')) {
            this.props.rootStore.swiftStore.username = JSON.parse(sessionStorage.getItem("user")).user_name;
            this.props.rootStore.swiftStore.isSelf = true;
        } else {
            this.props.rootStore.swiftStore.username = this.props.match.path.replace('/swift/', '');
            this.props.rootStore.swiftStore.isSelf = false;
        }
        this.props.rootStore.swiftStore.checkContainer();
        this.timeoutid = setInterval(
            this.props.rootStore.swiftStore.scheduleToken,
            1000 * 60 * 20
        )

    }

    componentWillUnmount() {
        clearInterval(this.timeoutid);
    }

    columns = [
        {
            dataIndex: 'filename', title: '文件名称', width: 250,

        },
        {
            dataIndex: 'bytes', title: '大小', width: 50,
            render: (text) => {
                const result = convertGiga(text)
                return result.number + result.unit;
                // return `${(text/1024/1024).toFixed(2)}M`
            }
        },
        {
            dataIndex: 'content_type', title: '类型', width: 50,
            render: (text, record) => {
                if (/\/$/.test(record.name)) {
                    return '文件夹';
                } else {
                    return '文件';
                }
            }
        },
        {
            title: '操作',
            width: 250,
            render: (text, record) => {
                //if(record.isRoot) return;
                if (/\/$/.test(record.name)) {
                    return (
                        <span>
                            <Button icon="folder-add"
                                    onClick={this.props.rootStore.swiftStore.showForm(record, '新建文件夹')}
                                    size='small'>新建文件夹</Button>
                            <Divider type="vertical"/>
                            <Button icon="upload" onClick={this.props.rootStore.swiftStore.showFileForm(record, '上传文件')}
                                    size='small'>上传文件</Button>
                            <span>
                                <Divider type="vertical"/>
                                <Popconfirm onConfirm={this.props.rootStore.swiftStore.delete(record)} title="确认删除?">
                                    <Button disabled={record.children ? true : false} icon="delete" onClick={null}
                                            size='small'>删除当前文件夹</Button>
                                </Popconfirm>
                            </span>
                        </span>
                    );
                } else {
                    return (
                        <span>
                            <Button icon="download" onClick={this.props.rootStore.swiftStore.download(record)}
                                    size='small'>下载文件</Button>
                            <Divider type="vertical"/>
                            <Popconfirm onConfirm={this.props.rootStore.swiftStore.delete(record)} title="确认删除?">
                                <Button icon="delete" size='small'>删除文件</Button>
                            </Popconfirm>
                        </span>
                    );
                }
            }
        }
    ];

    format = (p) => {
        return `${p}% `;
    };

    moveRow = (dragIndex, hoverIndex) => {
        console.log(dragIndex, hoverIndex);
    };

    render() {
        const store = this.props.rootStore.swiftStore;
        let n = convertGiga(this.props.rootStore.swiftStore.total);
        if (!store.hasContainer) {
            return (
                <Spin indicator={antIcon} tip={store.loadingtest} spinning={store.inDowning}>
                    <div><Button onClick={store.launch} icon="profile" size='large'>点击开通网盘</Button></div>
                </Spin>
            );
        }
        return (
            <div>
                <Spin indicator={antIcon} tip={store.loadingtest} spinning={store.inDowning} ref={store.refSpin}>
                    <Modal visible={store.formVisible}
                           width={400}
                           title={`新建文件夹 当前路径:${store.selectRow.name}`}
                           footer={null}
                           onCancel={store.toggleFormVisible}
                           maskClosable={false}
                           destroyOnClose={true}
                           key="1"
                    >
                        <CreateForm/>
                    </Modal>
                    <Modal visible={store.fileFormVisible}
                           width={500}
                           title={`上传文件 当前路径:${store.selectRow.name}`}
                           footer={[
                               <Popconfirm key="cancel" onConfirm={
                                   () => {
                                       if(store.cancel){
                                           store.cancel('sdsdsd');
                                       }else{
                                           store.uploadComplete();
                                       }
                                   }
                               } title="无法断点上传,确认取消?">
                                   <Button key="cancel" icon="stop" >取消上传</Button>
                               </Popconfirm>,
                               <Button key="upload"
                                       className="upload-demo-start"
                                       type="primary"
                                       onClick={store.handleUpload}
                                       disabled={store.fileList.filter(d => d).length === 0}
                                       loading={store.uploading}
                               >
                                   {store.uploading ? '上传中' : '点击上传'}
                               </Button>
                           ]}
                           closable={false}
                           onCancel={store.toggleFileFormVisible}
                           maskClosable={false}
                           destroyOnClose={true}
                           key="2"
                    >
                        <FileForm/>
                    </Modal>
                    <Modal visible={store.isFileDowning}
                           width={500}
                           title={`下载中....`}
                           footer={[
                               <Popconfirm key="cancel" onConfirm={
                                   () => {
                                       store.cancel('sdsdsd');
                                       //store.downloadComplete();
                                   }
                               } title="无法断点下载,确认取消?">
                                   <Button key="cancel" icon="stop" >取消下载</Button>
                               </Popconfirm>
                           ]}
                           onCancel={null}
                           closable={false}
                           maskClosable={false}
                           destroyOnClose={true}
                           key="3"
                    >
                        <div>
                            <Progress percent={store.percent}/>
                            <span>{store.upDownInfo}</span>
                        </div>
                    </Modal>
                    {
                        store.isSelf ?
                            <Row gutter={8} className="table-head-row">
                                <Col span={4}>
                                    <Progress percent={parseFloat((store.total / store.tenG * 100).toFixed(2))}
                                              strokeWidth={20}
                                              format={this.format}
                                    />
                                </Col>
                                <Col span={6} offset={1}><span>{`共10G已使用${n.number}${n.unit}`}</span></Col>
                                <Col span={8} style={{textAlign: 'right'}} className="col-button">
                                    <ButtonGroup>
                                        <Button onClick={store.showFileForm({name: '/'})} icon="upload">上传文件</Button>
                                        <Button onClick={store.showForm({name: ''})} icon="folder-add">新建文件夹</Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                            :
                            <Row gutter={8} className="table-head-row">
                                <Col span={6} offset={1}><span>{`已使用${n.number}${n.unit}`}</span></Col>
                                <Col span={8} style={{textAlign: 'right'}} className="col-button">
                                    <ButtonGroup>
                                        <Button onClick={store.showFileForm({name: '/'})} icon="upload">上传文件</Button>
                                        <Button onClick={store.showForm({name: ''})} icon="folder-add">新建文件夹</Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                    }

                    {/*<Table columns={this.columns}*/}
                           {/*rowKey={record => record.name}*/}
                           {/*dataSource={store.rootDir.filter(d => d)}*/}
                           {/*rowSelection={null}*/}
                           {/*size="small"*/}
                           {/*scroll={{y: 800}}*/}
                           {/*// expandedRowRender={this.expandedRowRender}*/}
                           {/*pagination={null}*/}
                    {/*/>*/}
                    <DargTable/>
                </Spin>
            </div>
        );
    }
}

export default SwiftTable;
