const getSingleBarOption = (sourceData, colors) => {
  let data = [];
  sourceData.forEach(({ name, value }, index) => {
    data.push({
      value: [name, value],
      itemStyle: { color: colors[index] },
    });
  });
  return {
    backgroundColor: '#fff',
    xAxis: {
      type: 'category',
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      show: false,
    },
    grid: {
      top: 8,
      left: 'center',
      width: '100%',
    },
    series: [
      {
        name: '统计图',
        type: 'bar',
        barMaxWidth: 32,
        markLine: {
          label: { show: false },
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

const getItemsPieOption = (sourceData, size, colors) => {
  let data = [];
  sourceData.forEach(({ name, value }, index) => {
    data.push({
      name,
      value,
      itemStyle: { color: colors[index] },
    });
  });
  const maxRadius = Math.min(size.width - 104, size.height) / 2;
  return {
    backgroundColor: '#fff',
    legend: {
      left: 0,
      top: 0,
      orient: 'vertical',
      itemHeight: 8,
      itemWidth: 8,
      formatter: (name) => {
        if (name.length > 10) {
          return `${name.slice(0, 10)}...`
        }
        return name
      },
    },
    tooltip: {
      formatter: '{b}：{c}',
      axisPointer: {
        animation: false,
      },
    },
    series: [
      {
        type: 'pie',
        center: [ size.width / 2 + 52, '50%'],
        radius: [maxRadius - 24, maxRadius],
        hoverAnimation: false,
        label: {
          show: false,
        },
        data: data,
      },
    ],
  }
};

const getLineOption = (sourceData, colors) => {
  let series = [];
  let legend = [];
  sourceData.forEach((item, index) => {
    series.push({
      type: 'line',
      name: item.type,
      data: item.values,
      itemStyle: {
        color: colors[index],
      },
    });
    legend.push(item.type);
  });
  return {
    backgroundColor: '#fff',
    grid: {
      top: 'center',
      right: 24,
    },
    legend: {
      data: legend,
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        let strs = [];
        let date = new Date(params[0].data[0]);
        strs.push(date.toLocaleString());
        params.forEach((item, index) => {
          strs.push(`${item.seriesName}: ${item.data[1].toFixed(2)}%`);
        });
        return strs.join('<br />')
      },
      axisPointer: {
        animation: false,
      },
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: (value) => {
          const date = new Date(value);
          const hour = date.getHours();
          const minute = date.getMinutes();
          return `${hour}:${minute < 10 ? `0${minute}` : minute}`
        },
      },
    },
    yAxis: {
      type: 'value',
      splitNumber: 2,
      max: 100,
      min: 0,
    },
    series,
  }
};

const getSankeyOption = (sourceData, links, colors) => {
  let data = [];
  sourceData.forEach(({ name, type }) => {
    data.push({
      name,
      itemStyle: { color: colors[type] },
    })
  });
  return {
    backgroundColor: '#fff',
    series: [
      {
        type: 'sankey',
        left: 16,
        right: 124,
        lineStyle: {
          color: '#bbb',
        },
        data,
        links,
      },
    ],
  }
};

export {
  getSingleBarOption,
  getPieOption,
  getItemsPieOption,
  getLineOption,
  getSankeyOption,
}
