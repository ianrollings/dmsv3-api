const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Activity = require('../models/activity');

router.get('/', (req, res, next) => {
    Activity.find()
        //.select('')
        .exec()
        .then(docs => {
            const response = {
                    count: docs.length,
                    activity: docs.map(doc => {
                        return {
                            _id: doc._id,
                            created: doc.created,
                            modified: doc.modified,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/activities/' + doc._id
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
    const activity = new Activity({
        _id: new mongoose.Types.ObjectId(),
        type: req.body.type,
        date: req.body.date,
        athletes: req.body.athletes
   });
    activity
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created Activity Successfully",
                createdActivity: {
                        _id: result._id,
                        type: req.body.type,
                        date: req.body.date,                       
                        athletes: req.body.athletes,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/activities/' + result._id
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


router.get('/:activityId', (req, res, next) => {
    const id = req.params.activityId;
    Activity.findById(id)
//        .select('_id created modified')
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


router.patch('/:activityId', (req, res, next) => {
    const id = req.params.activityId
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    //updateOps['modified'] = Date.now();
    Activity.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Updated Activity Successfully"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:activityId', (req, res, next) => {
    const id = req.params.activityId
    Activity.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Deleted Activity Successfully"
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