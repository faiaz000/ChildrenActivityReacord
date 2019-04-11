const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const dates = require('date-and-time')
const config = require('./src/configs/app.config.js');
const i18n =  require('./src/configs/i18next.config');
const menuFactoryService = require('./src/services/menuFactory');
let testlng='jp';
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
        },
        title: config.title,
        fullscreen: false,
        resizable: false,
    });
    mainWindow.on('closed', () => {
        mainWindow = null
      })
    mainWindow.loadURL(`file://${__dirname}/views/main.html`);
    i18n.on('loaded', (loaded) => {
        i18n.changeLanguage('jp');
        i18n.off('loaded');
      });
     
    i18n.on('languageChanged', (lng) => {
        testlng = lng;
        menuFactoryService.buildMenu(app, mainWindow, i18n);
        mainWindow.webContents.send('bla',testlng)
      });
   
})
ipcMain.on('getlang',(e)=>{
    mainWindow.webContents.send('bla',testlng)
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
ipcMain.on('searchepisodesbymonth',(e,month)=>{
    let thisyear = new Date()
    let searchstring = dates.format(thisyear, 'YYYY-')
    searchstring += month +'%'
   
    let searchedepisodes = knex.raw('SELECT name, count(childrenid) AS episodes FROM Children as c LEFT OUTER JOIN Activity as a ON c.id=a.childrenid WHERE a.date LIKE ? GROUP BY name ORDER BY count(childrenid) DESC', [searchstring])
   
    searchedepisodes.then((item) => {

        item.forEach((ep) => {
            mainWindow.webContents.send('getepisodes', ep)
        })
    }).catch((err) => { console.log(err); throw err })
})
ipcMain.on('opendashboard',(e)=>{
    mainWindow.loadURL(`file://${__dirname}/views/dashboard.html`)
})
ipcMain.on('showchildrenondashboard',(e)=>{
    let children = knex.select().from('Children').orderBy('grade')
    children.then((child) => {
        mainWindow.webContents.send("childrenlistloaded", child);
    })
})
ipcMain.on('searchbygrade',(e,grade)=>{
    let childrenbygrade= knex.select().where({grade:grade}).from('Children')
    childrenbygrade.then((childbygrade)=>{
        mainWindow.webContents.send('childrenlistloaded',childbygrade)
    })
})
let updatechildid;
ipcMain.on('updatechild',(e,id)=>{
   updatechildid=id
    mainWindow.loadURL(`file://${__dirname}/views/editchild.html`) 
})
ipcMain.on('geteditinfo',(e)=>{
    let editinfo = knex('Children').where({id:updatechildid}).select()
    editinfo.then((info)=>{
        mainWindow.webContents.send('editinfo',info)
    })
})
ipcMain.on('updatechildrentorecords',(e,name,grade)=>{
    e.preventDefault();
    knex('Children').where({ id:updatechildid}).update({ name: name, grade:grade }).then(() => {
        mainWindow.loadURL(`file://${__dirname}/views/dashboard.html`)
    })
})
ipcMain.on('addchild',(e)=>{
    mainWindow.loadURL(`file://${__dirname}/views/addchild.html`)
})
ipcMain.on('savechildtorecord',(e,name,grade)=>{
    e.preventDefault();
    knex('Children').insert({name:name,grade:grade}).then().catch((err) => { console.log(err); throw err });
    mainWindow.loadURL(`file://${__dirname}/views/dashboard.html`)

})
ipcMain.on('deletechild',(e,id)=>{
    knex('Children').where({ id: id }).del().then().catch((err) => { console.log(err); throw err });
})

app.on('window-all-closed', () => app.quit());



