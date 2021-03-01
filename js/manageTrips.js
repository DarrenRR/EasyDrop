const db= firebase.firestore(); 

    function renderTable(doc){
        let tbody=document.getElementById('requestsRender');
        let row=document.createElement('tr');
        let lname=document.createElement('td');
        lname.setAttribute("id", "lnameD");

        let fname=document.createElement('td');
        fname.setAttribute("id", "fnameD");

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
        edit.setAttribute("onclick", "editRow(this)");

        let delete1=document.createElement('input');
        delete1.setAttribute("type", "button");
        delete1.setAttribute("value", "Delete");
        delete1.setAttribute("onclick", "deleteRow(this)");

        let save=document.createElement('input');
        save.setAttribute("type", "button");
        save.setAttribute("value", "Save");
        save.setAttribute("onclick", "saveRow(this)");
        
// ==========================================================//
        row.setAttribute("id", doc.id);
        fname.innerHTML = doc.data().FirstName;
        lname.innerHTML = doc.data().LastName;
        seats.innerHTML = doc.data().AvailableSeats;
        price.innerHTML = doc.data().Price;
        // email.innerHTML = doc.data().Email;
        time.innerHTML = doc.data().Time;
        date.innerHTML = doc.data().Date;
        destination.innerHTML = doc.data().Destination;
        edit.innerHTML = doc.data().Edit;//THIS IS TO BE A BUTTON
        delete1.innerHTML = doc.data().Delete;//THIS IS TO BE A BUTTON
// ==========================================================//
        row.appendChild(fname);
        row.appendChild(lname);
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
        alert("Row index is: " + i);
        var test=document.getElementById("driverEditBtn");
        let fname=document.getElementById("fnameD");
        let lname=document.getElementById("lnameD");
        let seats=document.getElementById("seatsD");
        let price=document.getElementById("priceD");
        var fnamedata=fname.innerHTML;
        var lnamedata=lname.innerHTML;
        var pricedata=price.innerHTML;
        var seatsdata=seats.innerHTML;
        //================================= DISPLAYS A INPUT BOX =================================
        fname.innerHTML="<input type='text' id='fnameEditBtn"+i+"' value='"+fnamedata+"'>";
        lname.innerHTML="<input type='text' id='lnameEditBtn"+i+"' value='"+lnamedata+"'>";
        price.innerHTML="<input type='text' id='priceEditBtn"+i+"' value='"+pricedata+"'>";
        seats.innerHTML="<input type='text' id='seatsEditBtn"+i+"' value='"+seatsdata+"'>";
        
    } 

    function saveRow(row){
        //================================= SAVE DATE FROM THE INPUT BOX TO SCREEN=================================
        var i = row.parentNode.rowIndex;
        console.log("hello");
        var fnameValue=document.getElementById("fnameEditBtn"+i).value;
        var lnameValue=document.getElementById("lnameEditBtn"+i).value;
        var priceValue=document.getElementById("priceEditBtn"+i).value;
        var seatsValue=document.getElementById("seatsEditBtn"+i).value;
        console.log(fnameValue);
        document.getElementById("fnameD").innerHTML=fnameValue;
        document.getElementById("lnameD").innerHTML=lnameValue;
        document.getElementById("priceD").innerHTML=priceValue;
        document.getElementById("seatsD").innerHTML=seatsValue;
    
       
        document.addEventListener('click', (e) =>{
            e.preventDefault();
            console.log("hello");
            const temp1={
                FirstName: fnameValue,
                LastName: lnameValue,  
                AvailableSeats: seatsValue, 
                Price: priceValue
            };
            let id=e.target.parentElement.getAttribute('id');
            db.collection("Trips").doc(id).update(temp1);
        });
    }

    function renderpassengerTable(doc){
        let tbody=document.getElementById('passengerRequests');
        let row=document.createElement('tr');
        let lname=document.createElement('td');
        let fname=document.createElement('td');
        let startloc=document.createElement('td');
        let stoploc=document.createElement('td');

        let accept=document.createElement('input');
        accept.setAttribute("type", "button");
        accept.setAttribute("value", "Accept");
        accept.setAttribute("id", "driverAddBtn");
        accept.setAttribute("onclick", "addPassenger(this)");

        let decline=document.createElement('input');
        decline.setAttribute("type", "button");
        decline.setAttribute("value", "Decline");
        decline.setAttribute("onclick", "declinePassenger(this)");
        
// ==========================================================//
        row.setAttribute("data-id", doc.id);
        fname.innerHTML = doc.data().FirstName;
        lname.innerHTML = doc.data().LastName;
        startloc.innerHTML = doc.data().StartLocation;
        stoploc.innerHTML = doc.data().StopLocation;
        accept.innerHTML = accept;
        decline.innerHTML = decline;
// ==========================================================//
        row.appendChild(fname);
        row.appendChild(lname);
        row.appendChild(startloc);
        row.appendChild(stoploc);

        row.appendChild(accept);
        row.appendChild(decline);
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

    function addPassenger(row) { 
        var i = row.parentNode.rowIndex;
        document.getElementById("mypassengerTable").deleteRow(i);

        document.addEventListener('click', (e) =>{
            e.preventDefault();
            let id=e.target.parentElement.getAttribute('data-id');
            db.collection("Bookings").doc(id).update({Accepted : true});
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
                    renderTable(doc);
                    db.collection("Bookings").where("TripId", "==", doc.id).where("Accepted", "==", false).get().then((snapshot2) => {
                        snapshot2.docs.forEach(doc2 => {
                            renderpassengerTable(doc2);
                        })
                    })

                });
            });
            
            /*
            db.collection("Bookings").where("Email", "==", email).get().then((snapshot) =>{
                snapshot.docs.forEach(doc => {
                    renderpassengerTable(doc)
                });
            });
            */
            
        }
    });