// ====================== D  R  I  V  E  R  S DATABASE INFORMATION ==========================
let db=firebase.firestore();
            // ------------ ADD DATA TO DB (works with forms only!) -----------------------
driverAddBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    db.collection("Trips").doc(tempDemail).set({
        FirstName: tempDfname,
        LastName: tempDlname, 
        Email: tempDemail, 
        Cell: tempDcell, 
        AvailableSeats: tempDseats, 
        Price: tempDprice, 
        DriverLicense: tempDlicense,
        AdditionalNotes: tempDdescription,
        Time: tempDtime,
        Date: tempDdate,
        Destination: tempDdestination,
    });
}); //adds data using the button
            
            // ------------ EDIT DATA SPECIFIED DB (works with forms only!)-----------------------
driverEditBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    const temp1={
        FirstName: tempDfname,
        LastName: tempDlname, 
        Cell: tempDcell, 
        AvailableSeats: tempDseats, 
        Price: tempDprice, 
        DriverLicense: tempDlicense,
        AdditionalNotes: tempDdescription,
        Time: tempDtime,
        Date: tempDdate,
        Destination: tempDdestination
    };
    db.collection("Trips").doc(tempDemail).update(temp1);
}); //edits data using the button 
            
            
            // ------------ DELETES DATA FROM DB (works with forms only!)-----------------------
            
driverDelBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    db.collection("Trips").doc(tempDemail).delete();
}); //deletes data using the button
