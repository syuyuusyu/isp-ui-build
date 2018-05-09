const colorIndex = ['#2ee62e', '#e6c62e', '#2eace6', '#e67c2e', '#9ae62e', '#e5e52e', '#2e89e6'];

const getBarOption = (sourceData) => {
  let dataTotal = [];
  let dataSuccess = [];
  let dataUsed = [];
  let xData = [];
  sourceData.forEach(({ type, total, success, used  }, index) => {
    dataTotal.push({
      value: total,
    });
    dataSuccess.push({
      value: success !== undefined ? success : 0,
    });
    dataUsed.push({
      value: used !== undefined ? used : 0,
    });
    xData.push(type)
  });
  return {
    backgroundColor: '#fff',
    xAxis: {
      data: xData,
      axisTick: { show: false },
    },
    yAxis: {
      show: true,
    },
    grid: {
      top: 'center',
      right: 0,
    },
    label: {
      show: true,
      position: 'top',
      formatter: '{c}个',
    },
    legend: {
      data: ['总量', '成功', '占用'],
    },
    series: [
      {
        name: '总量',
        type: 'bar',
        barMaxWidth: 32,
        markLine: {
          label: { show: false },
        },
        itemStyle: { color: '#4c96df' },
        data: dataTotal,
      },
      {
        name: '成功',
        type: 'bar',
        barMaxWidth: 32,
        markLine: {
          label: { show: false },
        },
        itemStyle: { color: '#2deb7d' },
        data: dataSuccess,
      },
      {
        name: '占用',
        type: 'bar',
        barMaxWidth: 32,
        markLine: {
          label: { show: false },
        },
        itemStyle: { color: '#f8c32f' },
        data: dataUsed,
      },
    ],
  }
};

const getPieOption = (sourceData, colors) => {
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
      text: sourceData.total === 0 ? '100%' : `${Math.round((sourceData.used / sourceData.total) * 100)}%`,
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

export {
  getBarOption,
  getPieOption,
}
