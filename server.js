

class Server {
  constructor(){
    
    //role -> follower, candidate, leader
    this.role = 'f';

    //persistent state
    this.currentTerm = 0;
    this.votedFor = null;
    this.log = [];

    this.leader = null;
  }

  //On receipt of RPC messages
  onMessage(){

  }

  //Send periodic heartbeats - only by Leader
  sendHeartBeat(){

  }

  //begin election - only by followers and candidates
  beginElection(){

  }

  //request votes
  requestVotes(){

  }

  //election timeout - this function is called when the timeout occurs
  electionTimeout(){

  }
}