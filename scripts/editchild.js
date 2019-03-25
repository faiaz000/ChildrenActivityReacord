const electron = require('electron')
const { ipcRenderer } = electron

window.onload = function (){
    ipcRenderer.send('geteditinfo')
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