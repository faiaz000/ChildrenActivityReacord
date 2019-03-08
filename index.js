const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const dates = require('date-and-time')
var knex = require('knex')({
    client: "sqlite3",
    connection: {
        filename: "./Activity.sqlite"
    },
    useNullAsDefault: false
});
let nameforquery;
let querydate;

let mainWindow;
let thisdate;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1000, height: 900, webPreferences: {
            nodeIntegration: true,
        }
    });
    mainWindow.on('closed', () => {
        win = null
      })
    mainWindow.loadURL(`file://${__dirname}/main.html`);
})

ipcMain.on('Date', (e, todaysDate) => {
    thisdate = 'today'
    mainWindow.loadURL(`file://${__dirname}/addchildren.html`)
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript(`document.getElementById('activityarea').innerText=""`, userGesture = true, function () {
        })
    })
})
ipcMain.on('back', () => {
    mainWindow.loadURL(`file://${__dirname}/main.html`);
})
ipcMain.on('backonepisodes', () => {
    mainWindow.loadURL(`file://${__dirname}/episodes.html`);
})
ipcMain.on('previousdate', (e, previousdate) => {
    thisdate = 'yesterday'
    mainWindow.loadURL(`file://${__dirname}/addchildren.html`);
})
ipcMain.on('checkdate', () => {
    if (thisdate == 'yesterday') {
        mainWindow.webContents.send('showdate', 'yesterday')
    }
    else {
        mainWindow.webContents.send('showdate', 'today')
    }
})

ipcMain.on('openrecord', (e, givendate) => {
    querydate = givendate;
    mainWindow.loadURL(`file://${__dirname}/query.html`)
    //queryWIndow.webContents.send('senddata',querydate)
})

ipcMain.on('episodes', (e) => {
    mainWindow.loadURL(`file://${__dirname}/episodes.html`)
})
//queries
ipcMain.on('senddata', (e) => {
    let str = querydate + '%'
    let activityresult = knex.select('name', 'Activity.id', 'date', 'description').from('Activity').innerJoin('Children', 'Activity.childrenid', 'Children.id').where('date', 'like', str).orderBy('name')
    activityresult.then((activity) => {
        mainWindow.webContents.send('getdata', activity)
    })
})
ipcMain.on('activitywindowloaded', (e) => {
    let childrenlist = knex.select().from('Children')
    childrenlist.then((child) => {
        mainWindow.webContents.send("hello", child);
    })
})
ipcMain.on('addactivity', (e, activity) => {
    knex('Activity').insert(activity).then().catch((err) => { console.log(err); throw err });
})
ipcMain.on('deleteitem', (e, id) => {
    knex('Activity').where({ id: id }).del().then().catch((err) => { console.log(err); throw err });
})

let editid, editname, editdescription;

ipcMain.on('edit', (e, id, name, description) => {
    editid = id, editname = name, editdescription = description;
    mainWindow.loadURL(`file://${__dirname}/edit.html`)
})
ipcMain.on('editWindowLoad', (e) => {
    mainWindow.webContents.send('editWindowloaded', editid, editname, editdescription)
})
ipcMain.on('backfromedit',(e)=>{
    mainWindow.loadURL(`file://${__dirname}/query.html`)
})
ipcMain.on('confirmedit', (e, id, description) => {
    knex('Activity').where({ id: id }).update({ description: description }).then(() => {
       
        mainWindow.loadURL(`file://${__dirname}/query.html`)
    })
})
ipcMain.on('episodewindowloaded', (e, presentmonth) => {

    let tetsval = presentmonth + '%'
    let childrenepisodes = knex.raw('SELECT name, count(childrenid) AS episodes FROM Children as c LEFT OUTER JOIN Activity as a ON c.id=a.childrenid WHERE a.date LIKE ? GROUP BY name ORDER BY count(childrenid) DESC', [tetsval])
   
    childrenepisodes.then((item) => {

        item.forEach((ep) => {
            mainWindow.webContents.send('getepisodes', ep)
        })
    })

})

ipcMain.on('showDetails', (e, name) => {
    e.preventDefault()
    nameforquery =name
    mainWindow.loadURL(`file://${__dirname}/showepisodedetails.html`)
 })
ipcMain.on('showepisodedetails',(e,name)=>{

    e.preventDefault()
    let presentdate = new Date()
    let currentdate = dates.format(presentdate, 'YYYY-MM')
    let queryid;
    let str = currentdate + '%'

    let episoderesult= knex.raw('select name,date,description from Activity  as a inner join Children as c on c.id=a.childrenid WHERE a.date LIKE ? and c.name = ?',[str,nameforquery])
    episoderesult.then((episode) => {
        mainWindow.webContents.send('childactivities', episode)
    })
})


app.on('window-all-closed', () => app.quit());



