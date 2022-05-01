{   // avoid variables ending up in the global scope

    let file_to_download;
    let upload_button = document.getElementById('btnUpload');
    let download_button = document.getElementById('dwn');
    let alert = document.getElementById('id_alert');
    let hidInput = document.getElementById('hidInp');
    download_button.style.display = 'none';
    const inpFile = document.getElementById('inpFile');
    let formData;

    upload_button.addEventListener('click', async (e) => {
        e.preventDefault();
        alert.innerHTML = "";
        download_button.style.display = 'none';
        formData = new FormData();
        formData.append('myFile', inpFile.files[0]);
        try {
            const response = await fetch('upload-ppt', {
                method: 'POST',
                body: formData
            });

            file_to_download = await response.json();
            hidInput.setAttribute("value", `${file_to_download}`);
            download_button.style.display = 'block';

        } catch (err) {
            alert.innerHTML = "";
            alert.innerHTML = "Error during upload! Please try again!"
        }
    });

    download_button.addEventListener('click', () => {
        download_button.style.display = 'none';
        document.getElementById('inpFile').value = '';
    })

}