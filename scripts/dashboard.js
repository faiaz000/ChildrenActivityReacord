const electron = require('electron')
const { ipcRenderer } = electron
const i18n =  require('../src/configs/i18next.config');
let lang = "jp"
document.getElementById('back').addEventListener('click',() => {
   
    ipcRenderer.send('back')
})

window.onload = ()=>{
    ipcRenderer.send('showchildrenondashboard')
    //ipcRenderer.send('getlang')
}
ipcRenderer.on('childrenlistloaded',(e,children)=>{
    let count=0;
    children.forEach(child => {
        document.getElementById('episodetablebody').innerHTML += `
    <tr id = ${count}>
        <th hidden scope="row">${child.id}</th>
        <td>${child.name}</td>
        <td>${child.grade}</td>
        <td><button style ="margin:2px"  id=${child.id} onclick="editChild(this.id)" class="btn btn-primary col-md-3 edt"> Edit </button><button  id = ${child.id} onclick="deleteChild(this.id)" class="btn btn-danger col-md-3 dlt"> Delete</button></td>
    </tr>
    `
    count++
    });
    ipcRenderer.send('getlang')
    
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
    
    if (lang =="en"){
        let confirmation = confirm("Are you sure you want to delete the selected item ?");
        if (confirmation) {
         
          ipcRenderer.send('deletechild',id)
          alert('deleted')
          location.reload();
        }
    }
    else if (lang=="jp"){
        let confirmation = confirm("選択したアイテムを削除してよろしいですか？");
        if (confirmation) {
          ipcRenderer.send('deletechild',id)
          alert('削除しました')
          location.reload();
        }
      }
    else if (lang=="zh"){
        let confirmation = confirm("您确定要删除所选项吗 ?");
        if (confirmation) {
          ipcRenderer.send('deletechild',id)
          alert('删除')
          location.reload();
        }
    }
    else {
        let confirmation = confirm("Are you sure you want to delete the selected item ?");
        if (confirmation) {
         
          ipcRenderer.send('deletechild',id)
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
      document.getElementById('addchild').innerText = i18n.t('Add Child'),
      document.getElementById('thname').innerText = i18n.t('Name'),
      document.getElementById('thaction').innerText=i18n.t('Action'),
      document.getElementById('dropdownMenuButton').innerText=i18n.t('Grade'),
      document.getElementById('thgrade').innerText=i18n.t('Grade'),
      document.getElementById('dashboard').innerText=i18n.t('Dashboard'),
      document.getElementById('grade1').innerText=i18n.t('grade1')
      document.getElementById('grade2').innerText=i18n.t('grade2')
      document.getElementById('grade3').innerText=i18n.t('grade3')
      document.getElementById('grade4').innerText=i18n.t('grade4')
      document.getElementById('grade5').innerText=i18n.t('grade5')
      document.getElementById('grade6').innerText=i18n.t('grade6')
      document.getElementById('all').innerText=i18n.t('All')

      
     
      
    });
})