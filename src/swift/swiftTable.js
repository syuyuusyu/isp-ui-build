import React from 'react';
import {Table,Button,Divider,Popconfirm,Modal,Icon,Spin} from 'antd';
import {inject, observer} from 'mobx-react';
import CreateForm from './createForm';
import FileForm from './fileForm';
//import {baseUrl, get} from "../util";

//const Option = Select.Option;
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@inject('rootStore')
@observer
class SwiftTable extends React.Component {

    componentDidMount() {
        this.props.rootStore.swiftStore.checkContainer();

    }

    componentWillMount(){

    }

    columns = [
        {dataIndex: 'filename', title: '文件名称', width: 250,

        },
        {
            dataIndex: 'bytes', title: '大小', width: 50,
            render: (text) => {
                return `${(text/1024/1024).toFixed(2)}M`
            }
        },
        {
            dataIndex: 'content_type', title: '类型', width: 50,
            render: (text,record) => {
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
                if(record.isRoot) return;
                if (/\/$/.test(record.name)) {
                    return (
                        <span>
                            <Button icon="profile" onClick={this.props.rootStore.swiftStore.showForm(record,'新建文件夹')} size='small'>新建文件夹</Button>
                            <Divider type="vertical"/>
                            <Button icon="profile" onClick={this.props.rootStore.swiftStore.showFileForm(record,'上传文件')} size='small'>上传文件</Button>
                            {
                                record.name!=='root/'?
                                    <span>
                                        <Divider type="vertical"/>
                                        <Popconfirm onConfirm={this.props.rootStore.swiftStore.delete(record)} title="确认删除?">
                                            <Button disabled={record.children?true:false} icon="profile" onClick={null} size='small'>删除当前文件夹</Button>
                                        </Popconfirm>
                                    </span>
                                :''
                            }

                        </span>
                    );
                } else {
                    return (
                        <span>
                            <Button icon="profile" onClick={this.props.rootStore.swiftStore.download(record)} size='small'>下载文件</Button>
                            <Divider type="vertical"/>
                            <Popconfirm onConfirm={this.props.rootStore.swiftStore.delete(record)} title="确认删除?">
                                <Button icon="profile"  size='small'>删除文件</Button>
                            </Popconfirm>
                        </span>
                    );
                }


            }
        }


    ];

    render() {
        const store = this.props.rootStore.swiftStore;
        if(!store.hasContainer){
            return (
                <Spin indicator={antIcon} tip={store.loadingtest} spinning={store.inDowning}>
                <div><Button onClick={store.launch} icon="profile"  size='large'>点击开通网盘</Button></div>
                </Spin>
            );
        }
        return (
            <div>
                <Spin indicator={antIcon} tip={store.loadingtest} spinning={store.inDowning}>
                <Modal visible={store.formVisible}
                       width={400}
                       title={`新建文件夹 当前路径:${store.selectRow.name}`}
                       footer={null}
                       onCancel={store.toggleFormVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <CreateForm />
                </Modal>
                <Modal visible={store.fileFormVisible}
                       width={400}
                       title={`上传文件 当前路径:${store.selectRow.name}`}
                       footer={null}
                       onCancel={store.toggleFileFormVisible}
                       maskClosable={false}
                       destroyOnClose={true}
                >
                    <FileForm />
                </Modal>
                <Table columns={this.columns}
                       rowKey={record => record.name}
                       dataSource={store.rootDir.filter(d => d)}
                       rowSelection={null}
                       size="small"
                       scroll={{y: 800}}
                       expandedRowRender={this.expandedRowRender}
                       pagination={null}
                />
                </Spin>
            </div>
        );
    }
}

export default SwiftTable;