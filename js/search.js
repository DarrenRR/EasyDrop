//Retrieve all carpools based on the user input
async function getTrips(start_location, stop_location){
    var startLocation = document.getElementById("start_location").value;
    var stopLocation = document.getElementById("stop_location").value;
    console.log(startLocation);
    var carpools = firebase.firestore().collection("Trips").where("Destination", "==", stopLocation).where("Start", "==", startLocation).get();
    //var bookings=firebase.firestore().collection("bookings").where("tutor","==",user).get();  //firebase query function
    var resolved;
    carpools.catch(function(error){
        console.log(error);
        resolved=false;
    });
    carpools=await carpools;
    if(resolved==false)
      return null;
    carpools.forEach(function(result){
        console.log('$'+ result.data().Price + ', ' + result.data().AvailableSeats)
        document.getElementById("searchResults").innerHTML = "Driver's Name: "+ result.data().FirstName + ' ' + result.data().LastName +
        ' Available Seats: '+ result.data().AvailableSeats+
        ' Price: $'+ result.data().Price+
        ' Destination: '+ result.data().Destination;
    });
    return carpools;
}
