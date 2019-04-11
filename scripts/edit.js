const electron = require('electron');
const { ipcRenderer } = electron;
const i18n =  require('../src/configs/i18next.config')
let editid; 
let target_destination;
document.getElementById('back').addEventListener('click',(e)=>{
    e.preventDefault();
    if(target_destination=="toquery"){
       
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
    ipcRenderer.send('getlang')
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
ipcRenderer.on('bla',(e,lng)=>{
    i18n.changeLanguage(lng);
    i18n.on('languageChanged', () => {
      document.getElementById('back').innerText = i18n.t('Back'),
      document.getElementById('activity').innerText = i18n.t('Activity'),
      document.getElementById('edit').innerText=i18n.t('Submit')
      
    });
})