//Register User
async function signupUser(username, firstName, lastName, email, password, number, address, latitude, longitude){
    var result=createUser(email, password);
    result.catch(function(error){
    alert(error);
    });

    await result;

    var signed=await firebase.auth().currentUser;
    if(signed){  
    alert("Registered");
    await setUpUserDoc(username, firstName, lastName, email, number, address, latitude, longitude);  
    return true;
    }
    alert("Could not register");
    return false;
  }
  
  //Registers a user using the values from the input boxes then redirects to homepage
  async function runSignupUser(){
    alert("runSignup");
    var username = document.getElementById("username").value;
    var firstName = document.getElementById("fName").value;
    var lastName = document.getElementById("lName").value;
    var email=document.getElementById("email").value;
    var password=document.getElementById("password").value;
    var number=document.getElementById("number").value;
    var address = document.getElementById("search_input").value;
    var latitude = document.getElementById("latitude").value;
    var longitude = document.getElementById("longitude").value;
    var success=await signupUser(username, firstName, lastName, email, password, number, address, latitude, longitude);
    if(success){
      window.location.href="index.html";
    }
    window.load
  }
  

  
  //Store a user's information on firebase
  async function setUpUserDoc(username, firstName, lastName, email, number, address, latitude, longitude){
    return firebase.firestore().collection("users").doc(username)
      .set({
          firstName : firstName,
          lastName : lastName,
          email : email,
          number : number,
          address : address,
          addressLat : latitude,
          addressLong : longitude
      });
  }

  async function test(){
    alert("Test");
  }
  

  
 
  

  
  
  