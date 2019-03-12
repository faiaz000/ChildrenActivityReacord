const electron = require('electron')
const { ipcRenderer } = electron;
const dates = require('date-and-time')
var now = new Date();
let nm;

window.onload = function(){
    
   ipcRenderer.send('showepisodedetails') 
    
}
document.getElementById('add').addEventListener('click', () => {
   // var todaysDate = dates.format(now, 'MMM');  

   ipcRenderer.send('fromepisodes','fromshowdetails');
})
document.getElementById('back').addEventListener('click',(e)=>{
    //$("tbody").children().remove()
    e.preventDefault();
    ipcRenderer.send('backonepisodes')
  })
ipcRenderer.on('showname',(e,name)=>{
    document.getElementById('name').innerText = name
})
ipcRenderer.on('childactivities',(e,activities)=>{
    activities.forEach((activity)=>{
       let count = 0;
        document.getElementById('episodetablebody').innerHTML += `
    <tr  id = ${count}>
        <th hidden scope="row">${activity.id}</th>
        <td hidden>${activity.name}</td>
        <td>${activity.description}</td>
        <td>${activity.date}</td>
        <td> 
            <button id="edit${count}" value="${activity.name}"class="btn btn-primary" onclick="editfunc(this)">Edit</button> 
            <button class="btn btn-danger" onclick = "deletefunc(${activity.id})">Delete</button>
        </td>
    </tr>
    `
    count++;
    })
    
})
function editfunc(pval){
    let td =document.getElementById(pval.id).parentElement.parentElement
    let test = document.getElementById(td.id).children
    let id = test[0].innerHTML
    let name= test[1].innerHTML
    let description = test[2].innerHTML
    ipcRenderer.send('edit',id,name,description,'toshowdetails')
  }
function deletefunc(itemId){
    var result = confirm("Are you sure you want to delete the selected item ?");
    if (result) {
      //document.getElementById(pval.id).parentElement.parentElement.remove();
      ipcRenderer.send('deleteitem',itemId)
      alert('deleted')
      location.reload();
    }
}