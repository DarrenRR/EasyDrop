var isVerified;
var user;



const loggedOutOptions = document.querySelectorAll('.logged-out');
const loggedInOptions = document.querySelectorAll('.logged-in');
const regularOptions = document.querySelectorAll('.regular-options');
const verified = document.querySelectorAll('.verify');

const setupNav = (user) => {
   regularOptions.forEach(option => option.style.display = 'block');
    if (user){
       loggedInOptions.forEach(option => option.style.display = 'block');
       loggedOutOptions.forEach(option => option.style.display = 'none'); 

   
       if(user.email !== "admin@easydrop.com"){
         const userRef = firebase.firestore().collection("users").where("email", "==", user.email).get().then(snapshot => {
            snapshot.docs.forEach(doc => {
               if(doc.data().submittedDocuments === false){
                  verified.forEach(option => option.style.display = 'block');
               }
           })
         });
       }

    }
    else{
       loggedInOptions.forEach(option => option.style.display = 'none');
       loggedOutOptions.forEach(option => option.style.display = 'block'); 
    }
    
}






