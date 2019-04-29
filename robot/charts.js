const fs = require('fs')
const exporter = require('highcharts-export-server')

exporter.initPool()

// { desc, timeline } ==> { desc, imgData } 
function getChartData(data, color = '#7cb5ec') {
  const { desc, timeline } = data
  // 只取最近的时间段 宽限4小时
  let timeList = []
  for (let i = timeline.length - 1; i >= 0; i--) {
    const item = timeline[i]
    timeList.unshift(item)
    if (i === 0 || item.t - timeline[i - 1].t > 3600 * 4) break
  }

  // 时间范围
  let firstTime = new Date(timeList[0].t * 1000 + 28800000).toISOString().slice(0, 10)
  let lastTime = new Date(timeList[timeList.length - 1].t * 1000 + 28800000).toISOString().slice(0, 10)
  const dayRange = firstTime === lastTime ? firstTime : `${firstTime} ~ ${lastTime}`
  return new Promise((resolve, reject) => {
    exporter.export({
      options: {
        chart: {
          type: 'spline',
          plotBorderWidth: 1,
          plotBorderColor: '#e6e6e6'
        },
        title: {
          text: desc
        },
        subtitle: {
          text: '来自微信小程序：热搜分析师'
        },
        legend: {
          enabled: false
        },
        exporting: {
          enabled: false  
        },
        credits: {
          text: dayRange,
          position: {
            verticalAlign: 'top',
            y: 48
          }
        },
        xAxis: {
          type: 'datetime',
          lineColor: '#e6e6e6'
        },
        yAxis: {
          offset: 10,
          title: {
            text: '热度',
            align: 'high',
            rotation: 0,
            y: -15,
            x: 10,
            // margin: 10,
            style: { color: '#9e9e9e' }
          },
          min: 0,
          gridLineDashStyle: 'Dash',
          labels: {
            reserveSpace: false,
            x: 0,
            // formatter: function() {
            //   if (this.value === 0) return 0
            //   else return (this.value / 1000000).toFixed(1) + 'M'
            // }
          }
        },
        series: [{
          marker: {
            radius: 0
          },
          lineWidth: 4,
          color: color,
          data: timeList.map(obj => [obj.t * 1000 + 28800000, obj.n])
        }]
      }
    }, (err, res) => {
      if (err) {
        reject(err)
      } else {
        // test
        // fs.writeFile(`${desc}.png`, Buffer.from(res.data, 'base64'), err => {
        //   if (err) console.log(err)
        // })
        resolve({ desc: desc, imgData: res.data })
      }
    })
  })
}


exports.getChartData = getChartData

// getChartData({
//   desc: '韩国300多议员在国会打了起来',
//   timeline: [
//     {"t":1556150400,"n":105732},{"t":1556150700,"n":104352},{"t":1556151000,"n":358602},
//     {"t":1556360100,"n":105732},{"t":1556360400,"n":104352},{"t":1556360700,"n":358602},{"t":1556361000,"n":365561},{"t":1556361300,"n":631922},{"t":1556361600,"n":1285401},{"t":1556361900,"n":1223323},{"t":1556362200,"n":1127811},{"t":1556362500,"n":1169134},{"t":1556362800,"n":1169437},{"t":1556363100,"n":1214016},{"t":1556363400,"n":1255684},{"t":1556363700,"n":1236119},{"t":1556364000,"n":1165210},{"t":1556364300,"n":1085888},{"t":1556364600,"n":1033654},{"t":1556364900,"n":1004017},{"t":1556365200,"n":934541},{"t":1556365500,"n":876452},{"t":1556365800,"n":831657},{"t":1556366100,"n":770988},{"t":1556366400,"n":713751},{"t":1556366700,"n":640442},{"t":1556367000,"n":585680},{"t":1556367300,"n":686232},{"t":1556367600,"n":646166},{"t":1556367900,"n":520312},{"t":1556368200,"n":506559},{"t":1556368500,"n":485284},{"t":1556368800,"n":489969},{"t":1556369100,"n":537330}]
// }, '#ff576b').then(() => {
//   exporter.killPool()
// })


