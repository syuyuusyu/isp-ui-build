

export const  format=(txt,compress/*是否为压缩模式*/)=>{/* 格式化JSON源码(对象转换为JSON文本) */

    var indentChar = '    ';
    if(/^\s*$/.test(txt)){
        console.error('数据为空,无法格式化! ');
        return;
    }
    try{
        //var data=eval('('+txt+')');
        var data=JSON.parse(txt);
    } catch(e){
        console.error('数据源语法错误,格式化失败! 错误信息: '+e.description,'err');
        return;
    };
    var draw=[],
        //last=false,This=this,
        //nodeCount=0,maxDepth=0,
        line=compress?'':'\n';

    var notify=function(name,value,isLast,indent/*缩进*/,formObj){
        //nodeCount++;/*节点计数*/
        for (var j=0,tab='';j<indent;j++ )tab+=indentChar;/* 缩进HTML */
        tab=compress?'':tab;/*压缩模式忽略缩进*/
        //maxDepth=
        ++indent;/*缩进递增并记录*/
        if(value&&value.constructor===Array){/*处理数组*/
            draw.push(tab+(formObj?('"'+name+'":'):'')+'['+line);/*缩进'[' 然后换行*/
            for (let i=0;i<value.length;i++)
                notify(i,value[i],i===value.length-1,indent,false);
            draw.push(tab+']'+(isLast?line:(','+line)));/*缩进']'换行,若非尾元素则添加逗号*/
        }else   if(value&&typeof value==='object'){/*处理对象*/
            draw.push(tab+(formObj?('"'+name+'":'):'')+'{'+line);/*缩进'{' 然后换行*/
            var len=0,i=0;
            //for(var key in value)len++;
            len=len+Object.keys(value).length;
            for(var key in value)notify(key,value[key],++i===len,indent,true);
            draw.push(tab+'}'+(isLast?line:(','+line)));/*缩进'}'换行,若非尾元素则添加逗号*/
        }else{
            if(typeof value==='string')value='"'+value+'"';
            draw.push(tab+(formObj?('"'+name+'":'):'')+value+(isLast?'':',')+line);
        };
    };
    var isLast=true,indent=0;
    notify('',data,isLast,indent,false);
    return draw.join('');
};

export const evil=(fn) =>{
    fn.replace(/(\s?function\s?)(\w?)(\s?\(w+\)[\s|\S]*)/g,function(w,p1,p2,p3){
        return p1+p3;
    });
    let Fn = Function;
    return new Fn('return ' + fn)();
};

export const log=(target, name, descriptor)=> {
    var oldValue = descriptor.value;
    descriptor.value = function() {
        console.log(`Calling ${name} with`, arguments);
        return oldValue.apply(null, arguments);
    };

    return descriptor;
};

export const baseUrl='http://localhost:7001';
//export const baseUrl='';
//export const baseUrl='http://192.168.3.11:7001';

export  function request (method, url, body) {
    method = method.toUpperCase();
    if (method === 'GET') {
        // fetch的GET不允许有body，参数只能放在url中
        body = undefined;
    } else {
        body = body && JSON.stringify(body);
    }
    return fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Token': sessionStorage.getItem('access-token') || '' // 从sessionStorage中获取access token
        },
        body
    })
        .then((res) => {
            if (res.status === 401) {
                //hashHistory.push('/login');
                return Promise.reject('Unauthorized.');
            } else {
                const token = res.headers.get('access-token');
                if (token) {
                    sessionStorage.setItem('access_token', token);
                }
                //console.log(res.json());
                return res.json();
            }
        });
}

export const get = url => request('GET', url);
export const post = (url, body) => request('POST', url, body);
export const put = (url, body) => request('PUT', url, body);
export const del = (url, body) => request('DELETE', url, body);

export const convertGiga = (byte) => {
    const units = ['KB','MB','GB','TB']
    for(let i=0;i<units.length;i++){
        byte = byte / 1024;
        if(byte<1024)
            return {
                number:Math.round(byte*100)/100,
                unit:units[i]
            }
    }
    return {
        number:Math.round(byte*100)/100,
        unit:units[units.length-1]
    }
};
