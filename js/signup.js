//Register User
async function signupUser(username, firstName, lastName, email, password, number, address, town, latitude, longitude){
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
  }
  
  //Registers a user using the values from the input boxes then redirects to homepage
  async function runSignupUser(){
    var username = document.getElementById("username").value;
    var firstName = document.getElementById("fName").value;
    var lastName = document.getElementById("lName").value;
    var email=document.getElementById("email").value;
    var password=document.getElementById("password").value;
    var number=document.getElementById("number").value;
    var fullAddress = document.getElementById("search_input").value.split(',');
    if(checkAddress(fullAddress) && checkUsername(username)){
      var address = fullAddress[0];
      var town = fullAddress[1];
      var latitude = document.getElementById("latitude").value;
      var longitude = document.getElementById("longitude").value;
      var success=await signupUser(username, firstName, lastName, email, password, number, address, town, latitude, longitude);
      if(success){
        window.location.href="index.html";
      }
    }
  }
  

  
  //Store a user's information on firebase
  async function setUpUserDoc(username, firstName, lastName, email, number, address, town, latitude, longitude){
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
          addressLong : longitude,
          isVerified : false,
          submittedDocuments : false,
          isDriver : false,
      });
  }

  async function test(){
    alert("Test");
  }

  function checkUsername(username){
    /*
    var usernames = firebase.firestore().collection("users").where("username", "==", username).get();
    if (usernames.length != 0){
      alert("Username taken. Please try another username");
      return false;
    }
    return true;
    */
    return true;
  }

  function checkAddress(fullAddress){
    if(fullAddress.length != 3){
      alert("Please enter a valid residential address");
      return false;
    }
    return true;
  }
  

  
 
  

  
  
  