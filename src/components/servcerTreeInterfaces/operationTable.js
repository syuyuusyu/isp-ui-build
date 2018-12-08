import React, {Component} from 'react';
import { notification} from 'antd';
import '../../style.css';




class OperationTable extends Component {

    columns = [
        {dataIndex: 'name', title: '名称', width: 100,},
        {dataIndex: 'name', title: '名称', width: 100,},
        {dataIndex: 'path', title: '路径', width: 100,},
        {dataIndex: 'method', title: '请求方法', width: 60,},
    ];

    render() {
        console.log(CommonLayOut);
        return (
            <CommonLayOut entityId={1036} canSelectRows={true} />
        );
    }
}

export default OperationTable;