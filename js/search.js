//Retrieve all carpools based on the user input
var map;

async function getTrips(){
    var startLocation = document.getElementById("start_location").value.split(',');
    var stopLocation = document.getElementById("stop_location").value.split(',');
    var startTown = startLocation[1];
    var stopTown = stopLocation[1];
    var latitude = document.getElementById("start_latitude").value;
    var longitude = document.getElementById("stop_longitude").value;
    //var mark = {lat: latitude, lng: longitude};
    var mark;
    console.log(startLocation);
    var carpools = firebase.firestore().collection("Trips").where("StopTown", "==", stopTown).where("StartTown", "==", startTown).get();
    var resolved;
    carpools.catch(function(error){
        console.log(error);
        resolved=false;
    });
    carpools=await carpools;
    if(resolved==false)
      return null;
    //return carpools;
    return initMap(carpools, mark);
}



function initMap(carpools, mark) {
    var options = {
        zoom : 9,
        center: {
            lat: 10.6918, lng: -61.2225
        }
    }

  var heading = document.createElement("h2");
  var headingText = document.createTextNode("Search Results");
  var searchResults = document.querySelector('#searchResults');
  searchResults.appendChild(heading);
  heading.appendChild(headingText);
  map = new google.maps.Map(document.getElementById("map"), options);
  carpools.forEach(function(result){
    const contentString = "Driver's Name: "+ result.data().FirstName + '\n' + result.data().LastName +
    ' Available Seats: '+ result.data().AvailableSeats+
    ' Price: $'+ result.data().Price+
    ' Destination: '+ result.data().StopAddress + ', ' + result.data().StopTown;
    var node = document.createElement("p");
    var textnode = document.createTextNode(contentString);
    node.appendChild(textnode);
    searchResults.appendChild(node);
    //document.getElementById("searchResults").appendChild(node);
    

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
    });
    /*
    document.getElementById("searchResults").innerHTML = "Driver's Name: "+ result.data().FirstName + ' ' + result.data().LastName +
        ' Available Seats: '+ result.data().AvailableSeats+
        ' Price: $'+ result.data().Price+
        ' Destination: '+ result.data().Destination;
        */
    mark = new google.maps.LatLng(parseFloat(result.data().StartLat), parseFloat(result.data().StartLng));
    var marker = new google.maps.Marker({
        position: mark,
        map: map
    })
    marker.addListener("click", () => {
        infowindow.open(map, marker);
      });
});
var elem = document.getElementById("mapview"); 
                elem.scrollIntoView(); 
}
