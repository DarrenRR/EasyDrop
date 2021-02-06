//Register User
async function signupUser(email, password){
    var result=createUser(email, password);
    result.catch(function(error){
    alert(error);
    });

    await result;

    var signed=await firebase.auth().currentUser;
    if(signed){  //Check to see if the user has correctly signed in
    alert("Registered");
    await setUpUserDoc(email);  //set up a user's document
    return true;
    }
    alert("Could not register");
    return false;
  }
  
  //Registers a user using the values from the input boxes then redirects to homepage
  async function runSignupUser(){
    var email=document.getElementById("email").value;
    var password=document.getElementById("password").value;
    var success=await signupUser(email, password);
    if(success){
      alert("Success");
    }
  }
  

  
  //Store a user's information on firebase
  async function setUpUserDoc(email){
    return firebase.firestore().collection("users").doc(email)
      .set({
          userType:"user"
      });
  }
  
 
  

  
  
  