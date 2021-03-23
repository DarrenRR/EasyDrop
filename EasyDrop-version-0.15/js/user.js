function getUser(callback){
  firebase.auth().onAuthStateChanged(
    function(user){
      callback(user);
    });
}