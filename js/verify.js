let idFile = null;
let picFile = null;


function showImage(src, target) {
    var fr = new FileReader();
    fr.onload = function(){
        target.src = fr.result;
        target.style.height = '360px';
        target.style.maxHeight = '100%';
        target.style.maxWidth = '100%';
    }
    fr.readAsDataURL(src.files[0]);
}

function chooseFile2(e){
    idFile = e.target.files[0];
    var idPic = document.getElementById("idPic");
    var src = document.getElementById("select_image2");
    showImage(src, idPic);
}


function chooseFile(e){
    picFile = e.target.files[0];
    var src = document.getElementById("select_image");
    var profilePic = document.getElementById("profilePic");
    showImage(src, profilePic);
}





function putImage() {
    var src = document.getElementById("select_image");
    var target = document.getElementById("target");
    showImage(src, target);
}


async function getUserDoc(user){
    var currUser = firebase.firestore().collection('users').where("email", "==", user.email).get();
    var resolved;
    currUser.catch(function(error){
        console.log(error);
        resolved = false;
    });
    currUser = await currUser;
    if(resolved == false)
        return null;
    return currUser;
}

async function uploadDocuments(){
    console.log(idFile);
    console.log(picFile);
    if(idFile != null && picFile != null){
        var user = firebase.auth().currentUser;
        var username;
        const snapshot = await firebase.firestore().collection('users').where("email", "==", user.email).get();
        snapshot.forEach(doc => {
            username = doc.data().username;
            console.log(doc.id, '=>', doc.data());
          });

        firebase.storage().ref(''+username+'/profile.jpg').put(picFile).then(function() {
            console.log("Successfully uploaded");
        }).catch(error => {
            console.log(error.message);
        })
        firebase.storage().ref(''+username+'/id.jpg').put(idFile).then(function() {
            console.log("Successfully uploaded");
        }).catch(error => {
            console.log(error.message);
        })
        const temp={
            submittedDocuments : true,
        };
        console.log(temp);
        firebase.firestore().collection("users").doc(username).update(temp);
        alert("Images successfully uploaded. Please await verification.");
    }
    else{
        alert("Please submit both images before uploading.")
    }
    
    
}




