const db= firebase.firestore(); 

async function getPassengerList(thisID){
    var passengers = db.collection("Bookings").where("TripId", "==", thisID).where("Accepted", "==", true).get();
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

async function getURL(driver, waypoints){
    var src = "&origin=" + driver.data().StartLat + "," + driver.data().StartLng;
    var dest = "&destination=" + driver.data().StopLat + "," + driver.data().StopLng;

    var waypointsString = "&waypoints=";

    waypoints.forEach(function (waypoint) {
        if(waypoint.point === "start"){
            waypointsString += waypoint.start.latitude + "," + waypoint.start.longitude;
        }
        else if(waypoint.point === "stop"){
            waypointsString += waypoint.stop.latitude + "," + waypoint.stop.longitude;
            /*
            
            if(waypoints[waypoint.passengerNum].added == true){
                
            }
            else{

            }
            */

        }
        else if(waypoint.point === "center"){
            waypointsString += waypoint.center;
        }
        waypointsString += "%7C";
    });

    var link = "https://www.google.com/maps/dir/?api=1&travelmode=driving" + src + dest + waypointsString;
    console.log(link);
    return link;
    
}


async function getLocations(tripID){
    //var thisID = "1614915186664";
    console.log(tripID);
    var passengers = await getPassengerList(tripID);
    var driver = await getDriver(tripID);
    var passengersStart = [];
    var passengersStop = [];
    var passengerCount = 0;
    var waypoints = [];
    passengers.forEach(function(passenger){
        passengerCount += 1;
        passengersStart.push({point: "start", start: passenger.data().StartPoint, passengerNum: passengerCount, added : false, distance : getDistance(passenger.data().StartPoint, driver.data())});
        passengersStop.push({point: "stop", stop: passenger.data().StopPoint, passengerNum: passengerCount, added : false, distance : getDistance(passenger.data().StopPoint, driver.data())});
    });

    for(var i = 0; i < passengerCount; i++){
        console.log(passengersStart[i]);
        console.log(passengersStop[i]);
        waypoints.push(passengersStart[i]);
        waypoints.push(passengersStop[i]);
    }
    console.log(waypoints);
    waypoints.sort((a, b) => a.distance - b.distance);
    console.log(waypoints);

    var src = "&origin=" + driver.data().StartLat + "," + driver.data().StartLng;
    var dest = "&destination=" + driver.data().StopLat + "," + driver.data().StopLng;

    var waypointsString = "&waypoints=";

    waypoints.forEach(function (waypoint) {
        if(waypoint.point === "start"){
            waypointsString += waypoint.start.latitude + "," + waypoint.start.longitude;
        }
        else if(waypoint.point === "stop"){
            waypointsString += waypoint.stop.latitude + "," + waypoint.stop.longitude;
            /*
            
            if(waypoints[waypoint.passengerNum].added == true){
                
            }
            else{

            }
            */

        }
        
        
        waypointsString += "%7C";
    });

    var link = "https://www.google.com/maps/dir/?api=1&travelmode=driving" + src + dest + waypointsString;
    console.log(link);
    return link;
}

async function openNavigation(tripID){
    console.log("TripID =" + tripID);
    console.log(typeof tripID);
    var link = await getLocations(tripID);
    window.open(link, '_blank');
}

function getStart(passengerNum, waypoints){
    for(var waypoint in waypoints){
        if(waypoint.passengerNum === passengerNum && waypoint.point === "start"){
            return waypoint;
        }
    }
}

function getDistance(passengerPoint, driver){
    var passengerPosition = new google.maps.LatLng(passengerPoint.latitude, passengerPoint.longitude);
    var driverPosition = new google.maps.LatLng(driver.StartLat, driver.StartLng);
    var passengerDistance = google.maps.geometry.spherical.computeDistanceBetween (driverPosition, passengerPosition);
    return passengerDistance;
}

async function mutualPickup(tripID){
    var passengers = await getPassengerList(tripID);
    var pickupPoint = await getPassengerCenter(passengers);
    var waypoint;
    if(pickupPoint === 0){
        waypoint = [{point: "none"}];
    }
    else{
        waypoint = [{point: "center", center: pickupPoint.lat() +","+pickupPoint.lng()}];
    }
    var driver = await getDriver(tripID);
    var link = await getURL(driver, waypoint);
    window.open(link, '_blank');
}

async function getAvailableSeats(tripID){
    var currentPassengers;
    var tripPassengers;
    db.collection('Bookings').where("TripId" , "==", tripID).where("Accepted", "==", true).get().then(snapshot => {
        currentPassengers = snapshot.size;
        console.log(currentPassengers);
    })
    const trip = db.collection('Trips').doc(tripID);
    const doc = await trip.get();
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        console.log('Document data:', doc.data());
        tripPassengers = doc.data().AvailableSeats;
    }
    return(tripPassengers - currentPassengers);
}

db.collection('Bookings').where("TripId" , "==", "1615904834637").get().then(snapshot => {
    var size = snapshot.size;
    console.log(size);
})

async function getBookings(date, time){
    var bookings = db.collection("Bookings").where("TripId", "==", null).where("Date", "==", date).get();
    var resolved;
    bookings.catch(function(error){
        console.log(error);
        resolved = false;
    });
    bookings = await bookings;
    if(resolved == false)
        return null;
    return bookings;
}

function compare( a, b ) {
    if ( a.StartDistance < b.StartDistance ){
      return -1;
    }
    if ( a.StartDistance > b.StartDistance ){
      return 1;
    }
    return 0;
  }
  

