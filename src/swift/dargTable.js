import React from 'react';
import {Table, Button, Divider, Popconfirm, Modal, Icon, Spin, Row, Col, Progress,message} from 'antd';
import {inject, observer} from 'mobx-react';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import '../style.css';
import {convertGiga} from "../util";
//import update from 'immutability-helper';

function dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset,
) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex.index < hoverIndex.index && hoverClientY > hoverMiddleY) {
        return 'downward';
    }
    if (dragIndex.index > hoverIndex.index && hoverClientY < hoverMiddleY) {
        return 'upward';
    }
}

class BodyRow extends React.Component {
    render() {
        const {
            isOver,
            connectDragSource,
            connectDropTarget,
            moveRow,
            dragRow,
            clientOffset,
            sourceClientOffset,
            initialClientOffset,
            ...restProps
        } = this.props;
        const style = { ...restProps.style, cursor: 'move' };

        let className = restProps.className;
        if (isOver && initialClientOffset) {
            const direction = dragDirection(
                dragRow.index,
                restProps.index,
                initialClientOffset,
                clientOffset,
                sourceClientOffset
            );
            if (direction === 'downward') {
                className += ' drop-over-downward';
            }
            if (direction === 'upward') {
                className += ' drop-over-upward';
            }
        }

        return connectDragSource(
            connectDropTarget(
                <tr
                    {...restProps}
                    className={className}
                    style={style}
                />
            )
        );
    }
}

const rowSource = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if(dragIndex.name.endsWith('/')){
            message.warning('只能移动文件!');
            return
        }

        if(hoverIndex.hierachy == dragIndex.hierachy ){
            if (!hoverIndex.name.endsWith('/')){
                return
            }
        }
        if(hoverIndex.hierachy+1 == dragIndex.hierachy ){
            if(dragIndex.name.startsWith(hoverIndex.name)){
                return
            }
        }

        if(!dragIndex.name.endsWith('/') || hoverIndex.hierachy ==1){
            props.moveRow(dragIndex, hoverIndex);
        }else{
            message.warning('只能移动到文件夹!');
        }

        // Time to actually perform the action


        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        //monitor.getItem().index = hoverIndex;
    },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource('row', rowSource, (connect, monitor) => {
        return {
            connectDragSource: connect.dragSource(),
            dragRow: monitor.getItem(),
            clientOffset: monitor.getClientOffset(),
            initialClientOffset: monitor.getInitialClientOffset(),
        }
    })(BodyRow)
);



@inject('rootStore')
@observer
class DragSortingTable extends React.Component {

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


    components = {
        body: {
            row: DragableBodyRow,
        },
    };

    moveRow = (drag, hover)=>{
        const store = this.props.rootStore.swiftStore;
        console.log(drag, hover);
        let srcFold=drag.name,destFold,fileName=drag.filename;
        if(hover.hierachy==1 && !hover.name.endsWith('/')){
            destFold='';
        }else{
            destFold=hover.name;
        }
        store.move(srcFold,destFold,fileName);
    };


    render() {
        const store = this.props.rootStore.swiftStore;
        return (
            <Table
                columns={this.columns}
                rowKey={record => record.name}
                dataSource={store.rootDir.filter(d => d)}
                size="small"
                components={this.components}
                onRow={(record, index) => ({
                    index:{index,...record},
                    moveRow: this.moveRow,
                })}
            />
        );
    }
}

const DargTable = DragDropContext(HTML5Backend)(DragSortingTable);

export default DargTable;

