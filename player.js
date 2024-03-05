function displayPlayerInfo(){
    const developedByName = document.getElementById('developed-by-name');
    developedByName.innerHTML = `Developed by : ${sessionStorage.getItem("display_name")}`
    document.body.appendChild(developedByName)
}