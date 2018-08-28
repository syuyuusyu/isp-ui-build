import React from 'react';
import { Button } from 'antd';

class RoleButton extends React.Component {
  constructor(props) {
    super();
    this.createButton = {};
    this.createButton = JSON.parse(sessionStorage.getItem('buttons'))[props.buttonId];
  }

  render() {
    return (
      <Button
        ghost={this.props.ghost}
        href={this.props.href}
        //htmlType={this.props.htmlType}
        icon={this.props.icon || this.createButton.icon}
        loading={this.props.loading}
        shape={this.props.shape}
        size={this.props.size || this.createButton.size}
        target={this.props.target}
        type={this.props.type}
        onClick={this.props.onClick}
        disabled={this.createButton.available < 1}
      >
        {this.props.clidren || this.createButton.text}
      </Button>
    );
  }
}

export default RoleButton;
