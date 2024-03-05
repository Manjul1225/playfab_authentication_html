async function getTempDataFromPlayFab(){
  try{
      const response = await fetch('https://f5ea3.playfabapi.com/Object/GetObjects', {
          method: 'POST',
          body: JSON.stringify({
              Entity: {
                id: sessionStorage.getItem("entity_id"),
                type: sessionStorage.getItem("entity_type")
              },
          }),
          headers: {
              'X-EntityToken': sessionStorage.getItem("entity_token"),
              'Content-type': 'application/json; charset=UTF-8',
          },
      })
      var json_response = await response.json();
          console.log(json_response);
      var temp_data = [];
      if (!response.ok) {// or check for response.status
        logOutProfile();
        throw new Error(json_response.errorMessage)  // throw new Error(response.statusText);
      }
      if(Object.keys(json_response.data.Objects).length === 0 || Object.keys(json_response.data.Objects.temperatureData).length === 0) {
        return temp_data;
      }
      temp_data = json_response.data.Objects.temperatureData.DataObject.temp
      return temp_data
  }
  catch(error) {
      console.log(error);
  }
// })
}

async function setTempDataInPlayFab(current_temp_data){
  try{
      const response = await fetch('https://f5ea3.playfabapi.com/Object/SetObjects', {
          method: 'POST',
          body: JSON.stringify({
              Entity: {
                id: sessionStorage.getItem("entity_id"),
                type: sessionStorage.getItem("entity_type")
              },
              Objects:[{
                DataObject:{
                    temp: current_temp_data
                },
                DeleteObject: false,
                ObjectName: "temperatureData"
            }]
          }),
          headers: {
              'X-EntityToken': sessionStorage.getItem("entity_token"),
              'Content-type': 'application/json; charset=UTF-8',
          },
      })
      var json_response = await response.json();
      if (!response.ok) // or check for response.status
        throw new Error(json_response.errorMessage)  // throw new Error(response.statusText);
      
      return response
  }
  catch(error) {
      console.log(error);
  }
}

async function getWeatherData(lat,lon) {
  const promise = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=8965c3c0440544c4985161104231206&q=${lat},${lon}&aqi=yes`
  );
  const promise_json=await promise.json();
  return promise_json;
}


async function uploadAndFetchTempData(position) {
  const result = await getWeatherData(position.coords.latitude,position.coords.longitude);
  var temp =  result.current.temp_c;

  var current_temp_data = await getTempDataFromPlayFab();
  current_temp_data.push(String(temp));

  const response = await setTempDataInPlayFab(current_temp_data);
  if(!response.ok) {
    sessionStorage.clear()
    window.location.replace("index.html")
    throw new Error(response.errorMessage)
  }
  createTempList(current_temp_data)

}

function failedToGet() {
  console.log("Failed to fetch location")
}

function addWeatherData(){
  navigator.geolocation.getCurrentPosition(uploadAndFetchTempData,failedToGet)
}

function createTempList(temp_data) {
  var temperatureList = document.getElementById('temperature-list');
  temperatureList.innerHTML = "";
  for (let i = 0; i < temp_data.length; i++) {
    const st = document.createElement('li');
    st.innerHTML = temp_data[i];
    temperatureList.appendChild(st);
  }
}
