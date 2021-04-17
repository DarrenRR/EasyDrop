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
var isVerified = false;
var submittedDocuments = false;



//  Gets the current signed in user
firebase.auth().onAuthStateChanged((user) => {
    var info = document.getElementsByClassName('bg-2');
    var accessMessage = document.getElementById('accessMessage');
    if (user){
        //  Gets the user's information from firestore
        email = user.email;

        
        
        const currUser = db.collection("users").where("email", "==", email).get().then((snapshot) => {
            snapshot.docs.forEach(result => {
                username = result.data().username;
                driverfname = result.data().firstName;
                driverlname = result.data().lastName;
                driveremailbox = result.data().email;
                drivercellbox = result.data().number;
                isVerified = result.data().isVerified;
                submittedDocuments = result.data().submittedDocuments;
            })
        })
    }
    else{
        window.location="login.html";
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


function getDurationandDistance(start, stop){
    var request = {
        origin : start,
        destination : stop,
        travelMode: google.maps.TravelMode.DRIVING
    };

    var duration = 0;
    var distance = 0;

    var details = {distance : null, duration: null};

    var directionsService = new google.maps.DirectionsService();
    setTimeout(function(){
    directionsService.route(request, function(response, status){
        if(status == google.maps.DirectionsStatus.OK){
            var point = response.routes[ 0 ].legs[ 0 ];
            duration = (point.duration.value/60)*1.75;
            distance = point.distance.text;
            details.distance = distance;
            details.duration = duration;
            //details.push({duration: duration, distance: distance});
        }
    });
    }, 1000)
    return details;
}

function validateForm(){
    let driverseats =document.getElementById("seatsbox");
    let driverprice =document.getElementById("pricebox");
    let tripdate =document.getElementById("datebox");
    let numberplate =document.getElementById("licensebox");
    let driverdescription =document.getElementById("descriptionbox");
}

async function addTrip(){
    var filled = true;
    var time = document.getElementById("timepicker").value;
    if(submittedDocuments === false && isVerified === false){
        alert("Please verify your account to gain access to this feature.");
    }
    else if(submittedDocuments === true && isVerified === false ){
        alert("Your documents are currently being verified. Please await verification before accessing this feature.");
    }
    else{
        var fields = [tempDdate, tempDseats, tempDprice, tempDlicense, tempDdescription];
        fields.forEach(function(element){
            if(typeof(element) === "undefined"){
                filled = false;
            }
            else{
                if(Object.keys(element).length == 0){
                    filled = false;
                }
            }
        })

        if(filled){
            var correctTypes = true;
            var errorMessage = "";
            var numbers = /^[0-9]+$/;
            if(tempDseats.match(numbers) && tempDseats.length > 0){

            }
            else{
                errorMessage += "Please enter a number for your available seats. \n";
                correctTypes = false;
            }
            if(tempDprice.match(numbers)){

            }
            else{
                errorMessage += "Please enter a number only for your price. \n";
                correctTypes = false;
            }
            if(time.length !== 8){
                correctTypes = false;
                errorMessage += "Please enter a valid time. \n";
            }
            if(tempDdate.length !== 10){
                correctTypes = false;
                errorMessage += "Please enter a valid date. \n";
            }
            if(correctTypes){
                //Splits the full address into address and town to help searching
                var fullStartAddress = document.getElementById("start_location").value.split(',');
                var fullStopAddress = document.getElementById("destination_input").value.split(',');
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

                var start = new google.maps.LatLng(parseFloat(startLatitude), parseFloat(startLongitude));
                var stop = new google.maps.LatLng(parseFloat(stopLatitude), parseFloat(stopLongitude));

                
                var details = getDurationandDistance(start, stop);
                setTimeout(function(){

                    
                    db.collection("Trips").doc(id).set({
                        Username : username,
                        FirstName: driverfname,
                        LastName: driverlname, 
                        Email: driveremailbox, 
                        Cell: drivercellbox, 
                        Date: tempDdate,
                        AvailableSeats: tempDseats, 
                        Price: tempDprice, 
                        NumberPlate: tempDlicense,
                        AdditionalNotes: tempDdescription,
                        StartAddress : startAddress,
                        StartTown : startTown,
                        StartLat : startLatitude,
                        StartLng : startLongitude,
                        StopAddress : stopAddress,
                        StopTown : stopTown,
                        StopLat : stopLatitude,
                        StopLng : stopLongitude,
                        StartTime : time,
                        Distance: details.distance,
                        Duration: details.duration,
                        isFull: false,
                    });
                }, 3000);
                alert("Your trip was successfully created!");
            }
            else{
                alert(errorMessage);
            }
        }
        else{
            alert("Please fill out all fields before adding your trip.");
        }
    }
}