function getCombinations(bookings, seats) {
    var combinations = [];

    for(var i = 0 ; i < bookings.length ; i++) {
        if(seats===1){
            combinations.push([bookings[i]]);
        }
        else {
            getCombinations(bookings.slice(i+1), seats-1).forEach(function(val) {
                combinations.push([].concat(bookings[i], val));
            });
        }
    }
    return combinations;
}

function getDuration(waypoints, start, stop, distances, leastDistance){
    var waypts = [];
    waypoints.forEach(function(waypoint){
        waypts.push({location: new google.maps.LatLng(waypoint.point.latitude, waypoint.point.longitude)})
    });

    var request = {
        origin : start,
        destination : stop,
        waypoints : waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
    };

    var duration;
    var distance = 0;
    var details = [];
    console.log(waypts);
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status){
        if(status == google.maps.DirectionsStatus.OK){
            var point = response.routes[ 0 ];
            var orders = response.routes[0].waypoint_order;
            var total = 0;
            for (let i = 0; i < point.legs.length; i++) {
                total += point.legs[i].distance.value;
            }
            setTimeout(function() {
                waypoints[waypts.length] = [(total/1000)];
                distance = (total/1000);
                if(distance < leastDistance){
                    leastDistance = distance;
                }
                waypoints[waypts.length+1] = orders;
                
                distances.push({tripDistance: (total/1000), order: orders});

                console.log(orders);
                return;
            }, 1000);
        }
    });
}

function getTripDistance(waypoint){
    return waypoint;
}

