const dates = require('date-and-time')
const electron = require('electron')
const { ipcRenderer } = electron
let now = new Date()
document.getElementById('back').addEventListener('click',(e)=>{
    e.preventDefault();
    ipcRenderer.send('back')
})
document.getElementById('add').addEventListener('click',()=>{
    //var todaysDate = dates.format(now, 'MMM');  

    ipcRenderer.send('fromepisodes','fromepisodes');
  })
window.onload = function () {
    //console.log("hello");
   
    document.getElementById('dateheader').innerText = dates.format(now, 'MMM DD');
    let today = dates.format(now, 'YYYY-MM');
    let month = dates.format(now,'MMM')
    document.getElementById('dropdownMenuButton').innerText = month
    ipcRenderer.send('episodewindowloaded', today)

}
ipcRenderer.on('getepisodes', (e, episodes) => {

    let tbody = document.getElementById('episodetablebody')
    tbody.innerHTML += `
    <tr>
        <td>${episodes.name}</td>
        <td>${episodes.episodes}</td>
        <td><button class="btn" style ="margin:2px" value="${episodes.name}" onclick= "showDetails(this.value)" >Show Details</td>
    </tr>
    `

})
function showDetails(value) {
    ipcRenderer.send('showDetails', value)
}
function selectMonth(item){

    document.getElementById('dropdownMenuButton').innerText= item.text
    document.getElementById('episodetablebody').innerHTML = ""

    console.log(item.id)
   
   ipcRenderer.send('searchepisodesbymonth',item.id)
  
}