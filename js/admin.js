var email;
var username;



firebase.auth().onAuthStateChanged((user) => {
    if (user){
        //  Gets the user's information from firestore
        email = user.email;
        if(email !== "admin@easydrop.com"){
            alert("You do not have access to this page.");
        }
        else{
            let tbody=document.getElementById('userSubmissions');
            firebase.firestore().collection("users").where("submittedDocuments", "==", true).where("isVerified", "==", false).get().then((snapshot) => {
                snapshot.docs.forEach(result => {
                
                        
                        username = result.data().username;
                        var storageRef = firebase.storage().ref();
                        var profilePath = username + "/profile.jpg";
                        var idPath = username + "/id.jpg";
                        var profileRef = storageRef.child(profilePath);
                        var idRef = storageRef.child(idPath);
                        
                        var address = document.createElement('p'); 
                        var fName = document.createElement('p'); 
                        var accountType = document.createElement('p');
                        address.innerHTML = "" + result.data().address + ", " + result.data().town;
                        fName.innerHTML = "" + result.data().firstName + " " + result.data().lastName;
                        if(result.data().isDriver === true){
                          accountType.innerHTML = "Driver";
                        }
                        else{
                          accountType.innerHTML = "Passenger";
                        }
                    
                        //$("#acceptedRequests").empty();
                        
                        let row=document.createElement('tr');
                        let userPhoto=document.createElement('td');
                        let userID=document.createElement('td');
                        let userInfo=document.createElement('td');

                        row.setAttribute("username", result.data().username);
                        row.setAttribute("id", username);
                        userInfo.appendChild(fName);
                        userInfo.appendChild(address);
                        userInfo.appendChild(accountType);

                        row.appendChild(userInfo);

                        storageRef.child(profilePath).getDownloadURL().then(function(url) {
                            var test = url;
                            console.log(url);
                            
                            var img = document.createElement('img');
                            img.src = url;
                            img.style.maxHeight = '50%';
                            img.style.maxWidth = '50%';
                            userPhoto.appendChild(img);
                        }).catch(function(error) {

                        });

                        storageRef.child(idPath).getDownloadURL().then(function(url) {
                            var test = url;
                            console.log(url);
                            var img = document.createElement('img');
                            img.src = url;
                            img.style.maxHeight = '50%';
                            img.style.maxWidth = '50%';
                            userID.appendChild(img);
                        }).catch(function(error) {

                        });
                        row.appendChild(userPhoto);
                        row.appendChild(userID);

                        let verify=document.createElement('input');
                        verify.setAttribute("type", "button");
                        verify.setAttribute("value", "Verify");
                        verify.setAttribute("class", "verifybutton");
                        verify.setAttribute('onclick', 'verify("'+username+'")');
                        let deny=document.createElement('input');
                        deny.setAttribute("type", "button");
                        deny.setAttribute("value", "Deny");
                        deny.setAttribute("class", "deny");
                        deny.setAttribute('onclick', 'deny("'+username+'")');

                        row.appendChild(verify);
                        row.appendChild(deny);
                        tbody.appendChild(row);
                })
   
            })
    }
    }
});


async function deny(username) {
    var reason = prompt("Reason: ");
    var row = document.getElementById(username);
    var user = firebase.firestore().collection('users').doc(username);
    const res = await user.update({submittedDocuments: false});
    console.log(user);
    deleteFolderContents(username);
    row.remove();
}

async function verify(username){
    console.log(username);
    var user = firebase.firestore().collection('users').doc(username);
    const res = await user.update({submittedDocuments: true, isVerified: true});
    var row = document.getElementById(username);
    row.remove();
}



function deleteFolderContents(path){
    const ref = firebase.storage().ref(path);
    ref.listAll()
      .then(dir => {
        dir.items.forEach(fileRef => {
          this.deleteFile(ref.fullPath, fileRef.name);
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  function deleteFile(pathToFile, fileName) {
    const ref = firebase.storage().ref(pathToFile);
    const childRef = ref.child(fileName);
    childRef.delete()
  }