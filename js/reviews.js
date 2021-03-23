var db=firebase.firestore();

function renderReviews(doc){
    // ===================Build container=====================
    let divElement1=document.getElementById('testimonials');
    let reviews=document.getElementById('reviews2'); //tbody
    let row=document.createElement('tr'); //row

    // let imgElement=document.createElement('img');
    // imgElement.setAttribute("src", "images/homepage.png");
    // imgElement.setAttribute("alt", "Avatar");
    // imgElement.setAttribute("style", "width:90px");

    let paragraph=document.createElement('p');
    let icon=document.createElement('i');
    // ===================Build container=====================

// ==========================================================//
    // row.setAttribute("id", doc.id);
    // tripid.innerHTML = doc.id;
    paragraph.innerHTML = doc.data().TripId;
    row.appendChild(paragraph);

    icon.innerHTML = doc.data().rating;
    console.log("hello there1"); 
    for(let index=0; index < doc.data().rating.length; index++){
        if(doc.data().rating[index]==true){
            console.log(doc.data().rating[index]+'hello2');
            icon.innerHTML+=`<i class="fas fa-star" style="color:orange"></i>`
            row.appendChild(icon);
        }
        if(doc.data().rating[index]==false){
            console.log(doc.data().rating[index]+'hello2');
            icon.innerHTML+=`<i class="fas fa-star" style="color:initial"></i>`
            row.appendChild(icon);
        }
    }
// ==========================================================//
    
    reviews.appendChild(row);
    divElement1.appendChild(reviews);
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






