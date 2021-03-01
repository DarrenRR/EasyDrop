let db=firebase.firestore();
var userEmail;
var username;
var firstName;
var lastName;

var tripID;

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


function reserveSeat(carpool, start, stop){
    tripID = carpool.id;
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
                StartLocation: start,
                StopLocation:  stop,
                TripId: tripID,
                Accepted: false,
            });    
        }
    }).catch(function(error){
        console.log("Error retrieving booking: ", error);
    });
}
