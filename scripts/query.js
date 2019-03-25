const electron = require('electron')
const { ipcRenderer } = electron
const dates = require('date-and-time')
var now = new Date();
document.getElementById('back').addEventListener('click',(e)=>{
  e.preventDefault();
  ipcRenderer.send('back')
})
document.getElementById('add').addEventListener('click',(e)=>{
  e.preventDefault();
  ipcRenderer.send('Date',"fromquery");
})
document.getElementById('dateheader').innerText = dates.format(now, 'MMM DD');  
window.onload = function () {
  ipcRenderer.send('senddata')

  ipcRenderer.on('getdata', (e, activity) => {
    var count =0
    activity.forEach((item) => {
      let d = new Date(item.date)
      var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear();
      let activitytablerow = document.getElementById('activitytable')
      activitytablerow.innerHTML += `
        <tr id = ${count} >
          <th hidden scope="row">${item.id}</th>
          <td>${item.name}</td>
          <td>${item.description}</td>
          <td>${datestring}</td>
          <td><button style ="margin:2px" id="edit${count}" onclick= "editfunc(this)"  class="btn btn-primary col-md-4"> Edit </button><button id="delete${count}" onclick= "deletefunc(${item.id},this)" class="btn btn-danger"> Delete</button></td>
        </tr> `
        count++;
    })
  })
}
function editfunc(pval){
  let td =document.getElementById(pval.id).parentElement.parentElement
  let test = document.getElementById(td.id).children
  let id = test[0].innerHTML
  let name = test[1].innerHTML
  let description = test[2].innerHTML
  ipcRenderer.send('edit',id,name,description,'toquery')
}
function deletefunc(itemId,pval){
var result = confirm("Are you sure you want to delete the selected item ?");
if (result) {
  document.getElementById(pval.id).parentElement.parentElement.remove();
 
  ipcRenderer.send('deleteitem',itemId)
  alert('deleted')
}
}