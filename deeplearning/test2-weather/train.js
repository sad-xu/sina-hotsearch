require('@tensorflow/tfjs-node')


// 参数设置
const args = {
  modelType: 'gru', // or　'simpleRNN'
  lookBack: 10 * 24 * 6, // Look-back period (# of rows) for generating features
  step: 6, // Step size (# of rows) used for generating features
  delay: 24 * 6, // How many steps (# of rows) in the future to predict the temperature for
  normalize: true, // Used normalized feature values
  includeDateTime: false, // Used date and time features
  batchSize: 128, // Batch size for training
  epochs: 20, // Number of training epochs
  displayEvery: 10, // Log info to the console every _ batches
}

// JenaWeatherData buildModel trainModel

// 准备数据
const jenaWeatherData = new JenaWeatherData()
console.log(`Loading Jena weather data...`)
await jenaWeatherData.load()

// 构建模型 'gru', 'simpleRNN'
let numFeatures = jenaWeatherData.getDataColumnNames().length
const model = buildModel(
  args.modelType, 
  Math.floor(args.lookBack / args.step), 
  numFeatures
)

// 开始训练
await trainModel(
  model, 
  jenaWeatherData, 
  args.normalize, 
  args.includeDateTime,
  args.lookBack, 
  args.step, 
  args.delay, 
  args.batchSize, 
  args.epochs,
  args.displayEvery
)