async function allocatePassengers(tripID){
    var numPassengers = await getAvailableSeats(tripID);
    if(numPassengers < 1){
        alert("Your trip is currently full. Please remove existing passengers if you would like to use this service.");
        return;
    }
    console.log("Available seats : " + numPassengers);
    var date, time, duration, start, stop;
    const trip = db.collection('Trips').doc(tripID);
    const doc = await trip.get();
    if (!doc.exists) {
        console.log('No such document!');
    } else {
        date = doc.data().Date;
        time = doc.data().StartTime;
        duration = doc.data().Duration;
        start = new google.maps.LatLng(parseFloat(doc.data().StartLat), parseFloat(doc.data().StartLng));
        stop = new google.maps.LatLng(parseFloat(doc.data().StopLat), parseFloat(doc.data().StopLng));
    }
    var allBookings = await getBookings(date, time);
    var bookings = [];
    var existingPassengers = await getPassengerList(tripID);
    var numExisting = 0;
    existingPassengers.forEach(function(passenger){
        numExisting++;
    });
    
    allBookings.forEach(function(booking){
        var tripStart = Date.parse('20 Aug 2000 '+time);
        var bookingTime = Date.parse('20 Aug 2000 '+booking.data().Time);
        var timeDifference = (bookingTime-tripStart)/60000;
        if((timeDifference <= duration) && (timeDifference >= 0) && (booking.data().Username != doc.data().Username)){
            onRoute(booking.data(), booking.id, doc.data(), bookings);
        }
    });
   
    console.log(bookings);
    setTimeout(function() {
        if(bookings.length == 0){
            alert("There are no passengers along your route currently.");
        }
        else if(bookings.length <= numPassengers){
            bookings.forEach(function(booking){
                const temp={
                    Accepted : true,
                    TripId : tripID
                };
                db.collection("Bookings").doc(booking.bookingID).update(temp);
            })
            alert("Passengers have been successfully allocated to your trip!");
        }
        else{
            bookings.sort( compare );
            //console.log(bookings);
            var combinations = getCombinations(bookings, numPassengers);
            var waypoints = new Array(combinations.length);
            for (var i = 0; i < waypoints.length; i++) {
                var size = (numExisting+numPassengers)*2
                waypoints[i] = new Array(size + 2);
            }
            var distances = [];
            var leastDistance = 9999999;

            setTimeout(function() {
            for(var i = 0; i < combinations.length; i++){
                var passengers = [];
                var pending = [];
                existingPassengers.forEach(function(passenger){
                    passengers.push({type: "start", point: passenger.data().StartPoint, distance: passenger.data().StartDistance, bookingID: passenger.data().bookingID});
                    passengers.push({type: "stop", point: passenger.data().StopPoint, distance: passenger.data().StopDistance, bookingID: passenger.data().bookingID});
                });
                for(var j = 0; j < combinations[i].length; j++){
                    pending.push({type: "start", point: combinations[i][j].StartPoint, distance: combinations[i][j].StartDistance, bookingID: combinations[i][j].bookingID});
                    pending.push({type: "stop", point: combinations[i][j].StopPoint, distance: combinations[i][j].StopDistance, bookingID: combinations[i][j].bookingID});
                }
                waypoints[i] = passengers.concat(pending);
                waypoints[i].sort(function (a, b) {
                    return a.distance - b.distance;
                });

                
                // Avoid Google Maps over query limit
                (function (i) {
                    setTimeout(function () {
                        getDuration(waypoints[i], start, stop, distances, leastDistance);
                        var test = getTripDistance(distances[i]);
                        wait = wait + 800;
                    }, i * 800);
                })(i);
            }
            var wait= combinations.length * 800;
            setTimeout(function () {
                waypoints.sort(function (a, b) {
                    return a[size] - b[size];
                });
                waypoints[0].forEach(function(point){
                    if(point.type === "start"){
                        const temp={
                            Accepted : true,
                            TripId : tripID
                        };
                        db.collection("Bookings").doc(point.bookingID).update(temp);
                    }
                })
                alert("Passengers have been successfully allocated to your trip!");
            }, wait);
            }, 1000);
        }
      }, 1000);
}

 function onRoute(booking, bookingID, trip, bookings){
    var start = new google.maps.LatLng(parseFloat(trip.StartLat), parseFloat(trip.StartLng));
    var stop = new google.maps.LatLng(parseFloat(trip.StopLat), parseFloat(trip.StopLng));
    
    var passengerStart = new google.maps.LatLng(parseFloat(booking.StartPoint.latitude), parseFloat(booking.StartPoint.longitude));
    var passengerStop = new google.maps.LatLng(parseFloat(booking.StopPoint.latitude), parseFloat(booking.StopPoint.longitude));

    var passengerBearing = google.maps.geometry.spherical.computeHeading(passengerStart,passengerStop);
    var tripBearing = google.maps.geometry.spherical.computeHeading(start,stop);
    


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

            
            if ((google.maps.geometry.poly.isLocationOnEdge(passengerStart, polyline, 0.02)) && (google.maps.geometry.poly.isLocationOnEdge(passengerStop, polyline, 0.02)) && (passengerBearing*tripBearing >0)){
                  console.log("On route for " +  start + ", " + stop);
                  booking.bookingID = bookingID;
                  booking.StartDistance = getDistance(booking.StartPoint, trip);
                  booking.StopDistance = getDistance(booking.StopPoint, trip);
                  bookings.push(booking);
            }
            else{
              console.log("Not on route for " + start + ", " + stop);
            }
        }
    });
    return;
}

    function redirect(row){
        var i = row.parentNode.rowIndex;
        var table= document.getElementById("myTable");
        var tripID= table.rows[i].cells[0].innerHTML;
        //alert(tripID);
        // window.location.href="CarpoolTripsInfo.html";
        
    }

    function renderTable(doc){
        let tbody=document.getElementById('requestsRender');
        let row=document.createElement('tr');
        let tripid=document.createElement('td');
        tripid.setAttribute("id", "tripidD");
        tripid.setAttribute("style", "color: black");
        tripid.setAttribute("onclick", "redirect(this)");

        /*
        let seats=document.createElement('p');
        seats.setAttribute("class", "seatClass");
        let seatList = document.getElementsByClassName("seatClass");         
        for (var i = 0; i < seatList.length; i++){
            seatList[i].setAttribute("id", "seatsD" + (i + 1));
        } 

        let price=document.createElement('p');
        price.setAttribute("id", "priceD");
        price.setAttribute("class", "priceClass");
        let priceList = document.getElementsByClassName("priceClass");         
        for (var i = 0; i < priceList.length; i++){
            priceList[i].setAttribute("id", "priceD" + (i + 1));
        } 

        let time=document.createElement('p');
        time.setAttribute("id", "timeD");
        time.setAttribute("class", "timeClass");

        let date=document.createElement('p');
        date.setAttribute("id", "dateD");


        l

        
        /*
        let edit=document.createElement('input');
        edit.setAttribute("type", "button");
        edit.setAttribute("value", "Edit");
        edit.setAttribute("class", "editClass");
        edit.setAttribute("onclick", "editRow(this)");
        let editList = document.getElementsByClassName("editClass");         
        for (var i = 0; i < editList.length; i++){
            editList[i].setAttribute("id", "driverEditBtn" + (i + 1));
        }           
        
        let delete1=document.createElement('input');
        delete1.setAttribute("type", "button");
        delete1.setAttribute("value", "Delete");
        delete1.setAttribute("class", "decisions");
        delete1.setAttribute("onclick", "deleteRow(this)");

        let save=document.createElement('input');
        save.setAttribute("type", "button");
        save.setAttribute("value", "Save");
        save.setAttribute("class", "saveClass");
        save.setAttribute("onclick", "saveRow(this)");
        let saveList = document.getElementsByClassName("saveClass");         
        for (var i = 0; i < saveList.length; i++){
            saveList[i].setAttribute("id", "driverSaveBtn" + (i + 1));
        }

        */
        let start=document.createElement('td');
        start.setAttribute("id", "dateD");

        let destination=document.createElement('td');
        destination.setAttribute("id", "destinationD");

        let navigate=document.createElement('input');
        navigate.setAttribute("type", "button");
        navigate.setAttribute("value", "Shortest Route");
        navigate.setAttribute("class", "decisions");
        navigate.setAttribute('onclick', 'openNavigation("'+doc.id+'")');

        let mutual=document.createElement('input');
        mutual.setAttribute("type", "button");
        mutual.setAttribute("value", "Mutual Pickup");
        mutual.setAttribute("class", "decisions");
        mutual.setAttribute('onclick', 'mutualPickup("'+doc.id+'")');

        let allocate=document.createElement('input');
        allocate.setAttribute("type", "button");
        allocate.setAttribute("value", "Allocate Passengers");
        allocate.setAttribute("class", "decisions");
        allocate.setAttribute('onclick', 'allocatePassengers("'+doc.id+'")');

        let bookings=document.createElement('input');
        bookings.setAttribute("type", "button");
        bookings.setAttribute("value", "View Bookings");
        bookings.setAttribute("onclick", "getBookingstable(this)");
        bookings.setAttribute("class", "decisions");
        bookings.setAttribute("data-toggle", "modal");
        bookings.setAttribute("data-target", "#bookingsModal");

        let passengers=document.createElement('input');
        passengers.setAttribute("type", "button");
        passengers.setAttribute("value", "View Passengers");
        passengers.setAttribute("onclick", "getPassengersTable(this)");
        passengers.setAttribute("class", "decisions");
        passengers.setAttribute("data-toggle", "modal");
        passengers.setAttribute("data-target", "#passengersModal");
        
        
// ==========================================================//
        row.setAttribute("id", doc.id);
        tripid.innerHTML = doc.id;
        //seats.innerHTML = doc.data().AvailableSeats;
        let seats = doc.data().AvailableSeats;
        let time = doc.data().StartTime;
        let date = doc.data().Date;
        let price = doc.data().Price;
        // email.innerHTML = doc.data().Email;
        
        start.innerHTML = doc.data().StartAddress + ', ' + doc.data().StartTown;
        
        destination.innerHTML = doc.data().StopAddress + ', ' + doc.data().StopTown;

        let details = document.createElement('td');
        let allDetails = document.createElement('p');
        allDetails.innerHTML = "Seats: " + seats + "</br>" + time + "</br>" + date  + "</br>" + "Price: $" + price;
        details.appendChild(allDetails);
        /*
        edit.innerHTML = doc.data().Edit;//THIS IS TO BE A BUTTON
        delete1.innerHTML = doc.data().Delete;//THIS IS TO BE A BUTTON
        */
// ==========================================================//
        row.appendChild(tripid);
        row.appendChild(details);
        /*
        row.appendChild(seats);
        row.appendChild(price);
        row.appendChild(time);
        
        // row.appendChild(email);
        row.appendChild(date);
        */
        row.appendChild(start);
        row.appendChild(destination);
        /*
        row.appendChild(edit);
        row.appendChild(delete1);
        row.appendChild(save);
        */
        row.appendChild(navigate);
        row.appendChild(mutual);
        row.appendChild(allocate);
        row.appendChild(bookings);
        row.appendChild(passengers);
        tbody.appendChild(row);
// ==========================================================//    
    }

    

    //===============Code edited from www.w3schools.com - No Copyright============ 
    function deleteRow(row) { 
        var i = row.parentNode.rowIndex;
        document.getElementById("myTable").deleteRow(i);

        document.addEventListener('click', (e) =>{
            e.preventDefault();
            let id=e.target.parentElement.getAttribute('id');
            db.collection("Trips").doc(id).delete();
        });
    }
    //===============Code edited from www.w3schools.com - No Copyright============ 

        
    function editRow(row) { //Code inspired from http://www.talkerscode.com/webtricks/add-edit-and-delete-rows-from-table-dynamically-using-javascript.php
        var i = row.parentNode.rowIndex;
            //alert("Row index is: " + i);
            let seats=document.getElementById("seatsD"+i);
            let price=document.getElementById("priceD"+i);
            
            
            var pricedata = price.innerHTML;
            var seatsdata = seats.innerHTML;
    
            //================================= DISPLAYS A INPUT BOX =================================
            // date.innerHTML="<input type='text' id='dateEditBtn"+i+"' value='"+datedata+"'>";
            // start.innerHTML="<input type='text' id='startEditBtn"+i+"' value='"+startdata+"'>";
            // destination.innerHTML="<input type='text' id='destinationEditBtn"+i+"' value='"+destinationdata+"'>";
            price.innerHTML="<input type='text' id='priceEditBtn"+i+"' value='"+pricedata+"'>";
            seats.innerHTML="<input type='text' id='seatsEditBtn"+i+"' value='"+seatsdata+"'>"; 
       
    } 

    function saveRow(row){
        //================================= SAVE DATE FROM THE INPUT BOX TO SCREEN=================================
        var i = row.parentNode.rowIndex;
        var priceEdit = document.getElementById("priceEditBtn"+i);
        var seatsEdit = document.getElementById("seatsEditBtn"+i);
        var priceValue;
        var seatsValue;
        var currentPrice;
        var currentSeats;
        if(priceEdit){
            priceValue = priceEdit.value;
        }
        if(seatsEdit){
            seatsValue = seatsEdit.value;
        }
        var priceValue=document.getElementById("priceEditBtn"+i).value;
        var seatsValue=document.getElementById("seatsEditBtn"+i).value;
        
        document.getElementById("priceD"+i).innerHTML=priceValue;
        document.getElementById("seatsD"+i).innerHTML=seatsValue;
        
        document.addEventListener('click', (e) =>{
            e.preventDefault();
            let id=e.target.parentElement.getAttribute('id');
            
            console.log(id);
            db.collection('Trips').doc(id).get().then((snapshot) => { //
                    currentPrice = snapshot.data().Price;
                    currentSeats = snapshot.data().AvailableSeats;
            })
            if(priceValue == null){
                priceValue = currentPrice;
            }
            if(seatsValue == null){
                seatsValue = currentSeats;
            }
            console.log(priceValue);
            console.log(seatsValue);
            const temp1={ 
                AvailableSeats: seatsValue, 
                Price: priceValue
            };
            db.collection("Trips").doc(id).update(temp1);
        });
        return;
    }


    
    async function sendAcceptanceEmail(row) {
        var i = row.parentNode.parentNode.rowIndex;
        var table= document.getElementById("myBookingsTable"); 
        var username= table.rows[i].cells[1].innerHTML;
        var tripID= table.rows[i].cells[0].innerHTML;
        var bookingID = tripID.trim() + username.trim();
        var userEmail;
        const userBooking = db.collection('Bookings').doc(bookingID);
        const doc = await userBooking.get();
        const trip = db.collection('Trips').doc(tripID.trim());
        const tripDoc = await trip.get();
        var driver = tripDoc.data().Username;
        var emailBody = "" + driver + " has accepted your request to join Trip: " + tripID + ".\n";
        emailBody += "Please check your account for details.";
        userEmail = doc.data().Email;
        console.log(email);
        doc.ref.update({Accepted : true});
        Email.send({
            Host: "smtp.gmail.com",
            Username:  "info3604project@gmail.com",
            Password: "wtdumcvolgoxaush", 
            To: userEmail,
            From: email,
            Subject: "EasyDrop",
            Body: emailBody
        }).then(
                message => console.log("Mail sent successfully")
            );
        var userRow = document.getElementById(bookingID);
        userRow.remove();
          /*  
        db.collection("Bookings").where("Username", "==", username.trim()).where("TripId", "==", tripID.trim()).get().then((snapshot) =>{
            snapshot.docs.forEach(doc => {
                    console.log("Hello");
                   
                       
                            
            });       
        });      
        */
        
    }
    
    async function sendDeclineEmail(row) {
        var i = row.parentNode.parentNode.rowIndex;
        var table= document.getElementById("myBookingsTable"); 
        var username= table.rows[i].cells[1].innerHTML;
        var tripID= table.rows[i].cells[0].innerHTML;
        var bookingID = tripID.trim() + username.trim();
        var userEmail;
        const userBooking = db.collection('Bookings').doc(bookingID);
        const doc = await userBooking.get();
        const trip = db.collection('Trips').doc(tripID.trim());
        const tripDoc = await trip.get();
        var driver = tripDoc.data().Username;
        userEmail = doc.data().Email;
        var userRow = document.getElementById(bookingID);
        var reason = prompt("Reason: ");
        var emailBody = "" + driver + " has declined your request to join <br> Trip: " + tripID + ".\n";
        emailBody += "Reason: " + reason;
        Email.send({
            Host: "smtp.gmail.com",
            Username:  "info3604project@gmail.com",
            Password: "wtdumcvolgoxaush", 
            To: userEmail,
            From: email,
            Subject: "EasyDrop",
            Body: emailBody
        }).then(
                message => console.log("Mail sent successfully")
        );        
        userRow.remove();
        doc.ref.delete();
    }



    function renderpassengerTable(doc){
        let tbody=document.getElementById('passengerRequests');
        let row=document.createElement('tr');
        let tripid=document.createElement('td');
        tripid.setAttribute("id", "passengertripid");

        let lname=document.createElement('td');
        lname.setAttribute("id", "passengerlname");

        let fname=document.createElement('td');
        fname.setAttribute("id", "passengerfname");

        let username = document.createElement('td');
        username.setAttribute("id", "passengerusername");

        let startloc=document.createElement('td');
        startloc.setAttribute("id", "passengerstartloc");

        let stoploc=document.createElement('td');
        stoploc.setAttribute("id", "passengerstoploc");

        let decisionButtons = document.createElement('td');
        
        
        let accept=document.createElement('input');
        accept.setAttribute("type", "button");
        accept.setAttribute("value", "Accept");
        accept.setAttribute("id", "acceptBtn");
        accept.setAttribute("class", "decisions-2");
        accept.setAttribute("onclick", "sendAcceptanceEmail(this)");

        let decline=document.createElement('input');
        decline.setAttribute("type", "button");
        decline.setAttribute("value", "Decline");
        decline.setAttribute("class", "decisions-2");
        decline.setAttribute("onclick", "sendDeclineEmail(this)");
        
        decisionButtons.appendChild(accept);
        decisionButtons.appendChild(decline);
// ==========================================================//
        row.setAttribute("id", doc.id);
        tripid.innerHTML = doc.data().TripId;
        fname.innerHTML = doc.data().FirstName;
        lname.innerHTML = doc.data().LastName;
        username.innerHTML = doc.data().Username;
        startloc.innerHTML = doc.data().StartLocation;
        stoploc.innerHTML = doc.data().StopLocation;
// ==========================================================//
       
        // formtd.appendChild(form);
        row.appendChild(tripid);        
        row.appendChild(fname);
        row.appendChild(lname);
        row.appendChild(username);
        row.appendChild(startloc);
        row.appendChild(stoploc);
        row.appendChild(decisionButtons);
        //row.appendChild(accept);
        //row.appendChild(decline);
        tbody.appendChild(row);
        
// ==========================================================//        
    }

    function renderAcceptedPassengers(doc){
        //$("#acceptedRequests").empty();
        let tbody=document.getElementById('acceptedRequests');
        let row=document.createElement('tr');
        let tripid=document.createElement('td');
        let lname=document.createElement('td');
        let fname=document.createElement('td');
        let username=document.createElement('td');
        let startloc=document.createElement('td');
        let stoploc=document.createElement('td');
// ==========================================================//
        row.setAttribute("id", doc.id);
        tripid.innerHTML = doc.data().TripId;
        fname.innerHTML = doc.data().FirstName;
        lname.innerHTML = doc.data().LastName;
        username.innerHTML = doc.data().Username;
        startloc.innerHTML = doc.data().StartLocation;
        stoploc.innerHTML = doc.data().StopLocation;
// ==========================================================//
        row.appendChild(tripid);
        row.appendChild(fname);
        row.appendChild(lname);
        row.appendChild(username);
        row.appendChild(startloc);
        row.appendChild(stoploc);
        tbody.appendChild(row);
// ==========================================================//    
    }

    //===============Code edited from www.w3schools.com - No Copyright============
    function declinePassenger(row) { 
        var i = row.parentNode.parentNode.rowIndex;
        document.getElementById("mypassengerTable").deleteRow(i);

        document.addEventListener('click', (e) =>{
            e.preventDefault();
            let id=e.target.parentElement.getAttribute('id');
            db.collection("Bookings").doc(id).delete();
        });
    }
    function addPassenger(row){
        console.log("addPassenger");
        var i = row.parentNode.parentNode.rowIndex;
        var tripID = document.getElementById("passengertripid").innerText;
        var username = document.getElementById("passengerusername").innerText;
        var bookingID = tripID + username;
        //alert(bookingID);
        var StartPoint, StopPoint;

        const data={
            TripId: document.getElementById("passengertripid").innerText,
            FirstName: document.getElementById("passengerfname").innerText,
            LastName: document.getElementById("passengerlname").innerText,
            StartLocation: document.getElementById("passengerstartloc").innerText,
            StopLocation: document.getElementById("passengerstoploc").innerText,
            StartPoint: "",
            StopPoint: ""
        }

        setTimeout(function(){
            db.collection('Bookings').doc(bookingID).get().then((snapshot) => { //
                StartPoint = snapshot.data().StartPoint;
                StopPoint = snapshot.data().StopPoint;
                data.StartPoint = StartPoint;
                data.StopPoint = StopPoint;
            })
        }, 1000)
        console.log(bookingID);

        console.log(data);
        
        //document.getElementById("mypassengerTable").deleteRow(i);
        document.addEventListener('click', (e) =>{
            e.preventDefault();
            db.collection("Bookings").doc(bookingID).update({Accepted : true});
            document.getElementById("mypassengerTable").deleteRow(i);
            
            // db.collection("Reserved").doc(id).set(data);
        });

        
    }

    

    //===============Code edited from www.w3schools.com - No Copyright============
    var email;
    var username;
    var passengerFName;
    var passengerLName;
    var passengerStart;
    var passengerStop;
    var tripID;
