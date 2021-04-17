var username;
var isVerified = false;
var submittedDocuments = false;

//  Gets the current signed in user
firebase.auth().onAuthStateChanged((user) => {
  var info = document.getElementsByClassName('bg-2');
  var accessMessage = document.getElementById('accessMessage');
  if (user){
      var email = user.email;
      //  Gets the user's information from firestore
      const currUser = db.collection("users").where("email", "==", email).get().then((snapshot) => {
          snapshot.docs.forEach(result => { 
              isVerified = result.data().isVerified;
              submittedDocuments = result.data().submittedDocuments;
            /*
              if(result.data().isVerified === false){
                  info[0].style.display = 'block';
                  if(result.data().submittedDDocuments === false){
                      accessMessage.innerHTML = "Please await verification before you can access this page.";

                  }
                  else{
                      accessMessage.innerHTML = "Please verify your account before you can access this page.";
                  }
              }
              else{
                  username = result.data().username;
                  var info = document.getElementsByClassName('bg-1');
                  info[0].style.display = 'block';
              }
              */
        
          })
      })
  }
  else{
      window.location="login.html";
  }
});

//Retrieve all carpools based on the user input
var map;
var startLocation;
var stopLocation;

var startLat;
var startLng;
var stopLat;
var stopLng;

var passengerStart;
var passengerStop;

var date, time;

var drop, startIcon, stopIcon, best;

async function getPassengers(tripID){
  var passengers = db.collection("Bookings").where("TripId", "==", tripID).where("Accepted", "==", true).get();
  var resolved;
  passengers.catch(function(error){
      console.log(error);
      resolved = false;
  });
  passengers = await passengers;
  if(resolved == false)
      return null;
  return passengers;
}



async function getDriver(tripID){
  var driver = db.collection('Trips').doc(tripID).get();
  var resolved;
  driver.catch(function(error){
      console.log(error);
      resolved = false;
  });
  driver = await driver;
  if(resolved == false)
      return null;
  return driver;
}

async function getData(){
    startLocation = document.getElementById("start_location").value;
    stopLocation = document.getElementById("stop_location").value;
    var startTown = startLocation[1];
    var stopTown = stopLocation[1];

    startLat = document.getElementById("start_latitude").value;
    startLng = document.getElementById("start_longitude").value;
    stopLat = document.getElementById("stop_latitude").value;
    stopLng = document.getElementById("stop_longitude").value;
    passengerStart = new google.maps.LatLng(startLat, startLng);
    passengerStop = new google.maps.LatLng(stopLat, stopLng);

    date = document.getElementById("date").value;
    time = document.getElementById("timepicker").value;
}


