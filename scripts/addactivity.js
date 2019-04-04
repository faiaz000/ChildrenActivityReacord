    const electron = require('electron');
    const toast = require('toastr')
    const { ipcRenderer } = electron
    const Activity = require('../Activity')
    const dates = require('date-and-time')
    let showdate = 'today'
    var now = new Date();
    let showchildren=[];
    let childrenids=[];
    var peoplelist = [];
    let yesterday = dates.addDays(now, -1);
    let fromepisodes;
   
    document.getElementById('back').addEventListener('click',(e)=>{
      e.preventDefault();
     ipcRenderer.send('checkforbcakfromepisodes');
     
     
    });
    ipcRenderer.on('checkbackforepisodes',(e,f)=>{
      fromepisodes =f 
      if(fromepisodes=="fromepisodes"){
        ipcRenderer.send('episodes')
        }
        else if (fromepisodes=="fromshowdetails"){
          ipcRenderer.send('showDetails',"")
        }
       else if (fromepisodes=="fromquery"){
         ipcRenderer.send('loadquery')
       }
        else { 
          ipcRenderer.send('back')
        }
      });
  
    window.onload = function () {

     ipcRenderer.send('checkdate')
     ipcRenderer.on('showdate',(e,d)=>{
       showdate=d
       if(showdate=='yesterday'){
        document.getElementById('selecteddate').valueAsDate = yesterday
       }
       else{
        document.getElementById('selecteddate').valueAsDate = now
       }
     })
     ipcRenderer.send('activitywindowloaded')
   
    
     ipcRenderer.on('hello', (e, childrenlist) => {
       let testindex =0
       childrenlist.forEach((child) => {
         let div = document.getElementById(child.grade)
         div.innerHTML += `<label class="checkbox-inline"><input id="${child.id}" name= "people" type="checkbox"  value="${child.name}"> ${child.name} </label>`
         showchildren.push(child.name)
         childrenids.push(child.id)
       })
     });
     
    }
   
    document.getElementById('addtask').addEventListener('click', () => {
    
      var selecteddate = document.getElementById('selecteddate').value
      document.getElementById('dateheader').innerText = "Selected Date : "+ selecteddate
      var text = document.getElementById('areaactivity').value
      document.getElementById('activityparagraph').innerText = text
      let index=0
      showchildren.forEach((item)=>{
        if(text.includes(item)){
          //console.log('hello Adrian')
          document.getElementById(childrenids[index]).checked = true;
        }
        index++
      })
    })
   
    document.getElementById('dismiss').addEventListener('click', () => {
      document.getElementById('participants').innerText = ""
      peoplelist = [];
      $('input[type=checkbox]').each(function () {
        this.checked = false;
      });
    })
    document.getElementById('dismisstop').addEventListener('click', () => {
      document.getElementById('participants').innerText = ""
      peoplelist = [];
      $('input[type=checkbox]').each(function () {
        this.checked = false;
      });
    })

    document.getElementById('confirm').addEventListener('click', (e) => {
      e.preventDefault();
      $.each($("input[name='people']:checked"), function () {
        peoplelist.push($(this))
        document.getElementById('participants').innerText += ' ' + $(this).val();

      })
      var selecteddate = document.getElementById('selecteddate').value
      peoplelist.forEach((person) => {

        var student = person.attr('value')
        var id = person.attr('id')
        var description = document.getElementById('areaactivity').value
        var dateval = selecteddate
        var activity = new Activity(description, dateval, id)
        ipcRenderer.send('addactivity', activity);
      })
      peoplelist = [];
      $('input[type=checkbox]').each(function () {
        this.checked = false;
      });
      toast.success("Activity is saved")
      document.getElementById('areaactivity').value = ""
    })

