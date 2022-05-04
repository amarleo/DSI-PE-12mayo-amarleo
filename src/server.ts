import * as net from 'net';
import * as fs from 'fs';

type ResponseType = {
  type: string;
  description?: string;
}

const server = net.createServer({allowHalfOpen: true}, (connection) => {
  console.log('A client has connected');

  let message = '';
  connection.on('data', (chunkMessage) => {
    message += chunkMessage;
  });

  connection.on('end', () => {
    console.log('The client has finished sending the message');

    const jsonMessage = JSON.parse(message);

    fs.appendFile('databaseMessages.txt', jsonMessage.text + '\n', (err) => {
      let response: ResponseType;
      if (err) {
        console.log('An error has occurred writing the message in the file');
        response = {
          type: 'err',
          description: 'wrong writing to file',
        };
      } else {
        console.log('The message has been written correctly in the file');
        response = {
          type: 'success',
        };
      }
      connection.write(JSON.stringify(response), (err) => {
        if (err) {
          console.log(`The response could not be sent to the client: ${err.message}`);
        } else {
          connection.end();
        }
      });
    });
  });

  connection.on('error', (err) => {
    if (err) {
      console.log(`An error occurred while establishing the connection: ${err.message}`);
    }
  });

  connection.on('close', () => {
    console.log('A client has disconnected.');
  });
});

server.listen(60500, () => {
  console.log('Waiting for clients to connect...');
});
