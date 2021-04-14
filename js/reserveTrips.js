let db=firebase.firestore();
var userEmail;
var username;
var firstName;
var lastName;


firebase.auth().onAuthStateChanged((user) => {
    if (user){
        userEmail = user.email;
        const currUser = db.collection("users").where("email", "==", userEmail).get().then((snapshot) => {
            snapshot.docs.forEach(result => {
                username = result.data().username;
                firstName = result.data().firstName;
                lastName = result.data().lastName;
            })
        })
    }
});

function testFunction(){
    alert("test");
}


function getDistance(passengerPoint, driver){
    var passengerPosition = new google.maps.LatLng(passengerPoint.latitude, passengerPoint.longitude);
    var driverPosition = new google.maps.LatLng(driver.StartLat, driver.StartLng);
    var passengerDistance = google.maps.geometry.spherical.computeDistanceBetween (driverPosition, passengerPosition);
    return passengerDistance;
  }



async function reserveSeat(tripID, date, time, start, stop, startLat, startLng, stopLat, stopLng){

    
    var StartPoint = new firebase.firestore.GeoPoint(startLat, startLng);
    var StopPoint = new firebase.firestore.GeoPoint(stopLat, stopLng);
    
    if(tripID === null){
        var bookingID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        db.collection("Bookings").doc(bookingID).set({
            Username : username,
            FirstName: firstName,
            LastName: lastName,
            Email: userEmail,
            StartLocation: start,
            StopLocation:  stop,
            StartPoint: StartPoint,
            StopPoint: StopPoint,
            TripId: tripID,
            Accepted: false,
            Date: date,
            Time: time,
            bookingID: bookingID,
        });
        
        alert("Your request has been submitted! Please wait as we try to allocate you to a drop."); 
    }
    else{
            const trip = db.collection('Trips').doc(tripID);
            const doc = await trip.get();
            if (!doc.exists) {
                console.log('No such document!');
            } else {
                
            }
            var StartDistance = getDistance(StartPoint, doc.data());
            var StopDistance = getDistance(StopPoint, doc.data());
            var bookingID = tripID + username;
            var booking = db.collection("Bookings").doc(bookingID);
            booking.get().then(function(doc){
                if(doc.exists){
                    alert("You have already registered for this Carpool!");
                }
                else{
                    db.collection("Bookings").doc(bookingID).set({
                        Username : username,
                        FirstName: firstName,
                        LastName: lastName,
                        Email: userEmail,
                        StartLocation: start,
                        StopLocation:  stop,
                        StartPoint: StartPoint,
                        StopPoint: StopPoint,
                        StartDistance: StartDistance,
                        StopDistance: StopDistance,
                        TripId: tripID,
                        Accepted: false,
                        bookingID: bookingID,
                    });
                    alert("Reservation successful! Please await confirmation from the driver."); 
                    //window.location.href = "manageTripsandPassengers.html";  
                }
            }).catch(function(error){
                console.log("Error retrieving booking: ", error);
            });
    }
    
    /*
    booking.get().then(function(doc){
        if(doc.exists){
            alert("You have already registered for this Carpool!");
        }
        else{
            db.collection("Bookings").doc(bookingID).set({
                Username : username,
                FirstName: firstName,
                LastName: lastName,
                StartLocation: start,
                StopLocation:  stop,
                TripId: tripID,
                Accepted: false,
            });  
            window.location.href = "manageTripsandPassengers.html";  
        }
    }).catch(function(error){
        console.log("Error retrieving booking: ", error);
    });
    */
}
