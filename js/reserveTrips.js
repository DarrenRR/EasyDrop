let db=firebase.firestore();
var userEmail;
var username;
var firstName;
var lastName;


firebase.auth().onAuthStateChanged((user) => {
    if (user){
        userEmail = user.email;
        console.log(userEmail);
        const currUser = db.collection("users").where("email", "==", userEmail).get().then((snapshot) => {
            snapshot.docs.forEach(result => {
                username = result.data().username;
                firstName = result.data().firstName;
                lastName = result.data().lastName;
            })
        })
    }
});


function reserveSeat(tripID, start, stop, startLat, startLng, stopLat, stopLng){
    console.log("In Reserve");
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
                StartPoint: new firebase.firestore.GeoPoint(startLat, startLng),
                StopPoint: new firebase.firestore.GeoPoint(stopLat, stopLng),
                TripId: tripID,
                Accepted: false,
            });
            alert("Reservation successful! Please await confirmation from the driver.") 
            //window.location.href = "manageTripsandPassengers.html";  
        }
    }).catch(function(error){
        console.log("Error retrieving booking: ", error);
    });
    
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