// ============================= Renders only the user information ================================

    firebase.auth().onAuthStateChanged((user) => {
        if (user){
            //  Gets the user's information from firestore
            email = user.email;
            console.log(email);
            
            const currUser = db.collection("users").where("Email", "==", email).get().then((snapshot) => {
                snapshot.docs.forEach(result => {
                    username = result.data().username;
                    /*
                    driverfname = result.data().firstName;
                    driverlname = result.data().lastName;
                    
                    driveremailbox = result.data().email;
                    drivercellbox = result.data().number;
                    */
                })
            })
            db.collection("Trips").where("Email", "==", email).get().then((snapshot) =>{
                snapshot.docs.forEach(doc => {
                    renderTable(doc);// when a use logs in, all his/her sharedtrips appears here
                    /*
                    db.collection("Bookings").where("Accepted", "==", false).where("TripId", "==", doc.id).get().then((snapshot2) => {
                        snapshot2.docs.forEach(doc2 => {
                            renderpassengerTable(doc2); //when a user request to reserve a seat in logged in user carpool, it goes here
                        })
                    })
                    db.collection("Bookings").where("TripId", "==", doc.id).where("Accepted", "==", true).get().then((snapshot3) => { //
                        snapshot3.docs.forEach(doc3 => {
                            renderAcceptedPassengers(doc3);// when a logged in user accepts a request, it appears here
                        })
                    })
                    */    
                });
               
            });
            db.collection("Bookings").where("Email", "==", email).get().then((snapshot4) => { //
                snapshot4.docs.forEach(doc4 => {
                    if(doc4.data().TripId != null){
                        rendermyTrips(doc4);// shows logged in user trips 
                    }
                })
            })
            
        }
    });

    function getBookingstable(row){
        var i = row.parentNode.rowIndex;
        var table= document.getElementById("myTable"); 
        var getTripId= table.rows[i].cells[0].innerHTML;
        console.log(getTripId);
        var table = document.getElementById("myBookingsTable");
        if(table != null){
            table.remove();
        }
        document.getElementById('bookingsRender').innerHTML= `
                <div class="panel panel-default">
                <div class="panel-heading">
                  <h4 class="panel-title">
                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">Bookings</a>
                  </h4>
                </div>
                <div id="collapse2" class="panel-collapse collapse">
                  <div class="panel-body">
                    <table class="table table-hover" id="myBookingsTable"> 
                        <thead class="thead-dark">
                        <tr style="background-color:white">
                            <th scope="col">Trip Id</th>
                            <th scope="col">Username</th>
                            <th scope="col">Passenger</th>
                            <th scope="row">Start Location</th>
                            <th scope="row">Stop Location</th>
                            <th id = "decisionsCol" scope="row">Decision</th>
                        </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                    </table>
                  </div>
                </div>
              </div> `;
        db.collection("Bookings").where("Accepted", "==", false).where("TripId", "==", getTripId).get().then((snapshot) =>{
            snapshot.docs.forEach(doc => {
                $('#myBookingsTable').find('tbody').append(`<tr id="${doc.id}">
                <td id="passengertripid"> ${doc.data().TripId}</td>
                <td id="passengerusername"> ${doc.data().Username}</td>
                <td id="passengerfname"> ${doc.data().FirstName + " " + doc.data().LastName}</td>
                <td id="passengerstartloc"> ${doc.data().StartLocation}</td>
                <td id="passengerstoploc"> ${doc.data().StopLocation}</td>
                <td><input type="button" value="Accept" id="acceptBtn" class="decisions-2" onclick="sendAcceptanceEmail(this)"></td>
                <td><input type="button" value="Decline" class="decisions-2" onclick="sendDeclineEmail(this)"></td>
            <tr>`);
            });
        });
        
    }

    async function sendRemovalEmail(row) {
        var i = row.parentNode.parentNode.rowIndex;
        var table= document.getElementById("myPassengersTable"); 
        var username= table.rows[i].cells[1].innerHTML;
        var tripID= table.rows[i].cells[0].innerHTML;
        var bookingID = tripID.trim() + username.trim();
        var userEmail;
        const userBooking = db.collection('Bookings').doc(bookingID);
        const doc = await userBooking.get();
        const trip = db.collection('Trips').doc(tripID.trim());
        const tripDoc = await trip.get();
        var driver = tripDoc.data().Username;
        userEmail = doc.data().Email;
        var userRow = document.getElementById(bookingID);
        userRow.remove();
        var reason = prompt("Reason: ");
        var emailBody = "" + driver + " has removed you from <br> Trip: " + tripID + ".\n";
        emailBody += "Reason: " + reason;
        Email.send({
            Host: "smtp.gmail.com",
            Username:  "info3604project@gmail.com",
            Password: "wtdumcvolgoxaush", 
            To: userEmail,
            From: email,
            Subject: "EasyDrop",
            Body: emailBody
        }).then(
                message => console.log("Mail sent successfully")
        );        
        doc.ref.delete();
    }

    async function getPassengersTable(row){
        var i = row.parentNode.rowIndex;
        var table= document.getElementById("myTable"); 
        var getTripId= table.rows[i].cells[0].innerHTML;
        console.log(getTripId);
        var table = document.getElementById("myPassengersTable");
        if(table != null){
            table.remove();
        }
        document.getElementById('passengersRender').innerHTML= `
                <div class="panel panel-default">
                <div class="panel-heading">
                  <h4 class="panel-title">
                    <a data-toggle="collapse" data-parent="#accordion" href="#collapsePassenger">Passengers</a>
                  </h4>
                </div>
                <div id="collapsePassenger" class="panel-collapse collapse">
                  <div class="panel-body">
                    <table class="table table-hover" id="myPassengersTable"> 
                        <thead class="thead-dark">
                        <tr style="background-color:white">
                            <th scope="col">Trip Id</th>
                            <th scope="col">Username</th>
                            <th scope="col">Passenger</th>
                            <th scope="row">Start Location</th>
                            <th scope="row">Stop Location</th>
                            <th id = "decisionsCol" scope="row">Decision</th>
                        </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                    </table>
                  </div>
                </div>
              </div> `;

        var passengers = await getPassengerList(getTripId);
        passengers.forEach(function(passenger){
            console.log(passenger.data().Username);
            $('#myPassengersTable').find('tbody').append(`<tr id="${passenger.data().bookingID}">
                <td id="passengertripid"> ${passenger.data().TripId}</td>
                <td id="passengerusername"> ${passenger.data().Username}</td>
                <td id="passengerfname"> ${passenger.data().FirstName + " " + passenger.data().LastName}</td>
                <td id="passengerstartloc"> ${passenger.data().StartLocation}</td>
                <td id="passengerstoploc"> ${passenger.data().StopLocation}</td>
                <td><input type="button" value="Remove" class="decisions-2" onclick="sendRemovalEmail(this)"></td>
            <tr>`);
        })
        /*
        db.collection("Bookings").where("Accepted", "==", true).where("TripId", "==", getTripId).get().then((snapshot) =>{
            snapshot.docs.forEach(doc => {
                $('#myPassengersTable').find('tbody').append(`<tr id="${doc.id}">
                <td id="passengertripid"> ${doc.data().TripId}</td>
                <td id="passengerusername"> ${doc.data().Username}</td>
                <td id="passengerfname"> ${doc.data().FirstName + " " + doc.data().LastName}</td>
                <td id="passengerstartloc"> ${doc.data().StartLocation}</td>
                <td id="passengerstoploc"> ${doc.data().StopLocation}</td>
                <td><input type="button" value="Accept" id="acceptBtn" class="decisions-2" onclick="sendAcceptanceEmail(this)"></td>
                <td><input type="button" value="Decline" class="decisions-2" onclick="sendDeclineEmail(this)"></td>
            <tr>`);
            });
        });
        */
        
        
    }

    async function getDriverData(username){
        const driverRef = db.collection('users').doc(username);
        const doc2 = await driverRef.get();
        return doc2.data();
          /*
        var driver = db.collection('users').doc(username).get();
        var resolved;
        driver.catch(function(error){
            console.log(error);
            resolved = false;
        });
        driver = await driver;
        if(resolved == false)
            return null;
        return driver;
        */
      }

      async function getTrip(tripID){
        const tripRef = db.collection('Trips').doc(tripID);
        const doc2 = await tripRef.get();
        return doc2.data();
          /*
        var driver = db.collection('users').doc(username).get();
        var resolved;
        driver.catch(function(error){
            console.log(error);
            resolved = false;
        });
        driver = await driver;
        if(resolved == false)
            return null;
        return driver;
        */
      }

    function shareInfo(tripInfo){
        console.log(tripInfo);
        //console.log(tripInfo);
        document.getElementById("tripInfo").innerHTML = tripInfo;
    }

    async function deleteMyBooking(bookingID){
        var table= document.getElementById("myCurrentBookings"); 
        var userEmail;
        const userBooking = db.collection('Bookings').doc(bookingID);
        const doc = await userBooking.get();
        userEmail = doc.data().Email;
        var userRow = document.getElementById(bookingID);
        userRow.remove();  
        doc.ref.delete();
    }

    async function rendermyTrips(doc){
        let tripID = doc.data().TripId;
        let driverUsername = doc.data().Username;
        var passengers = await getPassengerList(tripID);
        var trip = await getTrip(tripID);
        var driver = await getDriverData(trip.Username);
        var driverInfo = "Driver: " + driver.firstName + " " + driver.lastName + "<br/>";
        var passengersInfo = "Passengers: " + "<br/>";
        passengers.forEach(function(passenger){
            passengersInfo += passenger.data().FirstName + " " + passenger.data().LastName + "<br/>";
        })

        var tripInfo = "Trip Start: " + trip.StartAddress + "<br/>";
        tripInfo += "Trip Destination: " + trip.StopAddress + "<br/>";
        tripInfo += "License Plate: " + trip.NumberPlate + "<br/>";
        tripInfo += "Car: " + trip.AdditionalNotes + "<br/>";
        tripInfo += "Date: " + trip.Date + "<br/>";
        tripInfo += "Start Time: " + trip.StartTime + "<br/>";
        tripInfo += driverInfo + passengersInfo;
        console.log(tripInfo);
        
        let tbody=document.getElementById('myCurrentBookings');
        let row=document.createElement('tr');
        let tripid=document.createElement('td');
        let startloc=document.createElement('td');
        let stoploc=document.createElement('td');
        let status=document.createElement('td');
        let icon=document.createElement('i');
        
        let share=document.createElement('input');
        share.setAttribute("type", "button");
        share.setAttribute("value", "View Info");
        share.addEventListener("click", function() {
            shareInfo(tripInfo);
        }, false);
        share.setAttribute("data-toggle", "modal");
        share.setAttribute("data-target", "#tripInfoModal");
        share.setAttribute("class", "decisions");

        let deleteButton=document.createElement('input');
        deleteButton.setAttribute("type", "button");
        deleteButton.setAttribute("value", "Delete");
        deleteButton.setAttribute('onclick', 'deleteMyBooking("'+doc.id+'")');
        deleteButton.setAttribute("class", "decisions");
// ==========================================================//
        row.setAttribute("id", doc.id);
        tripid.innerHTML = doc.data().TripId;
        startloc.innerHTML = doc.data().StartLocation;
        stoploc.innerHTML = doc.data().StopLocation;
        var bookingStatus;
        if(doc.data().Accepted == false){
            bookingStatus = "Pending";
        }
        else{
            bookingStatus = "Accepted";
        }
        status.innerHTML = bookingStatus;
       
// ==========================================================//
        row.appendChild(tripid);        
        //row.appendChild(fname);
        //row.appendChild(lname);
        //row.appendChild(date);
        row.appendChild(startloc);
        row.appendChild(stoploc);
        row.appendChild(status);
        row.appendChild(deleteButton);
        row.appendChild(share);
        tbody.appendChild(row);
// ==========================================================//        
    }

    async function rendermyDrops(doc){
        let tripID = doc.data().TripId;
        if(tripID.length === 0){
            tripID = "Request";
        }
        let driverUsername = doc.data().Username;
        var passengers = await getPassengerList(tripID);
        var driver = await getDriverData(driverUsername);
        var trip = await getTrip(tripID);
        var driverInfo = "Driver: \n";
        driverInfo += driver.firstName + " " + driver.lastName + "\n";
        var passengersInfo = "Passengers: \n";
        passengers.forEach(function(passenger){
            passengersInfo += passenger.data().FirstName + " " + passenger.data().LastName + "\n";
        })
        var tripInfo = "Trip Start: " + trip.StartAddress + "\n";
        tripInfo += "Trip Destination: " + trip.StopAddress + "\n";
        tripInfo += driverInfo + passengersInfo;
        console.log(tripInfo);
        let tbody=document.getElementById('myTrips');
        let row=document.createElement('tr');
        let tripid=document.createElement('td');
        //let lname=document.createElement('td');
        //let fname=document.createElement('td');
        //let date=document.createElement('td');
        let startloc=document.createElement('td');
        let stoploc=document.createElement('td');
        let status=document.createElement('td');
        let share=document.createElement('input');
        share.setAttribute("type", "button");
        share.setAttribute("value", "View Info");
        share.setAttribute('onclick', 'shareInfo("'+tripInfo+'")');

        let deleteButton=document.createElement('input');
        deleteButton.setAttribute("type", "button");
        deleteButton.setAttribute("value", "Delete");
        deleteButton.setAttribute("onclick", "deleteMyBooking(this)");
// ==========================================================//
        row.setAttribute("data-id", doc.id);
        tripid.innerHTML = doc.data().TripId;
        //fname.innerHTML = doc.data().FirstName;
        //lname.innerHTML = doc.data().LastName;
        //date.innerHTML = doc.data().Date;
        startloc.innerHTML = doc.data().StartLocation;
        stoploc.innerHTML = doc.data().StopLocation;
        var bookingStatus;
        if(doc.data().Accepted == false){
            bookingStatus = "Pending";
        }
        else{
            bookingStatus = "Accepted";
        }
        status.innerHTML = bookingStatus;
       
// ==========================================================//
        row.appendChild(tripid);        
        //row.appendChild(fname);
        //row.appendChild(lname);
        //row.appendChild(date);
        row.appendChild(startloc);
        row.appendChild(stoploc);
        row.appendChild(status);
        tbody.appendChild(row);
// ==========================================================//        
}