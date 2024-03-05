function logOutProfile(){
    sessionStorage.clear();
    alert("You have been successfully logged out")
    window.location.replace("index.html")
}