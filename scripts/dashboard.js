const electron = require('electron')
const { ipcRenderer } = electron

document.getElementById('back').addEventListener('click',() => {
   
    ipcRenderer.send('back')
})

window.onload = ()=>{
    ipcRenderer.send('showchildrenondashboard')
}
ipcRenderer.on('childrenlistloaded',(e,children)=>{
    let count=0;
    children.forEach(child => {
        document.getElementById('episodetablebody').innerHTML += `
    <tr id = ${count}>
        <th hidden scope="row">${child.id}</th>
        <td>${child.name}</td>
        <td>${child.grade}</td>
        <td><button style ="margin:2px"  id=${child.id} onclick="editChild(this.id)" class="btn btn-primary col-md-3"> Edit </button><button  id = ${child.id} onclick="deleteChild(this.id)" class="btn btn-danger col-md-3"> Delete</button></td>
    </tr>
    `
    count++
    });
    
    
})
function dropdownClick(item){

    document.getElementById('dropdownMenuButton').innerText= item.text
    document.getElementById('episodetablebody').innerHTML = ""
    if(item.id=="all"){
        ipcRenderer.send('showchildrenondashboard')
    }
    else {

    }
   
   ipcRenderer.send('searchbygrade',item.id)
  
}
function editChild(item){
 
  ipcRenderer.send('updatechild',item)
}

document.getElementById('addchild').addEventListener('click',(e) => { 

    e.preventDefault()
    ipcRenderer.send('addchild')
})
function deleteChild(id){
    let confirmation = confirm('Are you sure you want to delete this record ?')
    if(confirmation){
        ipcRenderer.send('deletechild',id)
        alert('deleted')
        location.reload()
    }
}
