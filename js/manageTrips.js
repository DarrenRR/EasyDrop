const db= firebase.firestore(); 

    function renderTable(doc){
        let tbody=document.getElementById('requestsRender');
        let row=document.createElement('tr');
        let blank=document.createElement('td');
        let tripid=document.createElement('a');
        tripid.setAttribute("id", "tripidD");
        tripid.setAttribute("href", "#");
        tripid.setAttribute("style", "color: black");
        tripid.setAttribute("target", "_parent");

        let seats=document.createElement('td');
        seats.setAttribute("class", "seatClass");
        let seatList = document.getElementsByClassName("seatClass");         
        for (var i = 0; i < seatList.length; i++){
            seatList[i].setAttribute("id", "seatsD" + (i + 1));
        } 

        let price=document.createElement('td');
        price.setAttribute("id", "priceD");
        price.setAttribute("class", "priceClass");
        let priceList = document.getElementsByClassName("priceClass");         
        for (var i = 0; i < priceList.length; i++){
            priceList[i].setAttribute("id", "priceD" + (i + 1));
        } 


        let time=document.createElement('td');
        time.setAttribute("id", "timeD");
        time.setAttribute("class", "timeClass");

        let date=document.createElement('td');
        date.setAttribute("id", "dateD");

        let start=document.createElement('td');
        start.setAttribute("id", "dateD");

        let destination=document.createElement('td');
        destination.setAttribute("id", "destinationD");

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
        
        
// ==========================================================//
        row.setAttribute("id", doc.id);
        blank.innerHTML = "";
        tripid.innerHTML = doc.id;
        seats.innerHTML = doc.data().AvailableSeats;
        price.innerHTML = doc.data().Price;
        // email.innerHTML = doc.data().Email;
        date.innerHTML = doc.data().Date;
        start.innerHTML = doc.data().StartAddress + ', ' + doc.data().StartTown;
        destination.innerHTML = doc.data().StopAddress + ', ' + doc.data().StopTown;
        edit.innerHTML = doc.data().Edit;//THIS IS TO BE A BUTTON
        delete1.innerHTML = doc.data().Delete;//THIS IS TO BE A BUTTON
// ==========================================================//
        row.appendChild(blank);
        blank.appendChild(tripid);
        row.appendChild(seats);
        row.appendChild(price);
        row.appendChild(date);
        // row.appendChild(email);
        row.appendChild(start);
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
            document.getElementById("driverEditBtn"+i).style.display="none";
            document.getElementById("driverSaveBtn"+i).style.display="block";
            let seats=document.getElementById("seatsD"+i);
            let price=document.getElementById("priceD"+i);
            //let date=document.getElementById("tripidD");
            // let start=document.getElementById("fnameD");
            // let destination=document.getElementById("lnameD");
            

            //var datedata= date.innerText;
            // var startdata=start.innerHTML;
            // var destinationdata=destination.innerHTML;
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
        console.log(bookingID+'this works i guess');

        

        
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
        let icon=document.createElement('i');
        // icon.innerHTML=`<i class="fas fa-list"></i>`;// onmouseover=""
        let done=document.createElement('input');
        done.setAttribute("type", "button");
        done.setAttribute("value", "Done");
        done.setAttribute("onclick", "giveReview(this)");
        // done.setAttribute("class", "button");
        done.setAttribute("data-toggle", "modal");
        done.setAttribute("data-target", "#myModal");
// ==========================================================//
        row.setAttribute("data-id", doc.id);
        tripid.innerHTML = doc.data().TripId;
        //fname.innerHTML = doc.data().FirstName;
        //lname.innerHTML = doc.data().LastName;
        //date.innerHTML = doc.data().Date;
        startloc.innerHTML = doc.data().StartLocation;
        stoploc.innerHTML = doc.data().StopLocation;
        done.innerHTML = done;
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
        // row.appendChild(icon);
        row.appendChild(done);
        tbody.appendChild(row);
// ==========================================================//        
    }

    
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
            })
            db.collection("Trips").where("Email", "==", email).get().then((snapshot) =>{
                snapshot.docs.forEach(doc => {
                    renderTable(doc);// when a use logs in, all his/her sharedtrips appears here
                    db.collection("Bookings").where("Accepted", "==", false).where("TripId", "==", doc.id).get().then((snapshot2) => {
                        snapshot2.docs.forEach(doc2 => {
                            renderpassengerTable(doc2); //when a user request to reserve a seat in logged in user carpool, it goes here
                        })
                    })
                    db.collection("Bookings").where("Accepted", "==", true).where("TripId", "==", doc.id).get().then((snapshot3) => { //
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

//=================================== S T A R    R A T I N G S     F U N C T I O N S =======================

const stars= [false, false, false, false, false];
const ease= [false, false, false, false, false];//Ease of carpool booking
const safety= [false, false, false, false, false];//feeling of safety
const comfort= [false, false, false, false, false];//ride comfort
const knowledge= [false, false, false, false, false];//driver knowledge of routes
const overall= [false, false, false, false, false];//overall customer service

function giveReview(row){
    var i = row.parentNode.rowIndex;
    var table= document.getElementById("myTrips"); 
    var getTripId= table.rows[i].cells[0].innerHTML;
    alert(getTripId);
    var id = Date.now().toString(); 
    db.collection('Reviews').doc(id).set({
        Email: email,
        TripId: getTripId,//movieName.value,
        Punctuality: stars
        
    });
    
    db.collection("Reviews").where("TripId", "==", getTripId).get().then((snapshot) =>{
        snapshot.docs.forEach(doc => {
        document.getElementById('starRender').innerHTML=
            `<div class="row" id="${doc.id}">
                 <div class="col">
                    <h6>Trip ID: ${getTripId}</h6>
                    <h6>Punctuality: </h6>
                    <i onclick="mark('${doc.data().TripId}', '${doc.id}','0')"  id="${'star'+doc.id+0}" class="fas fa-star"></i>
                    <i onclick="mark('${doc.data().TripId}', '${doc.id}','1')"  id="${'star'+doc.id+1}" class="fas fa-star"></i>
                    <i onclick="mark('${doc.data().TripId}', '${doc.id}','2')"  id="${'star'+doc.id+2}" class="fas fa-star"></i>
                    <i onclick="mark('${doc.data().TripId}', '${doc.id}','3')"  id="${'star'+doc.id+3}" class="fas fa-star"></i>
                    <i onclick="mark('${doc.data().TripId}', '${doc.id}','4')"  id="${'star'+doc.id+4}" class="fas fa-star"></i>
                </div>
                <div class="col">
                    <h6>Ease of booking carpool: </h6>
                    <i onclick="mark1('${doc.id}','0')" id="${'ease'+doc.id+0}" class="fas fa-star"></i>
                    <i onclick="mark1('${doc.id}','1')" id="${'ease'+doc.id+1}" class="fas fa-star"></i>
                    <i onclick="mark1('${doc.id}','2')" id="${'ease'+doc.id+2}" class="fas fa-star"></i>
                    <i onclick="mark1('${doc.id}','3')" id="${'ease'+doc.id+3}" class="fas fa-star"></i>
                    <i onclick="mark1('${doc.id}','4')" id="${'ease'+doc.id+4}" class="fas fa-star"></i>
                </div>
                <div class="col">
                    <h6>Feeling of Safety for the Entire Ride: </h6>
                    <i onclick="mark2('${doc.id}','0')" id="${'safety'+doc.id+0}" class="fas fa-star"></i>
                    <i onclick="mark2('${doc.id}','1')" id="${'safety'+doc.id+1}" class="fas fa-star"></i>
                    <i onclick="mark2('${doc.id}','2')" id="${'safety'+doc.id+2}" class="fas fa-star"></i>
                    <i onclick="mark2('${doc.id}','3')" id="${'safety'+doc.id+3}" class="fas fa-star"></i>
                    <i onclick="mark2('${doc.id}','4')" id="${'safety'+doc.id+4}" class="fas fa-star"></i>
                </div>
                <div class="col">
                    <h6>Ride Comfort: </h6>
                    <i onclick="mark3('${doc.id}','0')" id="${'comfort'+doc.id+0}" class="fas fa-star"></i>
                    <i onclick="mark3('${doc.id}','1')" id="${'comfort'+doc.id+1}" class="fas fa-star"></i>
                    <i onclick="mark3('${doc.id}','2')" id="${'comfort'+doc.id+2}" class="fas fa-star"></i>
                    <i onclick="mark3('${doc.id}','3')" id="${'comfort'+doc.id+3}" class="fas fa-star"></i>
                    <i onclick="mark3('${doc.id}','4')" id="${'comfort'+doc.id+4}" class="fas fa-star"></i>
                </div>
                <div class="col">
                    <h6>Driver's Knowledge: </h6>
                    <i onclick="mark4('${doc.id}','0')" id="${'knowledge'+doc.id+0}" class="fas fa-star"></i>
                    <i onclick="mark4('${doc.id}','1')" id="${'knowledge'+doc.id+1}" class="fas fa-star"></i>
                    <i onclick="mark4('${doc.id}','2')" id="${'knowledge'+doc.id+2}" class="fas fa-star"></i>
                    <i onclick="mark4('${doc.id}','3')" id="${'knowledge'+doc.id+3}" class="fas fa-star"></i>
                    <i onclick="mark4('${doc.id}','4')" id="${'knowledge'+doc.id+4}" class="fas fa-star"></i>
                </div>
                <div class="col">
                    <h6>Overall Customer Service: </h6>
                    <i onclick="mark5('${doc.id}','0')" id="${'overall'+doc.id+0}" class="fas fa-star"></i>
                    <i onclick="mark5('${doc.id}','1')" id="${'overall'+doc.id+1}" class="fas fa-star"></i>
                    <i onclick="mark5('${doc.id}','2')" id="${'overall'+doc.id+2}" class="fas fa-star"></i>
                    <i onclick="mark5('${doc.id}','3')" id="${'overall'+doc.id+3}" class="fas fa-star"></i>
                    <i onclick="mark5('${doc.id}','4')" id="${'overall'+doc.id+4}" class="fas fa-star"></i>
                </div>
                <br>
                <div class="row">
                    <form>
                        <div class="textarea">
                            <textarea col="35" id="textarea"> </textarea>
                        </div>
                        <div>
                            <button type="button" onclick="giveDescription('${doc.id}')" class="btn btn-primary">Post</button>
                        </div>
                    </form>
                </div>
            </div><br>`; 
            
        });
    });
}

// Code inspired from https://www.youtube.com/watch?v=DVxN9lLUu9I&list=PLS95rOLXf_7GyPOE5_xtC1ADxykyetQS8&index=8
function mark(name, key, star){ // this is to mark the star ONLY!
    for (let index=0; index <= star;index++){
        stars[index]=true;
        if(stars[index]=true){
            document.getElementById('star'+key+(index)).style.color="orange";
        }
    }
    db.collection('Reviews').doc(key).set({
        // FirstName: firstName,
        Email: email,
        TripId: name,
        Punctuality:stars
    });
    // stars= [false, false, false, false, false];
}
// ======================== End of reused code ============================

function giveDescription(key){
    var textarea=document.getElementById("textarea");
    db.collection("Reviews").doc(key).update({
        AdditionalNotes: textarea.value
    });

    textarea.value='';
}

function mark1(key,star){ 
    let index=0
    if(index>=0){
        for (index=0; index <= star;index++){
            ease[index]=true;
            document.getElementById('ease'+key+(index)).style.color="orange";
        }
    }
    else{
        ease[index]=false;
    }
    console.log('EaseofBooking:'+ease);
    db.collection('Reviews').doc(key).update({
        EaseofBooking: ease
    });
    
}

function mark2( key, star){ // this is to mark the star ONLY!
    let index=0
    if(index>=0){
        for (index=0; index <= star;index++){
            safety[index]=true;
            document.getElementById('safety'+key+(index)).style.color="orange";
        }
    }
    else{
        safety[index]=false;
    }
    console.log('Safety:'+safety);
    db.collection('Reviews').doc(key).update({
        FeelingofSafety: safety
    });
}
function mark3(key, star){ // this is to mark the star ONLY!
    let index=0
    if(index>=0){
        for (index=0; index <= star;index++){
            comfort[index]=true;
            document.getElementById('comfort'+key+(index)).style.color="orange";
        }
    }
    else{
        comfort[index]=false;
    }
    console.log('comfort:'+comfort);
    db.collection('Reviews').doc(key).update({
        RideComfort: comfort
    });
}
function mark4(key, star){ // this is to mark the star ONLY!
    let index=0
    if(index>=0){
        for (index=0; index <= star;index++){
            knowledge[index]=true;
            document.getElementById('knowledge'+key+(index)).style.color="orange";
        }
    }
    else{
        knowledge[index]=false;
    }
    console.log('Knowledge:'+knowledge);
    db.collection('Reviews').doc(key).update({
        
        DriverKnowledge: knowledge
    });
}
function mark5(key, star){ // this is to mark the star ONLY!
    let index=0
    if(index>=0){
        for (index=0; index <= star;index++){
            overall[index]=true;
            document.getElementById('overall'+key+(index)).style.color="orange";
        }
    }
    else{
        overall[index]=false;
    }
    console.log('overall:'+overall);
    db.collection('Reviews').doc(key).update({
        OverallExperience: overall
    });
}

//  ===================== R E N D E R I N G         R E V I E W S ======================

function renderReviews(doc){
    // ===================Build container=====================
    let tbody=document.getElementById('reviews2'); 
    let row=document.createElement('tr'); 
    let br1=document.createElement('br');
    let br2=document.createElement('br');
    let br3=document.createElement('br');
    let br4=document.createElement('br');
    let br5=document.createElement('br');
    let imgElement=document.createElement('img');
    imgElement.setAttribute("src", "images/homepage.png");
    imgElement.setAttribute("alt", "Avatar");
    imgElement.setAttribute("style", "width: 105px; height: 105px");
    
    let paragraph=document.createElement('p');
    let icon=document.createElement('i');
    let icon2=document.createElement('i');
    let icon3=document.createElement('i');
    let icon4=document.createElement('i');
    let icon5=document.createElement('i');
    let icon6=document.createElement('i');
    // ===================Build container=====================
// ==========================================================//
    paragraph.innerHTML ='User ' +doc.data().Email+' review about '+ doc.data().TripId+ ':';
    row.appendChild(paragraph); 
    row.appendChild(imgElement);
    row.append("Driver's Knowledge: ");
    for(let index=0; index < doc.data().DriverKnowledge.length; index++){
        if(doc.data().DriverKnowledge[index]==true){
            icon.innerHTML+=`<i class="fas fa-star" style="color:orange"></i>`;
            row.appendChild(icon);
        }
        if(doc.data().DriverKnowledge[index]==false){
            icon.innerHTML+=`<i class="fas fa-star" style="color:initial"></i>`;
            row.appendChild(icon);
        }
    }
    row.appendChild(br1);
    row.append("Ease of Booking: ");
    for(let index=0; index < doc.data().EaseofBooking.length; index++){ 
        if(doc.data().EaseofBooking[index]==true){
            icon2.innerHTML+=`<i class="fas fa-star" style="color:orange"></i>`;
            row.appendChild(icon2);
        }
        if(doc.data().EaseofBooking[index]==false){
            icon2.innerHTML+=`<i class="fas fa-star" style="color:initial"></i>`;
            row.appendChild(icon2);
        }
    }
    row.appendChild(br2);
    row.append("Feeling of safety: ");
    for(let index=0; index < doc.data().FeelingofSafety.length; index++){
        if(doc.data().FeelingofSafety[index]==true){
            icon3.innerHTML+=`<i class="fas fa-star" style="color:orange"></i>`;
            row.appendChild(icon3);
        }
        if(doc.data().FeelingofSafety[index]==false){
            icon3.innerHTML+=`<i class="fas fa-star" style="color:initial"></i>`;
            row.appendChild(icon3);
        }
    }
    row.appendChild(br3);
    row.append("Ride of Comfort: ");
    for(let index=0; index < doc.data().RideComfort.length; index++){
        if(doc.data().RideComfort[index]==true){
            icon4.innerHTML+=`<i class="fas fa-star" style="color:orange"></i>`;
            row.appendChild(icon4);
        }
        if(doc.data().RideComfort[index]==false){
            icon4.innerHTML+=`<i class="fas fa-star" style="color:initial"></i>`;
            row.appendChild(icon4);
        }
    }
    row.appendChild(br4);
    row.append("Punctuality: ");
    for(let index=0; index < doc.data().Punctuality.length; index++){
        if(doc.data().Punctuality[index]==true){
            icon5.innerHTML+=`<i class="fas fa-star" style="color:orange"></i>`;
            row.appendChild(icon5);
        }
        if(doc.data().Punctuality[index]==false){
            icon5.innerHTML+=`<i class="fas fa-star" style="color:initial"></i>`;
            row.appendChild(icon5);
        }
    }
    row.appendChild(br5);
    row.append("Overall Experience: ");
    for(let index=0; index < doc.data().OverallExperience.length; index++){
        if(doc.data().OverallExperience[index]==true){
            icon6.innerHTML+=`<i class="fas fa-star" style="color:orange"></i>`;
            row.appendChild(icon6);
        }
        if(doc.data().OverallExperience[index]==false){
            icon6.innerHTML+=`<i class="fas fa-star" style="color:initial"></i>`;
            row.appendChild(icon6);
        }
    }
// ==========================================================//

    tbody.appendChild(row);
// ==========================================================//   
}

db.collection("Reviews").get().then((snapshot) =>{
    snapshot.docs.forEach(doc => {
        if(doc.data().Punctuality[0]==true){
            renderReviews(doc);// when a use logs in, all his/her sharedtrips appears here
        }
    });
   
});
