import React from 'react';
import {  Button ,Upload,Icon} from 'antd';
import {inject,observer} from 'mobx-react';
//import {baseUrl,post} from '../util';

@inject('rootStore')
@observer
class FileForm extends React.Component{

    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }

        return e && e.fileList;
    };

    componentDidMount(){
        this.props.rootStore.swiftStore.clearFileList();
    }



    render(){
        const store=this.props.rootStore.swiftStore;
        return (
            <div>
                <Upload action='' beforeUpload={store.beforeUpload} onRemove={store.onRemove}>
                    <Button>
                        <Icon type="upload" /> Select File
                    </Button>
                </Upload>
                <Button
                    className="upload-demo-start"
                    type="primary"
                    onClick={store.handleUpload}
                    disabled={store.fileList.filter(d=>d).length === 0}
                    loading={store.uploading}
                >
                    {store.uploading ? '上传中' : '点击上传' }
                </Button>
            </div>
        );
    }
}


export default  FileForm