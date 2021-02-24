const db= firebase.firestore(); 

    function renderTable(doc){
        let tbody=document.getElementById('requestsRender');
        let row=document.createElement('tr');
        let lname=document.createElement('td');
        let fname=document.createElement('td');
        // let email=document.createElement('td');
        let seats=document.createElement('td');
        let price=document.createElement('td');
        let time=document.createElement('td');
        let date=document.createElement('td');
        let destination=document.createElement('td');
        let edit=document.createElement('input');
        edit.setAttribute("type", "button");
        edit.setAttribute("value", "Edit");
        edit.setAttribute("onclick", "editRow(this)");

        let delete1=document.createElement('input');;
        delete1.setAttribute("type", "button");
        delete1.setAttribute("value", "Delete");
        delete1.setAttribute("onclick", "deleteRow(this)");
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
        tbody.appendChild(row);
// ==========================================================//    
        
    }

    

    //===============Code edited from www.w3schools.com - No Copyright============ 
    function deleteRow(row) { //Code taken directly from w3Schools
        var i = row.parentNode.rowIndex;
        document.getElementById("myTable").deleteRow(i);

        document.addEventListener('click', (e) =>{
            e.preventDefault();
            let id=e.target.parentElement.getAttribute('id');
            db.collection("Trips").doc(id).delete();
        });
    }
    //===============Code edited from www.w3schools.com - No Copyright============ 

    function editRow(row) { //Code taken directly from w3Schools
        // var i = row.parentNode.rowIndex;
        // document.getElementById("myTable").deleteRow(i);

        document.addEventListener('click', (e) =>{
            e.preventDefault();
            let id=e.target.parentElement.getAttribute('id');
            db.collection("Trips").doc(id).delete();
        });
    }

    // document.addEventListener('click', (e) =>{
    //     e.preventDefault();
        
    //     const temp1={
    //         FirstName: tempDfname,
    //         LastName: tempDlname, 
    //         Cell: tempDcell, 
    //         AvailableSeats: tempDseats, 
    //         Price: tempDprice, 
    //         DriverLicense: tempDlicense,
    //         AdditionalNotes: tempDdescription
    //     };
    //     let id=e.target.parentElement.getAttribute('id');
    //     db.collection("Trips").doc(id).update(temp1);
    // }); 


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
                    driveremailbox = result.data().email;
                    drivercellbox = result.data().number;
                })
            })
            db.collection("Trips").where("Email", "==", email).get().then((snapshot) =>{
                snapshot.docs.forEach(doc => {
                    renderTable(doc);
                });
            });
            
        }
    });
