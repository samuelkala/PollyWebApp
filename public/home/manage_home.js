{
    let upload_button = document.getElementById('btnUpload');
    let loadingDots = document.getElementById('LoadDots');
    let missingMessage = document.getElementById('error');
    let doneMessage = document.getElementById('done');
    let voiceSet = document.getElementById('voiceset');
    voiceSet.style.display = 'none';
    const inpFile = document.getElementById('inpFile');
    let formData;

    upload_button.addEventListener('click', async (e) => {
        e.preventDefault();
        voiceSet.style.display = 'none';
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
            let info = await response.json();
            localStorage.setItem('filename', info.file_to_download);
            localStorage.setItem('n_slides', info.number_of_slides);
            loadingDots.style.display = 'none';
            voiceSet.style.display = 'inline'
        } catch (err) {
            /* alert.innerHTML = "";
            alert.innerHTML = "Error during upload! Please try again!" */
            loadingDots.style.display = 'none';
            missingMessage.style.display = 'inline';
        }
    });

}

