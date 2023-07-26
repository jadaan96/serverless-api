const dynamoose = require('dynamoose');
const { Schema } = dynamoose;

const peopleSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  age:{
    type:Number,

  }
});

const people = dynamoose.model('people', peopleSchema);

module.exports = people;