{   // avoid variables ending up in the global scope

    let file_to_download;
    let error;
    let convert_button = document.getElementById('btnUpload');

    const inpFile = document.getElementById('inpFile');
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    xhr.onreadystatechange = function () {
        if(xhr.readyState == XMLHttpRequest.DONE){
            if(xhr.status == 200){
                file_to_download = xhr.responseText;
            }else{
                error = 'Not received name of the file to download';
            }
        }
    };


    
    convert_button.addEventListener('click', (e) => { 
//       showLoadingDots(); 
        formData.append('myFile', inpFile.files[0]);
        xhr.open('post','upload-ppt',false);
        xhr.send(formData); 
        e.preventDefault();
        showDownloadBtn();
    }); 

    let showLoadingDots = function(){

        document.getElementById("LoadDots").style.display = "inline";

    }
    let hideLoadingDots = function(){

        document.getElementById("LoadDots").style.display = "none";

    }

    
    let showDownloadBtn = function(){
        
        let  div = document.createElement('div');
        let  form = document.getElementById('DownBtn')
        let input = document.createElement("input");
        let submit = document.createElement('button');



        form.setAttribute("method", "post");
        form.setAttribute("action", "download");

        
        
        input.setAttribute("type", "hidden");
        input.setAttribute('name','dwnFile');
        input.setAttribute("value", `${file_to_download}`);

        submit.appendChild(document.createTextNode('Download'))
        submit.setAttribute("type", "submit");
        submit.setAttribute("value", "Download");

        hideLoadingDots();
        form.appendChild(div);
        div.appendChild(input);
        div.appendChild(submit);
        

    }
    
}