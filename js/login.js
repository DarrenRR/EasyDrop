// User SignIn
async function signInUser(email, password){
    var result=signIn(email, password);
    result.catch(function(error){  
      alert(error);
    });
    await result;
    var signed=await firebase.auth().currentUser;
    if(signed){     //check to see if the user has properly signed in
      alert("Signed in");
      return true;
    }
    alert("Could not sign in");
    return false;
  }
  

  async function runSignIn(){
    var email=document.getElementById("email").value;
    var password=document.getElementById("password").value;
    var success=await signInUser(email, password);
    if(success){
      alert("Login successful");
    }
  }