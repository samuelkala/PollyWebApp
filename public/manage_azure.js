{
    let number_of_slides = 0;
    let authorizationToken;
    let region;
    let authorizationendpoint = 'azure_convert/api/get-speech-token';
    let errorAlert = document.getElementById('error');

    (async function getAuthorizationToken(){
        try{
            const response = await fetch(authorizationendpoint);
            const info = await response.json();
            authorizationToken = info.token;
            region = info.region;
            console.log('Token fetched from back-end: ' + authorizationToken);
        }catch(err){
            console.log(err);
            errorAlert.innerHTML = 'error while getting authorization Token';
        }
    })();


    







}