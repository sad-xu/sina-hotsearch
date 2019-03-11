
import * as tf from '@tensorflow/tfjs'

// 获取和处理天气数据的类

export class JenaWeatherData {
  constructor() {}

  // 加载、预处理数据
  async load() {
    let res
    try {
      res = await fetch('./jena_climate_2009_2016_lite.csv')
    } catch (err) {}
    if (res !== null && (res.status === 200 || res.status === 304)) {
      console.log('Loading data from local path')
    }
    const csvData = await res.text()
    // 解析csv
    const csvLines = csvData.split('\n')
    // 解析头部 去掉引号
    const columnNames = csvLines[0].split(',').map(title => title.slice(1, title.length - 1))

    // 断言'Data Time'是否在第一列 
    this.dateTimeCol = columnNames.indexOf('Date Time')
    tf.util.assert(this.dateTimeCol === 0, 'Unexpected data-time column index')
    
  }
}

