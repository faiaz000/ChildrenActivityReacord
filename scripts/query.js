
const electron = require('electron')
const { ipcRenderer } = electron
const dates = require('date-and-time')
var now = new Date();
let lang="jp";
const i18n =  require('../src/configs/i18next.config')
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
          <td><button style ="margin:2px" id="edit${count}" onclick= "editfunc(this)"  class=" btn btn-primary col-md-4 edt"> Edit </button><button id="delete${count}" onclick= "deletefunc(${item.id},this)" class="btn btn-danger dlt"> Delete</button></td>
        </tr> `
        count++;
    })
  })
  ipcRenderer.send('getlang')
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
if(lang=="en"){

  var result = confirm("Are you sure you want to delete the selected item ?");
  if (result) {
    document.getElementById(pval.id).parentElement.parentElement.remove();
   
    ipcRenderer.send('deleteitem',itemId)
    alert('deleted')
  }
}
else if (lang=="jp"){
  var result = confirm("選択したアイテムを削除してよろしいですか？");
  if (result) {
    document.getElementById(pval.id).parentElement.parentElement.remove();
   
    ipcRenderer.send('deleteitem',itemId)
    alert('削除しました')
  }
}
else if (lang=="zh"){
  var result = confirm("您确定要删除所选项吗 ?");
  if (result) {
    document.getElementById(pval.id).parentElement.parentElement.remove();
   
    ipcRenderer.send('deleteitem',itemId)
    alert('删除')
  }
}
else{
  var result = confirm("Are you sure you want to delete the selected item ?");
  if (result) {
    document.getElementById(pval.id).parentElement.parentElement.remove();
   
    ipcRenderer.send('deleteitem',itemId)
    alert('deleted')
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
    document.getElementById('Activity').innerText = i18n.t('Activity'),
    document.getElementById('thdate').innerText = i18n.t('Date'),
    document.getElementById('thname').innerText = i18n.t('Name'),
    document.getElementById('thaction').innerText = i18n.t('Action'),
    document.getElementById('activityrecords').innerText = i18n.t('Activity Records'),
    document.getElementById('add').innerText = i18n.t('Add Activity')

  });
})