async function getTrips(){
    if(submittedDocuments === false && isVerified === false){
        alert("Please verify your account to gain access to this feature.");
    }
    else if(submittedDocuments === true && isVerified === false ){
        alert("Your documents are currently being verified. Please await verification before accessing this feature.");
    }
    else{
        getData();
        var date = document.getElementById("date").value;
        var mark;
        var carpools = firebase.firestore().collection("Trips").where("Date", "==", date).get();
        var resolved;
        carpools.catch(function(error){
            console.log(error);
            resolved=false;
        });
        carpools=await carpools;
        if(resolved==false)
          return null;
      

        drop = {
          url: "images/drop.png", // url
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };

        startIcon = {
          url: "images/start.jpg", // url
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };

        stopIcon = {
          url: "images/stop.png", // url
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };

        best = {
          url: "images/best.png", // url
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        }

        return initMap(carpools, mark, passengerStart);
      }
}



 function initMap(carpools, mark, passengerStart) {
        var options = {
            zoom : 18,
            center: {
                lat: 10.6918, lng: -61.2225
            }
        }

        var markers = [];
        var infoWindows = [];
        var mapMarkers = [];

        

        var heading = document.createElement("h2");
        var headingText = document.createTextNode("Search Results");
        var searchResults = document.querySelector('#searchResults');
        searchResults.appendChild(heading);
        heading.appendChild(headingText);
        map = new google.maps.Map(document.getElementById("map"), options);
        var directionsDisplay = new google.maps.DirectionsRenderer({
          suppressMarkers: true,
          });
          
        

        var startMarker = new google.maps.Marker({
          position : passengerStart,
          map: map,
          icon: startIcon
        })

        var stopMarker = new google.maps.Marker({
          position : passengerStop,
          map: map,
          icon: stopIcon
        })




        


        carpools.forEach(function(result){ 
                      var tripStart = Date.parse('20 Aug 2000 '+result.data().StartTime);
                      var bookingTime = Date.parse('20 Aug 2000 '+time);
                      var timeDifference = (bookingTime-tripStart)/60000;
                      if((username != result.data().Username) && (timeDifference <= result.data().Duration) && (timeDifference >= 0)){
                        
                        var tripID = result.id;
                        const contentString = "Trip ID: " + result.id + '<br />' +
                        " Driver's Name: "+ result.data().FirstName  + ' ' + result.data().LastName +  '<br />' +
                        " Available Seats: " + result.data().AvailableSeats+ '<br />' +
                        " Price: $"+ result.data().Price+ '<br />' +
                        "Destination: " + result.data().StopAddress + ", " + result.data().StopTown + '<br />' +
                        '<input type="button" onclick="reserveSeat(\''+tripID+'\',\''+date+'\',\''+time+'\',\''+startLocation+'\',\''+stopLocation+'\',\''+startLat+'\',\''+startLng+'\',\''+stopLat+'\',\''+stopLng+'\');" value="Reserve"></input>';//"<input type='button', name='Reserve', value='Reserve', onclick='reserveSeat("+result+startLocation+stopLocation,")', id='NearbyEditButton'>"; //<button onclick="reserveSeat(result, startLocation, stopLocation)">Reserve a Seat</button>';//'<button type="button" class="btn btn-primary" onclick="#">Book a Seat</button>';
                        
                        
                        inRoute(directionsDisplay, result, contentString, markers, infoWindows, passengerStart);
                      }
        });
        
        

        var length;
        var hasResults = false;
        setTimeout(function(){
            var bestResult = 99999999999999;
            length = markers.length;
            for(let i = 0; i < length; i++){

                

                mapMarkers.push(new google.maps.Marker({
                  position: markers[i].start,
                  map: map,
                  icon: drop
                }));
                
                markers[i].shortest.then(function(result){
                  if(result < bestResult){
                    bestResult = result;
                  }
                });
            }


          


          length = markers.length;
          if(length !== 0){
              hasResults = true;
              for(let i = 0; i < length; i++){

                    markers[i].shortest.then(function(result){
                      if(result=== bestResult){
                        //mapMarkers[i].setIcon(best);
                        map.panTo(mapMarkers[i].position);
                        infoWindows[i].open(map, mapMarkers[i]);
                        new google.maps.event.trigger( mapMarkers[i], 'click' );
                      }
                    });

                    
                    
                    
                    mapMarkers[i].addListener("click", () => {
                      closeWindows(length, infoWindows);
                      infoWindows[i].open(map, mapMarkers[i]);
                      calculateAndDisplayRoute(directionsDisplay, markers[i]);
                    });
            
                    google.maps.event.addListener(map, 'mouseout', function(){
                      infoWindows[i].close();
                    });
            
                    google.maps.event.addListener(map, "click", function(event) {
                      infoWindows[i].close();
                    });
              }
          }

          if(hasResults === true){
            var mapView = document.getElementById("mapview");
            mapView.style.display = "block";
            mapView.scrollIntoView();
        }
        else{
            alert("There are no drops related to your search criteria. Try searching for something else or submit your request.");
        }
        }, 500);
}

function submitRequest(){
  if(submittedDocuments === false && isVerified === false){
    alert("Please verify your account to gain access to this feature.");
  }
  else if(submittedDocuments === true && isVerified === false ){
      alert("Your documents are currently being verified. Please await verification before accessing this feature.");
  }
  else{
      getData();
      reserveSeat(null, date, time, startLocation, stopLocation, startLat, startLng, stopLat, stopLng);
  }
}

