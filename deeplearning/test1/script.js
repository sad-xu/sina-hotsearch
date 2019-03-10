

async function getData() {
  const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json') 
  const carsData = await carsDataReq.json()
  return carsData.map(car => ({
    mpg: car.Miles_per_Gallon,
    horsepower: car.Horsepower,
  })).filter(car => (car.mpg != null && car.horsepower != null))
}

// 定义模型
function createModel() {
  const model = tf.sequential(); 
  // Add a single hidden layer
  model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}))
  model.add(tf.layers.dense({units: 50, activation: 'sigmoid'}))
  // Add an output layer
  model.add(tf.layers.dense({units: 1, useBias: true}))
  return model
}

// 数据格式转换
function convertToTensor(data) {
  return tf.tidy(() => {
    // Step 1. Shuffle the data 数据乱序
    tf.util.shuffle(data)

    // Step 2. Convert data to Tensor 
    const inputs = data.map(d => d.horsepower)
    const labels = data.map(d => d.mpg)

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1])
    const labelTensor = tf.tensor2d(labels, [labels.length, 1])

    //Step 3.  归一化
    const inputMax = inputTensor.max()
    const inputMin = inputTensor.min()  
    const labelMax = labelTensor.max()
    const labelMin = labelTensor.min()

    const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin))
    const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin))

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    }
  })
}

// 训练模型
async function trainModel(model, inputs, labels) {
  // Prepare the model for training.  
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  })
  
  const batchSize = 28 // 每次迭代数据大小
  const epochs = 50 // 迭代次数
  
  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss', 'mse'], 
      { height: 200, callbacks: ['onEpochEnd'] }
    )
  })
}

// 测试模型
function testModel(model, inputData, normalizationData) {
  const {inputMax, inputMin, labelMin, labelMax} = normalizationData
  const [xs, preds] = tf.tidy(() => {
    const xs = tf.linspace(0, 1, 100)   
    const preds = model.predict(xs.reshape([100, 1]))   
    const unNormXs = xs
      .mul(inputMax.sub(inputMin))
      .add(inputMin)
    const unNormPreds = preds
      .mul(labelMax.sub(labelMin))
      .add(labelMin)
    // Un-normalize the data
    return [unNormXs.dataSync(), unNormPreds.dataSync()]
  })
 
  const predictedPoints = Array.from(xs).map((val, i) => {
    return {x: val, y: preds[i]}
  })
  const originalPoints = inputData.map(d => ({
    x: d.horsepower, y: d.mpg,
  }))
  
  tfvis.render.scatterplot(
    {name: 'Model Predictions vs Original Data'}, 
    {values: [originalPoints, predictedPoints], series: ['original', 'predicted']}, 
    {
      xLabel: 'Horsepower',
      yLabel: 'MPG',
      height: 300
    }
  )
}

// start
async function run() {
  const data = await getData()
  // 原始数据图
  const values = data.map(d => ({
    x: d.horsepower,
    y: d.mpg
  }))
  tfvis.render.scatterplot(
    {name: 'Horsepower v MPG'},
    {values}, 
    {
      xLabel: 'Horsepower',
      yLabel: 'MPG',
      height: 300
    }
  )
  // 模型图
  const model = createModel()
  tfvis.show.modelSummary({name: 'Model Summary'}, model)
  // 
  const tensorData = convertToTensor(data)
  const {inputs, labels} = tensorData
  // Train the model  
  await trainModel(model, inputs, labels)
  console.log('Done Training')
  testModel(model, data, tensorData)
}



document.addEventListener('DOMContentLoaded', run)
