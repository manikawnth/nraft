const zmq = require('zeromq');
const EventEmitter = require('events').EventEmitter;

const config = require('./config');

class Transporter extends EventEmitter{

  constructor(){
    super();
    this.__peers = {}
  }

  start(){
    const self = this;
    
    for (let server of config['servers']){
      let addr = `tcp://${server.ip}:${server.port}`;
      if(server.name == config['myname']){
        let socket = zmq.socket('rep');
        socket.bindSync(addr);

        socket.on('message', function(msg){
          let [topic, message] = JSON.parse(msg);
          self.emit(topic, message);
        })

      }
      else{
        let socket = zmq.socket('req');
        self.__peers[addr] = {
          socket,
          name: server.name,
          connected: false          
        };
        
        socket.on('connect', function(fd, ep) {
          self.__peers[addr]['connected'] = true;
        });
        socket.on('connect_delay', function(fd, ep) {
          self.__peers[addr]['connected'] = false;
        });
        socket.on('connect_retry', function(fd, ep) {
          self.__peers[addr]['connected'] = false;
        });
        socket.monitor(100, 0);
        socket.connect(addr);
      }
    }    
  }

  send(topic, msg){
    const self = this;
    const peers = self.__peers;
    for (let addr in peers){
      if (peers[addr]['connected']) peers[addr]['socket'].send(JSON.stringify([topic, msg]));
    }
  }
}