function closeWindows(length, infoWindows){
      for(let i = 0; i < length; i++){
          infoWindows[i].close();
      }
}



async function getPassengerCenter(passengers){
      if(passengers.size === 0){
          return 0;
      }
      var bound = new google.maps.LatLngBounds();
      passengers.forEach(function(passenger){
          var passengerPosition = passenger.data().StartPoint;
          bound.extend(new google.maps.LatLng(passengerPosition.latitude, passengerPosition.longitude));
      });

      var passengersCenter = bound.getCenter();
      return passengersCenter;
}

async function getPassengerStopCenter(passengers){
  if(passengers.size === 0){
      return 0;
  }
  var bound = new google.maps.LatLngBounds();
  passengers.forEach(function(passenger){
      var passengerPosition = passenger.data().StopPoint;
      bound.extend(new google.maps.LatLng(passengerPosition.latitude, passengerPosition.longitude));
  });

  var passengersCenter = bound.getCenter();
  return passengersCenter;
}


async function getShortest(tripID, passengerStart){
      var bound = new google.maps.LatLngBounds();
      var locations = [];

      var passengers = await getPassengers(tripID);
      
      passengers.forEach(function(passenger){
            var passengerPosition = passenger.data().StartPoint;
            bound.extend(new google.maps.LatLng(passengerPosition.latitude, passengerPosition.longitude));
      });
  
      var passengersCenter = bound.getCenter();

      var driver = await getDriver(tripID);
      var driverPosition = new google.maps.LatLng(driver.data().StartLat, driver.data().StartLng);
      var driverDistance = google.maps.geometry.spherical.computeDistanceBetween (passengerStart, driverPosition);
      var passengerDistance = google.maps.geometry.spherical.computeDistanceBetween (passengerStart, passengersCenter);

   
      if(driverDistance < passengerDistance){
        return driverDistance;
      }
      else{
        return passengerDistance;
      }
}




function calculateAndDisplayRoute(directionsDisplay, result) {
    var start = result.start;
    var stop = result.stop;

    
    directionsDisplay.setMap(map);

    var request = {
        origin : start,
        destination : stop,
        travelMode: google.maps.TravelMode.DRIVING
    };

    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status){
        if(status == google.maps.DirectionsStatus.OK){
            directionsDisplay.setDirections(response);
        }
    });
}
  
  function inRoute(directionsDisplay, result, contentString, markers, infoWindows, passengerStart){
          var start = new google.maps.LatLng(parseFloat(result.data().StartLat), parseFloat(result.data().StartLng));
          var stop = new google.maps.LatLng(parseFloat(result.data().StopLat), parseFloat(result.data().StopLng));


          var request = {
              origin : start,
              destination : stop,
              travelMode: google.maps.TravelMode.DRIVING
          };

          var directionsService = new google.maps.DirectionsService();
          directionsService.route(request, function(response, status){
              if(status == google.maps.DirectionsStatus.OK){
  

                  // Check if on route
                  var polyline = google.maps.geometry.encoding.decodePath(response.routes[0].overview_polyline);
            
                  polyline = new google.maps.Polyline({path: polyline});


                  if ((google.maps.geometry.poly.isLocationOnEdge(passengerStart, polyline, 0.02)) && (google.maps.geometry.poly.isLocationOnEdge(passengerStop, polyline, 0.02))){
                        markers.push({ contentString: contentString, start: start, stop: stop, shortest: getShortest(result.id, passengerStart)});
                        infoWindows.push(new google.maps.InfoWindow({
                          content: contentString,
                        }));
                  }
              }
          });
          return;
  }




  async function getAvailableSeats(tripID){
    var currentPassengers;
    var tripPassengers;
    db.collection('Bookings').where("TripId" , "==", tripID).where("Accepted", "==", true).get().then(snapshot => {
        currentPassengers = snapshot.size;
    })
    const trip = db.collection('Trips').doc(tripID);
    const doc = await trip.get();
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        tripPassengers = doc.data().AvailableSeats;
    }
    return(tripPassengers - currentPassengers);
}

