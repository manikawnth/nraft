const net = require('net');

/**
 * Transporter is the underlying network transporter for the raft system
 * It is completely disconnected with core raft protocol
 * The main purpose of the transporter system is simple:
 * 1. to send the data when asked to send
 * 2. emit an event, when it receives the data
 */
class Transporter extends net.Server {
  constructor(host, port){
    super();
    this._options = {
        host,
        port,
        exclusive: true
    }
    this._sockets = {};
    this._name = "myserver";
  }

  start (){
    const server = this;
    server.listen(server._options);

    server.on('error', (err)=>{
      //do nothing
      console.log("Error occured");
    })

    server.on('close', ()=>{

    })

    server.on('listening', ()=>{
      console.log(`server listening on ${server._options.port}`);
    })

    server.on('connection', (socket)=>{
      console.log("Connection accepted by " + this._name);
      server._sockets[socket] = {};

      socket.on('close', onSocketClose);
      socket.on('error', onSocketError);
      socket.on('data', onSocketData);
    })
  }

  send(message){
    const server = this;
    for(let socket in server._sockets){
      socket.write(message, 'utf8')
    }
  }
}

function onSocketClose(){
  console.log("Socket closed");
}

function onSocketError(err){
  console.log("Error occured");
}

function onSocketData(data){
  console.log(data.toString());
}

const myport = parseInt(process.argv[2]);
const yourport = parseInt(process.argv[3]);

const t1 = new Transporter('localhost', myport);
t1.start();

