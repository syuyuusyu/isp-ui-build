/**
 * 获取饼图（用来表示占用率）的option
 * @param sourceData{object} 源数据
 * @param colors{array} 颜色组
 * @returns echarts的option
 */
const getPieOption = (sourceData, colors) => {
    console.log(sourceData);
  let data = [
    {
      name: '已用',
      value: sourceData.used,
      itemStyle: {
        color: colors[0],
      },
    },
    {
      name: '剩余',
      value: sourceData.total - sourceData.used,
      itemStyle: {
        color: colors[1],
      },
    },
  ];
  return {
    backgroundColor: '#fff',
    title: {
      left: 'center',
      top: 'center',
      text: sourceData.total === 0 ? '0%' : `${Math.round((sourceData.used / sourceData.total) * 100)}%`,
      textStyle: {
        color: '#333',
        fontSize: 14,
        fontWeight: 'normal',
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['65%', '80%'],
        hoverAnimation: false,
        label: { show: false },
        data: data,
      },
    ],
  }
};

/**
 * 获取柱状图（单系列）option
 * @param sourceData{array} 源数据
 * @param colors{array} 颜色组
 * @returns echarts的option
 */
const getSingleBarOption = (sourceData, colors,showAxis=false) => {
    let data = [];
    sourceData.forEach(({name, value}, index) => {
        data.push({
            value: [name, value],
            itemStyle: {color: colors[index]},
        });
    });
    return {
        backgroundColor: '#fff',
        xAxis: {
            type: 'category',
            axisLine: {show: showAxis},
            axisTick: {show: showAxis},
        },
        yAxis: {
            show: showAxis,
        },
        grid: {
            top: 'center',
            left: 'center',
            width: '100%',
            height: '70%'
        },
        series: [
            {
                name: '统计图',
                type: 'bar',
                barMaxWidth: 56,
                markLine: {
                    label: {show: false},
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{@[1]}',
                },
                data,
            }
        ],
    }
};

export {
    getPieOption,
    getSingleBarOption,
}
