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

        e.preventDefault();
        formData.append('myFile', inpFile.files[0]);
        xhr.open('post','upload-ppt',false);
        xhr.send(formData);
        showDownloadBtn();
        
    }); 

    console.log('ciao');
    

    let showDownloadBtn = function(){
        let  down = document.getElementById("DownBtn");
        let  form = document.createElement("form");
        let input = document.createElement("input");
        var s = document.createElement('button');


        form.setAttribute("method", "post");
        form.setAttribute("action", "download");

        
        input.setAttribute("type", "hidden");
        input.setAttribute("value", "12345");

        s.appendChild(document.createTextNode('Download'))
        s.setAttribute("type", "button");
        s.setAttribute("value", "Submit");

        form.appendChild(input);
        form.appendChild(s);

        down.appendChild(form);
                
        
    }

    /* let downloadBtn = document.createElement('button');
            let input = document.createElement('input');
            let form = document.getElementById('DownForm');
            let div = document.getElementById8('DownBtn');
            
            form.setAttribute('action','download');
            form.setAttribute('method','post');

            //input.setAttribute('type','hidden');
            //input.setAttribute('value', `123455`);

            downloadBtn.setAttribute('type','button');
            downloadBtn.appendChild(document.createTextNode('Download'));

            div.getElementById('DownBtn').appendChild(input);
            div.appendChild(downloadBtn); */




    
}