import dynamoose from 'dynamoose';

const schema = new dynamoose.Schema({
  'id': String,
  'name': String,
  'age': String,
});

const people = dynamoose.model('people', schema);

export const handler = async (event) => {
  // TODO implement
  console.log('this is the body', event.body);
  let parsedBody = JSON.parse(event.body);
  const response = { statusCode: null, body: null };

  try {
    let results = await people.create(parsedBody);
    console.log('our results...', results);
    response.body = JSON.stringify(results);
    response.statusCode = 200;

  } catch (e) {
    response.body = JSON.stringify(e.message);
    response.statusCode = 500;

  }
  return response;
};  