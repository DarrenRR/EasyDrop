const db= firebase.firestore(); 

    function renderTable(doc){
        let tbody=document.getElementById('requestsRender');
        let row=document.createElement('tr');
        let tripid=document.createElement('td');
        tripid.setAttribute("id", "tripidD");
        // let email=document.createElement('td');
        let seats=document.createElement('td');
        seats.setAttribute("id", "seatsD");

        let price=document.createElement('td');
        price.setAttribute("id", "priceD");

        let time=document.createElement('td');
        time.setAttribute("id", "timeD");

        let date=document.createElement('td');
        date.setAttribute("id", "dateD");

        let destination=document.createElement('td');
        destination.setAttribute("id", "destinationD");

        let edit=document.createElement('input');
        edit.setAttribute("type", "button");
        edit.setAttribute("value", "Edit");
        edit.setAttribute("id", "driverEditBtn");
        edit.setAttribute("class", "decisions");
        edit.setAttribute("onclick", "editRow(this)");

        let delete1=document.createElement('input');
        delete1.setAttribute("type", "button");
        delete1.setAttribute("value", "Delete");
        delete1.setAttribute("class", "decisions");
        delete1.setAttribute("onclick", "deleteRow(this)");

        let save=document.createElement('input');
        save.setAttribute("type", "button");
        save.setAttribute("value", "Save");
        save.setAttribute("class", "decisions");
        save.setAttribute("onclick", "saveRow(this)");
        
// ==========================================================//
        row.setAttribute("id", doc.id);
        tripid.innerHTML = doc.id;
        seats.innerHTML = doc.data().AvailableSeats;
        price.innerHTML = doc.data().Price;
        // email.innerHTML = doc.data().Email;
        time.innerHTML = doc.data().Date;
        date.innerHTML = doc.data().StartAddress + ', ' + doc.data().StartTown;
        destination.innerHTML = doc.data().StopAddress + ', ' + doc.data().StopTown;
        edit.innerHTML = doc.data().Edit;//THIS IS TO BE A BUTTON
        delete1.innerHTML = doc.data().Delete;//THIS IS TO BE A BUTTON
// ==========================================================//
        row.appendChild(tripid);
        row.appendChild(seats);
        row.appendChild(price);
        row.appendChild(time);
        // row.appendChild(email);
        row.appendChild(date);
        row.appendChild(destination);
        row.appendChild(edit);
        row.appendChild(delete1);
        row.appendChild(save);
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
        var test=document.getElementById("driverEditBtn");
        //let tripid=document.getElementById("tripidD");
        // let fname=document.getElementById("fnameD");
        // let lname=document.getElementById("lnameD");
        let seats=document.getElementById("seatsD");
        let price=document.getElementById("priceD");

        
        //var tripiddata= tripid.innerText;
        // var fnamedata=fname.innerHTML;
        // var lnamedata=lname.innerHTML;
        var pricedata=price.innerHTML;
        var seatsdata=seats.innerHTML;
 
        //================================= DISPLAYS A INPUT BOX =================================
        //tripid.innerHTML="<input type='text' id='tripidEditBtn"+i+"' value='"+tripiddata+"' disabled='disabled'>";
        // fname.innerHTML="<input type='text' id='fnameEditBtn"+i+"' value='"+fnamedata+"'>";
        // lname.innerHTML="<input type='text' id='lnameEditBtn"+i+"' value='"+lnamedata+"'>";
        price.innerHTML="<input type='text' id='priceEditBtn"+i+"' value='"+pricedata+"'>";
        seats.innerHTML="<input type='text' id='seatsEditBtn"+i+"' value='"+seatsdata+"'>";
        
    } 

    function saveRow(row){
        //================================= SAVE DATE FROM THE INPUT BOX TO SCREEN=================================
        var i = row.parentNode.rowIndex;
        console.log("hello");
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
        //var tripidValue= document.getElementById("tripidEditBtn"+i).value; 
        // var fnameValue=document.getElementById("fnameEditBtn"+i).value;
        // var lnameValue=document.getElementById("lnameEditBtn"+i).value;
        //var priceValue=document.getElementById("priceEditBtn"+i).value;
        //var seatsValue=document.getElementById("seatsEditBtn"+i).value;
        //document.getElementById("tripidD").innerHTML=tripidValue;
        // document.getElementById("fnameD").innerHTML=fnameValue;
        // document.getElementById("lnameD").innerHTML=lnameValue;
        document.getElementById("priceD").innerHTML=priceValue;
        document.getElementById("seatsD").innerHTML=seatsValue;
        
        document.addEventListener('click', (e) =>{
            e.preventDefault();
            console.log("hello");
            let id=e.target.parentElement.getAttribute('id');
            console.log(id);
            db.collection('Trips').doc(id).get().then((snapshot) => { //
                    console.log(snapshot.data().Price);
                    currentPrice = snapshot.data().Price;
                    currentSeats = snapshot.data().AvailableSeats;
            })
            if(priceValue == null){
                priceValue = currentPrice;
            }
            if(seatsValue == null){
                seatsValue = currentSeats;
            }
            console.log(currentPrice);
            console.log(currentSeats);
            const temp1={
                // FirstName: fnameValue,
                // LastName: lnameValue,  
                AvailableSeats: seatsValue, 
                Price: priceValue
            };
            db.collection("Trips").doc(id).update(temp1);
        });
        return;
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

        let accept=document.createElement('input');
        accept.setAttribute("type", "button");
        accept.setAttribute("value", "Accept");
        accept.setAttribute("id", "driverAddBtn");
        accept.setAttribute("class", "decisions-2");
        accept.setAttribute("onclick", "addPassenger(this)");

        let decline=document.createElement('input');
        decline.setAttribute("type", "button");
        decline.setAttribute("value", "Decline");
        decline.setAttribute("class", "decisions-2");
        decline.setAttribute("onclick", "declinePassenger(this)");
        
// ==========================================================//
        row.setAttribute("data-id", doc.id);
        tripid.innerHTML = doc.data().TripId;
        fname.innerHTML = doc.data().FirstName;
        lname.innerHTML = doc.data().LastName;
        username.innerHTML = doc.data().Username;
        startloc.innerHTML = doc.data().StartLocation;
        stoploc.innerHTML = doc.data().StopLocation;
        accept.innerHTML = accept;
        decline.innerHTML = decline;
// ==========================================================//
        row.appendChild(tripid);        
        row.appendChild(fname);
        row.appendChild(lname);
        row.appendChild(username);
        row.appendChild(startloc);
        row.appendChild(stoploc);

        row.appendChild(accept);
        row.appendChild(decline);
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
        let startloc=document.createElement('td');
        let stoploc=document.createElement('td');
// ==========================================================//
        row.setAttribute("data-id", doc.id);
        tripid.innerHTML = doc.data().TripId;
        fname.innerHTML = doc.data().FirstName;
        lname.innerHTML = doc.data().LastName;
        startloc.innerHTML = doc.data().StartLocation;
        stoploc.innerHTML = doc.data().StopLocation;
// ==========================================================//
        row.appendChild(tripid);
        row.appendChild(fname);
        row.appendChild(lname);
        row.appendChild(startloc);
        row.appendChild(stoploc);
        tbody.appendChild(row);
// ==========================================================//    
    }

    //===============Code edited from www.w3schools.com - No Copyright============
    function declinePassenger(row) { 
        var i = row.parentNode.rowIndex;
        document.getElementById("mypassengerTable").deleteRow(i);

        document.addEventListener('click', (e) =>{
            e.preventDefault();
            let id=e.target.parentElement.getAttribute('data-id');
            db.collection("Bookings").doc(id).delete();
        });
    }
    function addPassenger(row){
        var i = row.parentNode.parentNode.rowIndex;
        var tripID = document.getElementById("passengertripid").innerText;
        var username = document.getElementById("passengerusername").innerText;
        var bookingID = tripID + username;

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
            let id=e.target.parentElement.getAttribute('data-id');
            db.collection("Bookings").doc(id).update({Accepted : true});
            document.getElementById("mypassengerTable").deleteRow(i);// this only deletes the row from the webpage directly
            
            //db.collection("Bookings").doc(id).delete();
            db.collection("Reserved").doc(id).set(data);
            

            /*
            $("#acceptedRequests").empty();
            db.collection("Trips").where("Email", "==", email).get().then((snapshot) =>{
                snapshot.docs.forEach(doc => {
                    db.collection("Reserved").where("TripId", "==", doc.id).get().then((snapshot) => { //
                        snapshot.docs.forEach(doc => {
                            renderAcceptedPassengers(doc);// when a logged in user accepts a request, it appears here
                        })
                    })
                });
               
            });

            */
        });

        
    }

    function rendermyTrips(doc){
        let tripID = doc.data().TripId;
        let tbody=document.getElementById('myTrips');
        let row=document.createElement('tr');
        let tripid=document.createElement('td');
        //let lname=document.createElement('td');
        //let fname=document.createElement('td');
        //let date=document.createElement('td');
        let startloc=document.createElement('td');
        let stoploc=document.createElement('td');
        let status=document.createElement('td');
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
                    driverfname = result.data().firstName;
                    driverlname = result.data().lastName;
                    /*
                    driveremailbox = result.data().email;
                    drivercellbox = result.data().number;
                    */
                })
                console.log(user.FirstName);
            })
            db.collection("Trips").where("Email", "==", email).get().then((snapshot) =>{
                snapshot.docs.forEach(doc => {
                    renderTable(doc);// when a use logs in, all his/her sharedtrips appears here
                    db.collection("Bookings").where("Accepted", "==", false).where("TripId", "==", doc.id).get().then((snapshot2) => {
                        snapshot2.docs.forEach(doc2 => {
                            renderpassengerTable(doc2); //when a user request to reserve a seat in logged in user carpool, it goes here
                        })
                    })
                    db.collection("Reserved").where("TripId", "==", doc.id).get().then((snapshot3) => { //
                        snapshot3.docs.forEach(doc3 => {
                            renderAcceptedPassengers(doc3);// when a logged in user accepts a request, it appears here
                        })
                    })
                    
                    
                });
               
            });
            db.collection("Bookings").where("Email", "==", email).get().then((snapshot4) => { //
                snapshot4.docs.forEach(doc4 => {
                    rendermyTrips(doc4);// shows logged in user trips 
                })
            })
            
        }
    });