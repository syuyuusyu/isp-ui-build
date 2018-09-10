import React from 'react';
import { Select } from 'antd';

const iconType=["edit",'delete',"question","question-circle-o","question-circle",'play-circle','play-circle-o',"plus","plus-circle-o",
    "plus-circle","pause","minus", "minus-circle-o",'profile',
    "solution","info","info-circle-o","exclamation-circle-o","close","close-circle-o","check","check-circle-o","save",
    "appstore-o","setting","folder","database","rocket","safety","dashboard","fork","cloud-o"
];

class IconSelect extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <Select>
                {
                    this.props.nullAble?
                        <Option key={null} value={''} style={{color: 'white'}}>&nbsp;</Option>
                        :
                        ''
                }
                {
                    iconType.map((i, index) =>
                        <Option key={index} value={i}><Icon type={i}/>&nbsp;&nbsp;
                            <span>{i}</span>
                        </Option>)
                }
            </Select>
        );
    }
}

export default IconSelect;


