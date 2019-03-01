const electron = require('electron');
var knex = require('knex')({
    client: "sqlite3",
    connection: {
        filename: "./Activity.sqlite"
    },
    useNullAsDefault: false
});
let querydate;
const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
let addChildrenWindow;
let queryWIndow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1000, height: 900, webPreferences: {
            nodeIntegration: true,

        }
    });

    mainWindow.loadURL(`file://${__dirname}/main.html`);
})
function addWindow() {
    addChildrenWindow = new BrowserWindow({
        width: 1000, height: 900, webPreferences: {
            nodeIntegration: true,

        }
    },

    );
    addChildrenWindow.loadURL(`file://${__dirname}/addchildren.html`)
}
ipcMain.on('Date', (e, todaysDate) => {
    addWindow();

    console.log(todaysDate);

})

ipcMain.on('openrecord', (e, givendate) => {
    
    querydate = givendate;
    console.log(querydate);
    queryWIndow = new BrowserWindow({
        width: 1000, height: 900, webPreferences: {
            nodeIntegration: true,
        }
    });
    queryWIndow.loadURL(`file://${__dirname}/query.html`)
    //queryWIndow.webContents.send('senddata',querydate)
})
ipcMain.on('senddata',(e)=>{
    let str = querydate+'%'
    //console.log(str)
   let activityresult = knex.select('name','Activity.id','date','description').from('Activity').innerJoin('Children','Activity.childrenid','Children.id').where('date', 'like', str).orderBy('name')
   activityresult.then((activity)=>{
    queryWIndow.webContents.send('getdata',activity)
   })
   
})
//test for db
/*ipcMain.on('show',()=>{
    
    let result = knex.select().from('Children');
    result.then((row)=>{
        console.log(row);
    })
    //console.log(result);
})*/
ipcMain.on('activitywindowloaded', (e) => {
    let childrenlist = knex.select().from('Children')
    childrenlist.then((child) => {
        addChildrenWindow.webContents.send("hello", child);
    })


})
ipcMain.on('addactivity', (e, activity) => {
    // console.log('add ' + activity.date,activity.description,person,grade);

    knex('Activity').insert(activity).then(() => console.log('inserted')).catch((err) => { console.log(err); throw err });
    /*let activityidquery= knex.select('id').from('Activity').orderBy('id','desc').limit(1)
    let test;
    activityidquery.then((activityid)=>{
        test = activityid[0]['id']
        console.log(activityid[0]['id'])
        knex('Children').where({name:person}).where({grade:grade}).update({activityId:test}).then();
    })*/
    // 
    //let result = knex.select('id').count
})
app.on('window-all-closed', () => app.quit());



