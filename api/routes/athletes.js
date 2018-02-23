const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Athlete = require('../models/athlete');

router.get('/', (req, res, next) => {
    Athlete.find()
        //.select('name age _id bithdate gender')
        .exec()
        .then(docs => {
            const response = {
                    count: docs.length,
                    athletes: docs.map(doc => {
                        return {
                            _id: doc._id,
                            name: doc.name,
                            birthdate: doc.birthdate,
                            gender: doc.gender,
                            email: doc.email,
                            created: doc.created,
                            modified: doc.modified,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/athletes/' + doc._id
                            }
                        }
                    })
            }
        if (docs.length >= 1) {
            res.status(200).json(response);
        } else {
            res.status(404).json({
                message: 'No entries found'
            });
        }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post("/", (req, res, next) => {
    const athlete = new Athlete({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        birthdate: req.body.birthdate,
        gender: req.body.gender
    });
    athlete
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created Athlete Successfully",
                createdAthlete: {
                        _id: result._id,
                        name: result.name,
                        gender: result.gender,
                        birthdate: result.birthdate,
                        email: result.email,
                        created: result.created,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/athletes/' + result._id
                        }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


router.get('/:athleteId', (req, res, next) => {
    const id = req.params.athleteId;
    Athlete.findById(id)
        .select('_id name birthdate gender created modified')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for this ID" })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.patch('/:athleteId', (req, res, next) => {
    const id = req.params.athleteId
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    updateOps['modified'] = Date.now();
    Athlete.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:athleteId', (req, res, next) => {
    const id = req.params.athleteId
    Athlete.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Athlete deleted successfully"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;