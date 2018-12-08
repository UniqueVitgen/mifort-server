var db = require('../db');
var ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose'), Schema = mongoose.Schema;


var VacancySchema = new Schema({
  position: {
    type: String,
    required: true
  },
  salaryInDollarsFrom: Number,
  salaryInDollarsTo: Number,
  vacancyState: [{
    type: String,
    enum: ['OPEN', 'CLOSE']
  }],
  experienceYearsRequired: Number,
  skills: [{
    name: {
      type: String,
      required: true
    }
  }],
  requirements: [{
      name:  {
        type: String,
        required: true
      }
  }],
	candidates: [{ type: Schema.Types.ObjectId, ref: 'Candidate' }]
});


module.exports = mongoose.model('Vacancy', VacancySchema);
