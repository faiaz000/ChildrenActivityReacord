const electron = require('electron');
    const { ipcRenderer } = electron;
    let editid; 
    let target_destination;
    document.getElementById('back').addEventListener('click',(e)=>{
        e.preventDefault();
        if(target_destination=="toquery"){
            console.log("hi")
            ipcRenderer.send('loadquery') 
        }
        else if (target_destination=='toshowdetails'){
            
            let back_name =document.getElementById('name').innerText 
           
           ipcRenderer.send('showDetails',back_name)
        }
        else{
            ipcRenderer('backfromedit')
        }
    })
    window.onload = () => {
        ipcRenderer.send('editWindowLoad')
    }

    ipcRenderer.on('editWindowloaded', (e, id, name, description,backtarget) => {
        
        target_destination = backtarget
        document.getElementById('name').innerText = name
        document.getElementById('textarea').innerText = description
        editid = id
    })

    document.getElementById('edit').addEventListener('click', () => {
        let description = document.getElementById('textarea').value

        ipcRenderer.send('confirmedit',editid,description)
    })