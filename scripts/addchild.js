const electron = require('electron')

const { ipcRenderer } = electron
document.getElementById('back').addEventListener('click',() => {
   
    ipcRenderer.send('opendashboard')
})
document.getElementById('save').addEventListener('click',(e) => {
    e.preventDefault()
    let name = document.getElementById('name').value
    let grade = document.getElementById('selectedgrade').value
    ipcRenderer.send('savechildtorecord',name,grade)
    console.log(name)
})