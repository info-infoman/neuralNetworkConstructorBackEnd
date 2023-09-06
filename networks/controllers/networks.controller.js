const NetworkModel = require('../models/networks.model');
const crypto = require('crypto');

exports.insert = (req, res) => {
    NetworkModel.createNetwork(req.jwt.userId, req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    NetworkModel.list(req.jwt.userId, limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    NetworkModel.findById(req.jwt.userId, req.params.networkId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.patchById = (req, res) => {
    NetworkModel.patchNetwork(req.jwt.userId, req.params.networkId, req)
        .then((result) => {
            res.status(204).send({});
        });

};

exports.removeById = (req, res) => {
    NetworkModel.removeById(req.jwt.userId, req.params.networkId)
        .then((result)=>{
            res.status(204).send({});
        });
};