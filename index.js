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
let backtargetforedit
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
    mainWindow.loadURL(`file://${__dirname}/views/main.html`);
})

ipcMain.on('Date', (e, fromquery ) => {
    thisdate = 'today'
    if(fromquery!="fromquery"){
        epi ="today"
    }
    else {
        epi="fromquery"
    }
    mainWindow.loadURL(`file://${__dirname}/views/addactivity.html`)
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript(``, userGesture = true, function () {
        })
    })
})
let epi;
ipcMain.on('fromepisodes',(e,fromepisodes)=>{
    thisdate = 'today',
    epi=fromepisodes;
    mainWindow.webContents.loadURL(`file://${__dirname}/views/addactivity.html`)
});
ipcMain.on('checkforbcakfromepisodes',(e)=>{
    mainWindow.webContents.send('checkbackforepisodes',epi)
})
ipcMain.on('back', () => {
    mainWindow.loadURL(`file://${__dirname}/views/main.html`);
})
ipcMain.on('backonepisodes', () => {
    mainWindow.loadURL(`file://${__dirname}/views/episodes.html`);
})
ipcMain.on('previousdate', (e) => {
    thisdate = 'yesterday';
    epi = "previous";
    mainWindow.loadURL(`file://${__dirname}/views/addactivity.html`);
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
    mainWindow.loadURL(`file://${__dirname}/views/query.html`)
})
ipcMain.on('loadquery',(e)=>{
    mainWindow.loadURL(`file://${__dirname}/views/query.html`)
})

ipcMain.on('episodes', (e) => {
    mainWindow.loadURL(`file://${__dirname}/views/episodes.html`)
})
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

ipcMain.on('edit', (e, id, name, description,backtarget) => {
    backtargetforedit=backtarget;
    editid = id, editname = name, editdescription = description;
    mainWindow.loadURL(`file://${__dirname}/views/edit.html`)
})
ipcMain.on('editWindowLoad', (e) => {
    mainWindow.webContents.send('editWindowloaded', editid, editname, editdescription,backtargetforedit)
})
ipcMain.on('backfromedit',(e)=>{
    mainWindow.loadURL(`file://${__dirname}/views/query.html`)
})
ipcMain.on('confirmedit', (e, id, description) => {
    knex('Activity').where({ id: id }).update({ description: description }).then(() => {
        mainWindow.loadURL(`file://${__dirname}/views/query.html`)
    })
})
ipcMain.on('episodewindowloaded', (e, presentmonth) => {

    let tetsval = presentmonth + '%'
    let childrenepisodes = knex.raw('SELECT name, count(childrenid) AS episodes FROM Children as c LEFT OUTER JOIN Activity as a ON c.id=a.childrenid WHERE a.date LIKE ? GROUP BY name ORDER BY count(childrenid) DESC', [tetsval])
   
    childrenepisodes.then((item) => {

        item.forEach((ep) => {
            mainWindow.webContents.send('getepisodes', ep)
        })
    }).catch((err) => { console.log(err); throw err })

})

ipcMain.on('showDetails', (e, name) => {
    e.preventDefault()
    if(name!=""){
        nameforquery =name
    }
    mainWindow.loadURL(`file://${__dirname}/views/showepisodedetails.html`)
 })
ipcMain.on('showepisodedetails',(e)=>{
    e.preventDefault()
    mainWindow.webContents.send('showname',nameforquery)
    let presentdate = new Date()
    let currentdate = dates.format(presentdate, 'YYYY-MM')
    
    let str = currentdate + '%'

    let episoderesult= knex.raw('select a.id,name,date,description from Activity  as a inner join Children as c on c.id=a.childrenid WHERE a.date LIKE ? and c.name = ?',[str,nameforquery])
    episoderesult.then((episode) => {
        mainWindow.webContents.send('childactivities', episode)
    })
})


app.on('window-all-closed', () => app.quit());



