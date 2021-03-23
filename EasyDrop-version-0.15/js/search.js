

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


async function getTrips(){
    startLocation = document.getElementById("start_location").value.split(',');
    stopLocation = document.getElementById("stop_location").value.split(',');
    var startTown = startLocation[1];
    var stopTown = stopLocation[1];

    startLat = document.getElementById("start_latitude").value;
    startLng = document.getElementById("start_longitude").value;
    stopLat = document.getElementById("stop_latitude").value;
    stopLng = document.getElementById("stop_longitude").value;
    passengerStart = new google.maps.LatLng(startLat, startLng);
    passengerStop = new google.maps.LatLng(stopLat, stopLng);
    var date = document.getElementById("date").value;
    //var mark = {lat: latitude, lng: longitude};
    var mark;
    console.log(startLocation);
    //var carpools = firebase.firestore().collection("Trips").where("StopTown", "==", stopTown).where("StartTown", "==", startTown).where("Date", "==", date).get();
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


        /*
        var testPosition;
        var tester;

        db.collection('Bookings').doc("1615232752547bensmith").get().then((snapshot) => { //
          testPosition = snapshot.data().StartPoint;
          tester =  new google.maps.LatLng(testPosition.latitude, testPosition.longitude);
          var testMarker = new google.maps.Marker({
            position : tester,
            map: map,
            icon: startIcon
          })
        })

        */

        


        carpools.forEach(function(result){ 

                    var tripID = result.id;
                    const contentString = "Trip ID: " + result.id + '<br />' +
                    " Driver's Name: "+ result.data().FirstName  + ' ' + result.data().LastName +  '<br />' +
                    " Available Seats: " + result.data().AvailableSeats+ '<br />' +
                    " Price: $"+ result.data().Price+ '<br />' +
                    "Destination: " + result.data().StopAddress + ", " + result.data().StopTown + '<br />' +
                    '<input type="button" onclick="reserveSeat('+tripID+'\',\''+startLocation+'\',\''+stopLocation+'\',\''+startLat+'\',\''+startLng+'\',\''+stopLat+'\',\''+stopLng+'\');" value="Reserve">';
                    
                    
                    inRoute(directionsDisplay, result, contentString, markers, infoWindows, passengerStart);
                
                
                    
     
        });
        
        

        console.log(markers);
        var length;
        setTimeout(function(){
            var bestResult = 99999999999999;
            length = markers.length;
            for(let i = 0; i < length; i++){
                console.log(markers[i].contentString);
                

                mapMarkers.push(new google.maps.Marker({
                  position: markers[i].start,
                  map: map,
                  icon: drop
                }));
                
                markers[i].shortest.then(function(result){
                  console.log(result);
                  console.log(bestResult);
                  if(result < bestResult){
                    bestResult = result;
                  }
                });
            }

          
          console.log("best result: " + bestResult);




          length = markers.length;
          for(let i = 0; i < length; i++){

                markers[i].shortest.then(function(result){
                  if(result=== bestResult){
                    mapMarkers[i].setIcon(best);
                    map.panTo(mapMarkers[i].position);
                    console.log(result);
                  }
                });

                
                
                
                mapMarkers[i].addListener("click", () => {
                  closeWindows(length, infoWindows);
                  infoWindows[i].open(map, mapMarkers[i]);
                  //map.panTo(mapMarkers[i].position);
                  //infowindow.open(map, marker);
                  calculateAndDisplayRoute(directionsDisplay, markers[i]);
                });
        
                google.maps.event.addListener(map, 'mouseout', function(){
                  infoWindows[i].close();
                });
        
                google.maps.event.addListener(map, "click", function(event) {
                  infoWindows[i].close();
                });
          }

        }, 1000);




        //setTimeout(function(){
          
      //}, 1000)
        
        var mapView = document.getElementById("mapview");
        mapView.style.display = "block";
        mapView.scrollIntoView();
}

function closeWindows(length, infoWindows){
      for(let i = 0; i < length; i++){
          infoWindows[i].close();
      }
}


async function getShortest(tripID, passengerStart){
      var bound = new google.maps.LatLngBounds();
      var locations = [];

      var passengers = await getPassengers(tripID);
      
      passengers.forEach(function(passenger){
            var passengerPosition = passenger.data().StartPoint;
            console.log("Passengers: " + passengerPosition.latitude);
            bound.extend(new google.maps.LatLng(passengerPosition.latitude, passengerPosition.longitude));
      });
  
      var passengersCenter = bound.getCenter();


      /*

      db.collection("Bookings").where("TripId", "==", tripID).where("Accepted", "==", true).get().then((snapshot) => { //
        snapshot.docs.forEach(doc => {
            var passengerPosition = doc.data().StartPoint;
            console.log(passengerPosition.latitude);
            bound.extend(new google.maps.LatLng(passengerPosition.latitude, passengerPosition.longitude));
        })
      })

      */

      var driver = await getDriver(tripID);
      var driverPosition = new google.maps.LatLng(driver.data().StartLat, driver.data().StartLng);
      var driverDistance = google.maps.geometry.spherical.computeDistanceBetween (passengerStart, driverPosition);
      var passengerDistance = google.maps.geometry.spherical.computeDistanceBetween (passengerStart, passengersCenter);

      console.log("Driver distance: " + driverDistance);
      console.log("Passenger distance: " + passengerDistance);
      if(driverDistance < passengerDistance){
        console.log("Driver");
        return driverDistance;
      }
      else{
        console.log("Passenger");
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

          
          //directionsDisplay.setMap(map);

          var request = {
              origin : start,
              destination : stop,
              travelMode: google.maps.TravelMode.DRIVING
          };

          var directionsService = new google.maps.DirectionsService();
          directionsService.route(request, function(response, status){
              if(status == google.maps.DirectionsStatus.OK){
                  //directionsDisplay.setDirections(response);

                  // Check if on route
                  var polyline = google.maps.geometry.encoding.decodePath(response.routes[0].overview_polyline);
            
                  polyline = new google.maps.Polyline({path: polyline});


                  //console.log(passengerStart, passengerStop);

                  if ((google.maps.geometry.poly.isLocationOnEdge(passengerStart, polyline, 0.02)) && (google.maps.geometry.poly.isLocationOnEdge(passengerStop, polyline, 0.02))){
                        console.log("On route for " +  start + ", " + stop);

                        markers.push({ contentString: contentString, start: start, stop: stop, shortest: getShortest(result.id, passengerStart)});
                        infoWindows.push(new google.maps.InfoWindow({
                          content: contentString,
                        }));
                        /*
                        var marker = new google.maps.Marker({
                            position: start,
                            map: map,
                            icon: drop
                        })
                        
                        
                        google.maps.event.addListener(marker,'mouseover', (function(marker,infowindow){ 
                          return function() {
                            //infowindow.setContent(contentString);
                            infowindow.open(map,marker);
                            calculateAndDisplayRoute(directionsDisplay, result);
                          };
                        })(marker, infowindow));
                        

                        google.maps.event.addListener(infowindow, 'mouseout', (function(marker, infowindow){
                            return function(){
                              infowindow.close(map, marker);
                            };
                          
                        })(marker, infowindow));

                        marker.addListener("click", () => {
                          infowindow.open(map, marker);
                          calculateAndDisplayRoute(directionsDisplay, result);
                        });
                        */


                  }
                  else{
                    console.log("Not on route for " + start + ", " + stop);
                  }
              }
          });
          return;
  }