//const tf = require('@tensorflow/tfjs-node');
//const createModel = require('./model');
//const createDataset = require('./data');

// Array of allowed files
const array_of_allowed_files = ['csv'];
const array_of_allowed_file_types = ['text/csv'];
// Allowed file size in mb
const allowed_file_size = 10;

//const savePath = 'file://trainedModels/';

const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const networkSchema = new Schema({
    userId: String,
    name: String,
    description: String,
    inputs: Number,
    hiddens: Number,
    outputs: Number,
    epochs: Number,
    learningRate: Schema.Types.Decimal128,
    activation: Number,
    regularization: Number,
    regularizationRate: Schema.Types.Decimal128
});

networkSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
networkSchema.set('toJSON', {
    virtuals: true
});

//  networkSchema.findById = function (cb) {
//     return this.model('Networks').find({userId: this.userId, id: this.id}, cb);
//  };

const Network = mongoose.model('Network', networkSchema);

exports.findById = (userId, id) => {
    return Network.findById(id)
        .where({ userId: userId })
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createNetwork = (userId, networkData) => {
    const networkData_ = new Network(networkData);
    networkData_.userId = userId;
    return networkData_.save();
};

exports.list = (userId, perPage, page) => {
    return new Promise((resolve, reject) => {
        Network.find({userId: userId})
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, networks) {
                if (err) {
                    reject(err);
                } else {
                    resolve(networks);
                }
            })
    });
};

exports.patchNetwork = (userId, id, networkData) => {
    const data = networkData.file;
    networkData = networkData.body;
    const patchedNetworkData = new Promise((resolve, reject) => {
        Network.findOneAndUpdate(id, networkData)
            .where({ userId: userId })
            .exec(function (err, networkData) {
                if (err) {
                    reject(err);
                } else {
                    resolve(networkData);
                }
            })
    });
    
    if (data !== undefined){
        // Get the extension of the uploaded file
        const file_extension = data.originalname.slice(
            ((data.originalname.lastIndexOf('.') - 1) >>> 0) + 2
        );

        // Check if the uploaded file is allowed
        if (array_of_allowed_files.includes(file_extension) && array_of_allowed_file_types.includes(data.memetype)) {
            if ((image.size / (1024 * 1024)) <= allowed_file_size) {                  
                //train(patchedNetworkData, savePath);
            }
        }
    }


    return patchedNetworkData;
};

exports.removeById = (userId, networkId) => {
    return new Promise((resolve, reject) => {
        Network.deleteMany({userId: userId, _id: networkId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

/**
 * Train a model with dataset, then save the model to a local folder.
 
async function train(networkData, savePath) {
    const datasetObj = await createDataset(networkData.data);
    const model = createModel([datasetObj.numOfColumns]);
    // The dataset has 4177 rows. Split them into 2 groups, one for training and
    // one for validation. Take about 3500 rows as train dataset, and the rest as
    // validation dataset.
    const trainBatches = Math.floor(3500 / batchSize);
    const dataset = datasetObj.dataset.shuffle(1000).batch(batchSize);
    const trainDataset = dataset.take(trainBatches);
    const validationDataset = dataset.skip(trainBatches);
  
    await model.fitDataset(
        trainDataset, {epochs: networkData.epochs, validationData: validationDataset});
  
    await model.save(savePath + networkData._id);
  
    // const loadedModel = await tf.loadLayersModel(savePath + '/model.json');
    // const result = loadedModel.predict(
    //     tf.tensor2d([[0, 0.625, 0.495, 0.165, 1.262, 0.507, 0.318, 0.39]]));
    // console.log(
    //     'The actual test abalone age is 10, the inference result from the model is ' +
    //     result.dataSync());
  }
  */
// const parser = new argparse.ArgumentParser(
//     { description: 'TensorFlow.js-Node Abalone Example.', addHelp: true });
// parser.addArgument('--epochs', {
//     type: 'int',
//     defaultValue: 100,
//     help: 'Number of epochs to train the model for.'
// });
// parser.addArgument('--batch_size', {
//     type: 'int',
//     defaultValue: 500,
//     help: 'Batch size to be used during model training.'
// })
// parser.addArgument(
//     '--savePath',
//     { type: 'string', defaultValue: 'file://trainedModel', help: 'Path.' })
// const args = parser.parseArgs();


// const file = fs.createWriteStream(csvPath);
// https.get(csvUrl, function (response) {
//     response.pipe(file).on('close', async () => {
//         run(args.epochs, args.batch_size, args.savePath);
//     });
// });