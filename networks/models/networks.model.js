const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const networkSchema = new Schema({
    name: String,
    description: String,
    inputs: Number,
    hiddens: Number,
    outputs: Number
});

networkSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
networkSchema.set('toJSON', {
    virtuals: true
});

networkSchema.findById = function (cb) {
    return this.model('Networks').find({id: this.id}, cb);
};

const Network = mongoose.model('Network', networkSchema);

exports.findById = (id) => {
    return Network.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createNetwork = (networkData) => {
    const networkData = new Network(networkData);
    return networkData.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Network.find()
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

exports.patchNetwork = (id, networkData) => {
    return Network.findOneAndUpdate({
        _id: id
    }, networkData);
};

exports.removeById = (networkId) => {
    return new Promise((resolve, reject) => {
        Network.deleteMany({_id: networkId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

