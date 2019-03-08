const electron = require('electron')
const { ipcRenderer } = electron
let today = new Date();
//console.log(today)
let currentMonth = today.getMonth();
//console.log(currentMonth)
let currentYear = today.getFullYear();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year) {
    console.log(month)
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;


    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth) {
                row.appendChild(document.createElement("td"));
            }

            else {
                let cell = document.createElement("td");
                cell.setAttribute("id", date)
                cell.addEventListener('click', (e) => {
                    //console.log(e.target.id)
                    let cells = document.getElementsByClassName("bg-info")
                    console.log(cells)
                    if (cells) {
                        for (var item of cells) {
                            let box = document.getElementById(item.id)
                            box.className = ""
                        }
                    }
                    cell.setAttribute("class", "bg-info")
                    let actualmonth= month+1
                    let dateval = e.target.id
                    if(dateval<10){
                        dateval = '0'+dateval
                    }
                    if(actualmonth<10){
                        actualmonth = '0'+actualmonth;
                        //console.log(actualmonth);
                    }
                    let querydate= year+'-'+ actualmonth + '-' + dateval
                    ipcRenderer.send('openrecord',querydate)

                })

                let cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("bg-info");
                }
                // color today's date
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row); // appending each row into calendar body.
    }
}

const dates = require('date-and-time')
var now = new Date();
document.getElementById('presentmonth').innerText = dates.format(now, 'MMM DD');  
document.getElementById('today').addEventListener('click',()=>{
    
    var todaysDate = dates.format(now, 'MMM');  

    ipcRenderer.send('Date',todaysDate);

});
document.getElementById('yesterday').addEventListener('click',()=>{
    
    var yesterdaysDate = dates.format(now, 'MMM');  

    console.log(yesterdaysDate)

    ipcRenderer.send('previousdate',yesterdaysDate);

});


document.getElementById('episodes').addEventListener('click',()=>{
    ipcRenderer.send('episodes');
})