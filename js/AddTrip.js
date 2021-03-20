// Your web app's Firebase configuration
// ====================== D  R  I  V  E  R  S DATABASE INFORMATION ==========================
let db=firebase.firestore();


var driverfname;
var driverlname;
var driveremailbox;
var drivercellbox;
var username;
var email;
var user;

//  Gets the current signed in user
firebase.auth().onAuthStateChanged((user) => {
    if (user){
        //  Gets the user's information from firestore
        email = user.email;
        console.log(email);
        const currUser = db.collection("users").where("email", "==", email).get().then((snapshot) => {
            snapshot.docs.forEach(result => {
                username = result.data().username;
                driverfname = result.data().firstName;
                driverlname = result.data().lastName;
                driveremailbox = result.data().email;
                drivercellbox = result.data().number;
            })
        })
        /*
        currUser.forEach(function(result){
            
        });
        */
    }
});

    




let driverseats =document.getElementById("seatsbox");
let driverprice =document.getElementById("pricebox");
let tripdate =document.getElementById("datebox");
let numberplate =document.getElementById("licensebox");
let driverdescription =document.getElementById("descriptionbox");





let tempDfname, tempDlname, tempDemail, tempDdate, tempDcell, tempDseats, tempDprice, tempDlicense, tempDdescription; 

function UpdateTrip(val, type){//this function updates the trip
    if (type=='fnameD') tempDfname=val;
    else if(type=='lnameD') tempDlname=val;
    else if(type=='emailD')  tempDemail=val;
    else if(type=='cellD') tempDcell=val;
    else if(type=='dateD') tempDdate=val;
    else if(type=='seatsD') tempDseats=val;
    else if(type=='priceD') tempDprice=val;
    else if(type=='plateD') tempDlicense=val;
    else if(type=='descriptionD') tempDdescription=val;
}


            // ------------ ADD DATA TO DB (works with forms only!) -----------------------
driverAddBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    //Splits the full address into address and town to help searching
    var fullStartAddress = document.getElementById("start_location").value.split(',');
    var fullStopAddress = document.getElementById("destination_input").value.split(',');
    console.log(fullStartAddress[0]);
    var startAddress = fullStartAddress[0];
    var startTown = fullStartAddress[1];
    var stopAddress = fullStopAddress[0];
    var stopTown = fullStopAddress[1];

    var id = Date.now().toString();                           
    //Assigns latitude and longitude for start and stop locations
    var startLatitude = document.getElementById("start_latitude").value;
    var startLongitude = document.getElementById("start_longitude").value;
    var stopLatitude = document.getElementById("stop_latitude").value;
    var stopLongitude = document.getElementById("stop_longitude").value;
    db.collection("Trips").doc(id).set({
        Username : username,
        FirstName: driverfname,
        LastName: driverlname, 
        Email: driveremailbox, 
        Cell: drivercellbox, 
        Date: tempDdate,
        AvailableSeats: tempDseats, 
        Price: tempDprice, 
        DriverLicense: tempDlicense,
        AdditionalNotes: tempDdescription,
        StartAddress : startAddress,
        StartTown : startTown,
        StartLat : startLatitude,
        StartLng : startLongitude,
        StopAddress : stopAddress,
        StopTown : stopTown,
        StopLat : stopLatitude,
        StopLng : stopLongitude,
    });
    alert("Your trip was successfully created!");
}); //adds data using the button
            
            // ------------ EDIT DATA SPECIFIED DB (works with forms only!)-----------------------
driverEditBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    
    const temp1={
        FirstName: tempDfname,
        LastName: tempDlname, 
        Cell: tempDcell, 
        Date: tempDdate,
        AvailableSeats: tempDseats, 
        Price: tempDprice, 
        DriverLicense: tempDlicense,
        AdditionalNotes: tempDdescription
    };
    db.collection("Trips").doc(tempDemail).update(temp1);
}); //edits data using the button 
            
            
            // ------------ DELETES DATA FROM DB (works with forms only!)-----------------------
            
driverDelBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    db.collection("Trips").doc(tempDemail).delete();
}); //deletes data using the button


function getUser(){
    firebase.auth().onAuthStateChanged(
      function(user){
        callback(user);
      });
  }
