import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
const People = require('./schema');
import {
    DynamoDBDocumentClient,
    ScanCommand,
    PutCommand,
    GetCommand,
    DeleteCommand
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
    // Add your AWS credentials here if not using default credentials provider
    // region: 'your-aws-region',
    // credentials: { accessKeyId: 'your-access-key', secretAccessKey: 'your-secret-key' },
});

const dynamo = DynamoDBDocumentClient.from(client);
const tableName = 'people';

export const handler = async (event) => {
    let body;
    let statusCode = 200;
    let headers = {
        'Content-Type': 'application/json',
    };

    console.log(event.routeKey);

    try {
        switch (event.routeKey) {
            case 'DELETE /people/{id}':
                await dynamo.send(
                    new DeleteCommand({
                        TableName: tableName,
                        Key: {
                            id: event.pathParameters.id,
                        },
                    })
                );
                body = `Deleted person: ${event.pathParameters.id}`;
                statusCode = 204;
                break;

            case 'GET /people':
                const scanResult = await dynamo.send(new ScanCommand({ TableName: tableName }));
                body = scanResult.Items;
                break;

            case 'GET /people/{id}':
                const getResult = await dynamo.send(
                    new GetCommand({
                        TableName: tableName,
                        Key: {
                            id: event.pathParameters.id,
                        },
                    })
                );
                body = getResult.Item;
                break;

            case 'PUT /people':
                const obj = JSON.parse(event.body);
                const newPerson = new People({
                    id: obj.id,
                    firstName: obj.firstName,
                    age: obj.age,
                });

                // Validate the newPerson object here if needed

                await dynamo.send(
                    new PutCommand({
                        TableName: tableName,
                        Item: newPerson,
                    })
                );
                body = `PutCommand ${obj.id}`;
                break;

            default:
                statusCode = 404;
                body = 'Not Found';
        }
    } catch (err) {
        console.error('Error:', err.message);
        statusCode = 500;
        body = 'Internal Server Error';
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};
