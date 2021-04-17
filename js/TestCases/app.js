// User SignIn
module.exports= {
  signInUser: async function (email, password){
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
  },

  runSignIn: async function (){
    var email=document.getElementById("email").value;
    var password=document.getElementById("password").value;
    var success=await signInUser(email, password);
    if(success){
      //alert("Login successful");
      window.location.href="index.html";
    }
  },


  signupUser: async function (username, firstName, lastName, email, password, number, address, town, latitude, longitude){
    var result=createUser(email, password);
    result.catch(function(error){
    alert(error);
    });

    await result;

    var signed=await firebase.auth().currentUser;
    if(signed){  
    alert("Registered");
    await setUpUserDoc(username, firstName, lastName, email, number, address, town, latitude, longitude);  
    return true;
    }
    alert("Could not register");
    return false;
  },
  setUpUserDoc: async function (username, firstName, lastName, email, number, address, town, latitude, longitude){
    return firebase.firestore().collection("users").doc(username)
      .set({
          username : username,
          firstName : firstName,
          lastName : lastName,
          email : email,
          number : number,
          address : address,
          town : town,
          addressLat : latitude,
          addressLong : longitude
      });
  }

}
  

