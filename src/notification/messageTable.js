import React from 'react';
import {Table,Button,Popconfirm} from 'antd';
import {inject,observer} from 'mobx-react';


//const Option = Select.Option;

@inject('rootStore')
@observer
class MessageTable extends React.Component{

    componentDidMount(){

    }

    columns=[
        {dataIndex:'message_type',title:'事项类型',width:100,
            render:(text)=>{
                switch (text){
                    case '1':
                        return '申请平台访问权限';
                    case '2':
                        return '普通消息';
                    default :
                        return text;
                }
            }
        },
        {dataIndex:'message',title:'消息内容',width:200},
        {
            title: '操作', width: 200,
            render: (text,record) => {
                switch (record.message_type){
                    case '1':
                        return  (
                            <span>
                                <Button icon="profile" onClick={this.props.rootStore.notificationStore.approval(record)} size='small'>批准</Button>
                                <Button icon="profile" onClick={this.props.rootStore.notificationStore.disApproval(record)} size='small'>否决</Button>
                            </span>
                        );
                    case '2':
                        return (
                            <span>
                                <Popconfirm onConfirm={this.props.rootStore.notificationStore.deleteMsg(record)} title="确认删除?">
                                    <Button icon="profile" size='small'>删除</Button>
                                </Popconfirm>
                            </span>
                        );
                    default:
                        return '';
                }

            }
        },


    ];

    render(){
        const store=this.props.rootStore.notificationStore;
        return (<div>
            <Table columns={this.columns}
                   rowKey={record => record.id}
                   dataSource={store.messages.filter(d=>d)}
                   rowSelection={null}
                   size="small"
                   scroll={{ y: 800 }}
                   //pagination={null}
            />
        </div>);
    }
}

export default MessageTable;