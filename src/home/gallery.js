import React, { Component } from 'react'
import './gallery.less'

// 根据容器宽高计算图片宽和最多同时可展示图片的数量
const getImgSet = ({ width: maxWidth, height }) => {
    let i = 0;
    let width = 0;
    while (width < maxWidth) {
        width = width + height;
        i++
    }
    i -= 1;
    width = width - height;
    return { i, width: width / i }
};

class Gallery extends Component {
    constructor (props) {
        super();
        const { size, pictures, duration } = props;
        // 图片宽和展示数量
        const { width: imgWidth, i: maxImgNum } = getImgSet(size);
        const spaceBetween = (size.width - (imgWidth * maxImgNum)) / maxImgNum / 2;
        this.state = {
            size,
            pictures,
            duration,
            imgWidth,
            maxImgNum,
            spaceBetween,
            needTransform: false,
            currentShowIndex: 0,
        };
        this.sliderBox = React.createRef();
        this.transformFinished = this.transformFinished.bind(this);
    }
    componentDidMount () {
        const { pictures, maxImgNum, duration } = this.state;
        const totalPicNum = pictures.length;
        if (totalPicNum > maxImgNum) {
            this.timerAutoChange = setTimeout(() => {
                this.setState({ needTransform: true })
            }, duration);
        }
        this.sliderBox.current.addEventListener('transitionend', this.transformFinished, false);
    }
    componentWillUnmount () {
        this.sliderBox.current.removeEventListener('transitionend', this.transformFinished, false);
    }
    transformFinished (e) {
        const { duration, needTransform } = this.state;
        if (needTransform) {
            this.setState(({ pictures, currentShowIndex }) => {
                return {
                    needTransform: false,
                    currentShowIndex: currentShowIndex + 1 < pictures.length ? currentShowIndex + 1 : 0
                }
            });
            this.timerAutoChange = setTimeout(() => {
                this.setState({ needTransform: true })
            }, duration)
        }
    }
    render () {
        const { pictures, size, imgWidth, maxImgNum, spaceBetween, needTransform, currentShowIndex } = this.state;
        let sliderBoxStyle = {
            width: (maxImgNum + 1) * (imgWidth + spaceBetween * 2),
            height: size.height
        };
        if (needTransform) {
            sliderBoxStyle.transitionDuration = '0.6s';
            sliderBoxStyle.transform = `translateX(${-(imgWidth + spaceBetween * 2)}px)`;
        } else {
            sliderBoxStyle.transitionDuration = '0s';
            sliderBoxStyle.transform = `translateX(0)`;
        }
        const picturesShowing = ((arr, index, num) => {
            const result = new Array(num);
            let i = 0;
            while (i < num) {
                result[i] = arr[index];
                if (arr[index + 1]) {
                    index++
                } else {
                    index = 0
                }
                i++;
            }
            return result
        })(pictures, currentShowIndex, maxImgNum + 1);
        return (
            <div className="gallery-container" style={size}>
                <div ref={this.sliderBox} className="slider-box" style={sliderBoxStyle}>
                    {picturesShowing.map((pic, index) => (
                        <div key={index} className="img-box" style={{ width: imgWidth, height: size.height, marginLeft: spaceBetween, marginRight: spaceBetween }}>
                            <img src={pic[0]} alt="" style={{ width: size.height - 40 }} />
                            <span className="name">{pic[1]}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default Gallery

