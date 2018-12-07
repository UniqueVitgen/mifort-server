var db = require('../db');
var ObjectID = require('mongodb').ObjectID;

exports.all = function (cb) {
  db.get().collection('candidates').find().toArray(function(err, docs) {
    cb(err, docs);
  });
}

exports.findById = function (id, cb) {
  db.get().collection('candidates').findOne({ _id: ObjectID(id) },
  function(err, doc) {
    cb(err, doc);
  })
}

exports.create = function (artist, cb) {
  db.get().collection('candidates').insert(artist, function(err, result) {
    cb(err, result);
  })
}

exports.search = function (searchValue, cb) {
  db.get().collection('candidates').find(candidate => {
    const searchConst = searchValue.toLowerCase();
    const fullName = (candidate.name + ' ' + candidate.surname).toLowerCase()
    const name = candidate.name.toLowerCase();
    const surname = candidate.surname.toLowerCase();
    return fullName.indexOf(searchConst) > -1
    ||
    name.indexOf(searchConst) > -1
    ||
    surname.index(searchConst) > -1;
  }).toArray(function(err, docs) {
    cb(err, docs);
  });
}

exports.update = function (id, artist, cb) {
  db.get().collection('candidates').updateOne(
    { _id: ObjectID(id)},
    { $set: artist },
    function(err, result) {
      cb(err,result);
    })
}

exports.delete = function (id, cb) {
  db.get().collection('candidates').deleteOne(
    {_id: ObjectID(id)},
    function (err, result) {
      cb(err, result);
    }
  )
}
