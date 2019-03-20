import React from 'react';


class Screen extends React.Component{

    componentDidMount(){
        console.log(this.props.match.path);
        let port= this.props.match.path.replace(/\/\w+\/(\d+)\/?(?:\S)*/, (w, p1) => {
                return p1;
            });
        if(port==3001){
            window.open(`http://10.10.50.14:${port}`);
        }else{
            window.open(`http://10.10.50.10:${port}`);
        }
        window.history.back(-1);
    }


    render(){
        return (
            <div></div>
        );
    }
}

export default Screen;
