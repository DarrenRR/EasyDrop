const loggedOutOptions = document.querySelectorAll('.logged-out');
const loggedInOptions = document.querySelectorAll('.logged-in');
const regularOptions = document.querySelectorAll('.regular-options');

const setupNav = (user) => {
   regularOptions.forEach(option => option.style.display = 'block');
    if (user){
       loggedInOptions.forEach(option => option.style.display = 'block');
       loggedOutOptions.forEach(option => option.style.display = 'none'); 
    }
    else{
       loggedInOptions.forEach(option => option.style.display = 'none');
       loggedOutOptions.forEach(option => option.style.display = 'block'); 
    }
}