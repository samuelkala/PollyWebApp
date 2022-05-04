{   // avoid variables ending up in the global scope

    let file_to_download;
    let upload_button = document.getElementById('btnUpload');
    let download_button = document.getElementById('dwn');
    let loadingDots = document.getElementById('LoadDots');
    let hidInput = document.getElementById('hidInp');
    let missingMessage = document.getElementById('error');
    let doneMessage = document.getElementById('done');    
    download_button.style.display = 'none';
    const inpFile = document.getElementById('inpFile');
    let formData;

    upload_button.addEventListener('click', async (e) => {
        e.preventDefault();
        //alert.innerHTML = "";    
        download_button.style.display = 'none';
        missingMessage.style.display = 'none';
        doneMessage.style.display = 'none';
        loadingDots.style.display = 'inline';
        formData = new FormData();
        formData.append('myFile', inpFile.files[0]);
        try {
            const response = await fetch('upload-ppt', {
                method: 'POST',
                body: formData
            });

            file_to_download = await response.json();
            hidInput.setAttribute("value", `${file_to_download}`);
            loadingDots.style.display = 'none';           
            download_button.style.display = 'inline';

        } catch (err) {          
            /* alert.innerHTML = "";
            alert.innerHTML = "Error during upload! Please try again!" */
            loadingDots.style.display = 'none';
            missingMessage.style.display = 'inline'; 
        }
    });

    download_button.addEventListener('click', () => {
        download_button.style.display = 'none';
        doneMessage.style.display = 'inline'; 
        document.getElementById('inpFile').value = '';
    })

}