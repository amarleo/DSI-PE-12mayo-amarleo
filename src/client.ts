import * as net from 'net';

if (process.argv.length < 3) {
  console.log('The message must include at least one word');
} else {
  const client = net.connect({port: 60500});

  const text = process.argv.splice(2).join(' ');

  const message = {
    type: 'message',
    text: text,
  };

  client.write(JSON.stringify(message), (err) => {
    if (err) {
      console.log(`An error occurred sending the message to the server: ${err.message}`);
    } else {
      client.end();
    }
  });

  let response = '';
  client.on('data', (responseChunk) => {
    response += responseChunk;
  });

  client.on('end', () => {
    const jsonResponse = JSON.parse(response);
    if (jsonResponse.type == 'success') {
      console.log('The message was successfully written to the server');
    } else if (jsonResponse.type == 'err') {
      console.log('An error has occurred on the server:' + jsonResponse.description);
    }
  });

  client.on('error', (err) => {
    console.log(`An error occurred while establishing the connection: ${err.message}`);
  });
}