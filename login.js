async function loginUser(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    // Prevents page from reloading when submit button is invoked
    event.preventDefault()
   
    try{
        const response = await fetch('https://f5ea3.playfabapi.com/Client/LoginWithEmailAddress', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                Email: email,
                Password: password,
                TitleId: "F5EA3",
                InfoRequestParameters: {
                GetPlayerProfile: true
                }
            }),
        })
        var json_response = await response.json();
        if (!response.ok) {
            throw new Error(json_response.errorMessage) 
        }
        
        // Storing relevant data in session
        sessionStorage.setItem("entity_token",json_response.data.EntityToken.EntityToken)
        sessionStorage.setItem("display_name",json_response.data.InfoResultPayload.PlayerProfile.DisplayName)
        sessionStorage.setItem("entity_type",json_response.data.EntityToken.Entity.Type)
        sessionStorage.setItem("entity_id",json_response.data.EntityToken.Entity.Id)

        // Successful login, redirect to home page 
        window.location.replace("home.html");
    }
    catch(error)
    {
        alert("Username or Password incorrect!")
        console.log(error);
    }
}