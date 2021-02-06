//Create user
async function createUser(email, password){ //, username, address, fName, lName, phoneNumber
  return firebase.auth().createUserWithEmailAndPassword(email, password);
}

//Sign in
async function signIn(email, password){
return firebase.auth().signInWithEmailAndPassword(email, password);
}

//Sign out
async function signOut(){
  return firebase.auth().signOut();
}
