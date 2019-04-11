const electron = require('electron')
const { ipcRenderer } = electron
const i18n =  require('../src/configs/i18next.config')
window.onload = function (){
    ipcRenderer.send('geteditinfo')
    ipcRenderer.send('getlang')
}
ipcRenderer.on('editinfo',(e,info)=>{
    document.getElementById('name').value = info[0].name
    document.getElementById('selectedgrade').value=info[0].grade
})
document.getElementById('back').addEventListener('click',() => {
    ipcRenderer.send('opendashboard')
})
document.getElementById('save').addEventListener('click',(e)=>{
    e.preventDefault();
    let confirmation = confirm('are you sure you want to update child information ?')
    if(confirmation){
        let name = document.getElementById('name').value
        let grade =  document.getElementById('selectedgrade').value
        ipcRenderer.send('updatechildrentorecords',name,grade)
        alert("deleted")
    }
})
ipcRenderer.on('bla',(e,lng)=>{
    i18n.changeLanguage(lng);
    i18n.on('languageChanged', () => {
        document.getElementById('back').innerText = i18n.t('Back'),
        document.getElementById('lname').innerText = i18n.t('Name')+":",
        document.getElementById('lgrade').innerText = i18n.t('Grade')+":",
        document.getElementById('g1').innerText=i18n.t('grade1'),
        document.getElementById('g2').innerText=i18n.t('grade2'),
        document.getElementById('g3').innerText=i18n.t('grade3'),
        document.getElementById('g4').innerText=i18n.t('grade4'),
        document.getElementById('g5').innerText=i18n.t('grade5'),
        document.getElementById('g6').innerText=i18n.t('grade6'),
        document.getElementById('editchild').innerText = i18n.t('Edit Child'),
        document.getElementById('save').innerText = i18n.t('Submit')
      });
    
})