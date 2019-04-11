const electron = require('electron')
const { ipcRenderer } = electron;
const dates = require('date-and-time')
var now = new Date();
let nm;
const i18n =  require('../src/configs/i18next.config');
let lang = "jp"

window.onload = function(){
    
   ipcRenderer.send('showepisodedetails') 
   ipcRenderer.send('getlang')
    
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
            <button id="edit${count}" value="${activity.name}"class="btn btn-primary edt" onclick="editfunc(this)">Edit</button> 
            <button class="btn btn-danger dlt" onclick = "deletefunc(${activity.id})">Delete</button>
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
    if (lang =="en"){
        var result = confirm("Are you sure you want to delete the selected item ?");
        if (result) {
         
          ipcRenderer.send('deleteitem',itemId)
          alert('deleted')
          location.reload();
        }
    }
    else if (lang=="jp"){
        var result = confirm("選択したアイテムを削除してよろしいですか？");
        if (result) {
          ipcRenderer.send('deleteitem',itemId)
          alert('削除しました')
          location.reload();
        }
      }
    else if (lang=="zh"){
        var result = confirm("您确定要删除所选项吗 ?");
        if (result) {
          ipcRenderer.send('deleteitem',itemId)
          alert('删除')
          location.reload();
        }
    }
    else {
        var result = confirm("Are you sure you want to delete the selected item ?");
        if (result) {
         
          ipcRenderer.send('deleteitem',itemId)
          alert('deleted')
          location.reload();
        }
    }
   
}
ipcRenderer.on('bla',(e,lng)=>{
    lang=lng
    i18n.changeLanguage(lng);
    i18n.on('languageChanged', () => {
      $('.edt').each(function(i, obj) {
            obj.innerText= i18n.t('Edit')
      }),
      
      $('.dlt').each(function(i, obj) {
            obj.innerText= i18n.t('Delete')
      }),
      document.getElementById('back').innerText = i18n.t('Back'),
      document.getElementById('thactivity').innerText = i18n.t('Activity'),
      document.getElementById('thdate').innerText = i18n.t('Date'),
      document.getElementById('thaction').innerText=i18n.t('Action'),
      document.getElementById('episodedetails').innerText=i18n.t('Episode Details')
      document.getElementById('add').innerText = i18n.t('Add Activity')
      
    });
})