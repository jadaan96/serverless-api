import dynamoose from 'dynamoose';

const schema = new dynamoose.Schema({
    'id': String,
    'name': String,
    'age': String
});

const people = dynamoose.model('people', schema);

export const handler = async(event) => {
  
  const response = {statusCode: null, body: null,};
  const id = event?.pathParameters?.id;
  
  try {
    let results = await people.get(id);
    console.log('results', results);
    
    response.body = JSON.stringify(results);
    response.statusCode = 200;
  }catch(e){
    response.body = JSON.stringify(e.message);
    response.statusCode = 500;
  }
  
  return response;
}