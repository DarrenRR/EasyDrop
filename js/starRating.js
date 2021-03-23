// var firebaseConfig = {
//     apiKey: "AIzaSyDttS03u2SRMX8aW3Y8wXMSVk-SzUqZuqs",
//     authDomain: "easydrop-88d08.firebaseapp.com",
//     projectId: "easydrop-88d08",
//     storageBucket: "easydrop-88d08.appspot.com",
//     messagingSenderId: "783674652012",
//     appId: "1:783674652012:web:02572f6b96a65b73546f49",
//     measurementId: "G-PCLT261TX0"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   firebase.analytics();


var db=firebase.firestore();
var userEmail;
var firstName;
var lastName;
var tripID;

firebase.auth().onAuthStateChanged((user) => {
    if (user){
        userEmail = user.email;
        console.log(userEmail);
        const currUser = db.collection("users").where("email", "==", userEmail).get().then((snapshot) => {
            snapshot.docs.forEach(result => {
                username = result.data().Username;
                firstName = result.data().FirstName;
                lastName = result.data().LastName;
            });
            
        });
        
    }
});


const stars= [false, false, false, false, false];
function giveReview(){
    var id = Date.now().toString(); 
    let movieName=document.getElementById("movieName");
    db.collection('Reviews').doc(id).set({
        // FirstName: firstName,
        Email: userEmail,
        TripId: movieName.value,
        rating: stars
    });
    
    db.collection("Reviews").where("TripId", "==", movieName.value).get().then((snapshot) =>{
        snapshot.docs.forEach(doc => {
        document.getElementById('starRender').innerHTML=
            `<div class="row" id="${doc.id}">
                 <div class="col">
                    <h6>Trip ID: ${doc.id}</h6>
                    <h6>Rating: </h6>
                    <i onmouseover="color('${doc.id}','0')" onclick="mark('${doc.data().TripId}', '${doc.id}','0')"  id="${'star'+doc.id+0}" class="fas fa-star"></i>
                    <i onmouseover="color('${doc.id}','1')" onclick="mark('${doc.data().TripId}', '${doc.id}','1')"  id="${'star'+doc.id+1}" class="fas fa-star"></i>
                    <i onmouseover="color('${doc.id}','2')" onclick="mark('${doc.data().TripId}', '${doc.id}','2')"  id="${'star'+doc.id+2}" class="fas fa-star"></i>
                    <i onmouseover="color('${doc.id}','3')" onclick="mark('${doc.data().TripId}', '${doc.id}','3')"  id="${'star'+doc.id+3}" class="fas fa-star"></i>
                    <i onmouseover="color('${doc.id}','4')" onclick="mark('${doc.data().TripId}', '${doc.id}','4')"  id="${'star'+doc.id+4}" class="fas fa-star"></i>
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
function color(key, star){
    for (let index=0; index<=star;index++){
        document.getElementById('star'+key+(index)).style.color="orange";
    }
}

function mark(name, key, star){ // this is to mark the star ONLY!
    for (let index=0; index <= star;index++){
        stars[index]=true;
    }
    db.collection('Reviews').doc(key).set({
        // FirstName: firstName,
        Email: userEmail,
        TripId: name,
        rating:stars
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



//  ===================== R E N D E R I N G         R E V I E W S ======================

var db=firebase.firestore();

function renderReviews(doc){
    // ===================Build container=====================
    let divElement1=document.getElementById('testimonials');
    let reviews=document.getElementById('reviews2'); 
    let row=document.createElement('tr'); 
    let breakline=document.createElement('hr'); //row

    // let imgElement=document.createElement('img');
    // imgElement.setAttribute("src", "images/homepage.png");
    // imgElement.setAttribute("alt", "Avatar");
    // imgElement.setAttribute("style", "width:90px");

    let paragraph=document.createElement('p');
    let icon=document.createElement('i');
    // ===================Build container=====================
// ==========================================================//
    paragraph.innerHTML ='User ' +doc.data().Email+' review about '+ doc.data().TripId+ ':';
    row.appendChild(paragraph); 
    for(let index=0; index < doc.data().rating.length; index++){
        if(doc.data().rating[index]==true){
            icon.innerHTML+=`<i class="fas fa-star" style="color:orange"></i>`
            row.appendChild(icon);
        }
        if(doc.data().rating[index]==false){
            icon.innerHTML+=`<i class="fas fa-star" style="color:initial"></i>`
            row.appendChild(icon);
        }
    }
// ==========================================================//
    divElement1.appendChild(row);
// ==========================================================//   
}

db.collection("Reviews").get().then((snapshot) =>{
    snapshot.docs.forEach(doc => {
        if(doc.data().rating[0]==true){
            console.log(doc.data().rating[0]);
            renderReviews(doc);// when a use logs in, all his/her sharedtrips appears here
        }
    });
   
});
















