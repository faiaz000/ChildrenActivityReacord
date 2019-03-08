 var todaysDate = dates.format(now, 'MMM');  

    ipcRenderer.send('Date',todaysDate);