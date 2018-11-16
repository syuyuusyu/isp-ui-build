import React from 'react';
import {  Button ,Upload,Icon,Progress} from 'antd';
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
                <Upload ref={store.refUpload} action='' beforeUpload={store.beforeUpload} onRemove={store.onRemove} multiple={true}>
                    <Button>
                        <Icon type="upload" /> Select File
                    </Button>
                </Upload>
                {
                    store.uploading ?  <Progress percent={store.percent} /> : ''
                }
                <span>{store.upDownInfo}</span>
            </div>
        );
    }
}


export default  FileForm