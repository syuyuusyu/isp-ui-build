import React from 'react';
import './index.less';

const HorizontalBar = ({ total, value, unit, name, color, width, height }) => {
  const nameStyle = {
    lineHeight: `${height}px`,
  };
  const barBgStyle = {
    width: width - 140,
  };
  const barStyle = {
    width: Math.floor((width - 140) * value / total),
    backgroundColor: color,
  };
  return (
    <div className="my-horizontal-bar" style={{ width, height }}>
      <div className="name" style={nameStyle}>{name}</div>
      <div className="bar-bg" style={barBgStyle} />
      <div className="bar" style={barStyle} />
      <div className="text">{value}{unit}({total})</div>
    </div>
  )
};

export default HorizontalBar
