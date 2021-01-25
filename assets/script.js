
 //set the variable
let plan1 = [];
let plan2 = {};
let dateA = [];
let dateB = {};
let scheduleArray =[{time:"", text:""}];
let savedDate = [];

let period = moment().format('LL');
previous = 0;
next = 0;
day = 0;

function saveDate(index, time, text)
{
  scheduleArray[index] = time
  scheduleArray[index] = text 

  localStorage.setItem('tasks', scheduleArray)
}

$(document).ready(function() {
  init();

  function init() {
    todaysDate();
    nextDay();
    timeChange();
    showSchedule();
    planFocus();
    storeEvent();
    resetSchedule();
    
  }
  //save current date to localstorage
  function todaysDate() {
    savedDate = JSON.parse(localStorage.getItem(period));

    if (savedDate === null) {
      console.log();
      dateB[''] = period;
      dateA.push(dateB);
      localStorage.setItem(period, JSON.stringify(dateA));
    }
  }
//save previouse and furture localstorage
  function changeDate() {
    let activeStorage = JSON.parse(localStorage.getItem(period));

    if (activeStorage !== null) {
      plan1 = activeStorage;
    } else {
      currentDateObj = {};
      currentDateArr = [];
      currentDateObj[''] = period;
      currentDateArr.push(currentDateObj);
      localStorage.setItem(period, JSON.stringify(currentDateArr));
    }
  }
     //set date, month, year for  current date
   function timeChange (changeDate) {
    if (changeDate !== period) {
      let currentDate = moment().format('dddd MMMM Do, YYYY');
    
      $('#title-date').html(currentDate);
   
    //  dynamicTime();
    }

   //if date was past, show date, but hide time
    if (day < 0) {
      $('#title-date').html(changeDate);
     $('#dynamic-time').hide();
// if date is future, show date, but hide time

   } else if (day > 0) {
      
      $('#title-date').html(changeDate);
      $('#dynamic-time').hide();
 
    //if date is current, show date and time
  } else {
     
      $('#dynamic-time').show();
      dynamicTime();
    }
  }

  //set the time
  function dynamicTime() {
    let currentTime = moment().format('HH:mm:ss');
    $('#dynamic-time').text(currentTime);
    setInterval(dynamicTime, 1000);
  }
// tracking color by date
  function planFocus() {
    let currentHourInt = parseInt(moment().format('HH'));

    let timeIDs = $('#schedule-table tr[id]')
      .map(function() {
        return this.id;
      })
      .get();
//if time was past, inpute area was grey
    if (day < 0) {
      $('.input-area').css('background-color', 'grey');
  //if time is future, inpute area is green     
    } else if (day > 0) {
      $('.input-area').css('background-color', '#3CB371');
   
    } else {
      for (let i = 0; i < timeIDs.length; i++) {
        let timeIDsInt = parseInt(timeIDs[i]);
        if (timeIDsInt < currentHourInt) {
          $('#' + timeIDs[i])
            .find('textarea')
            .css('background-color', 'grey');

   //if time is current, inpute area is purpose   
          } else if (timeIDsInt === currentHourInt) {
          $('#' + timeIDs[i])
            .find('textarea')
            .css('background-color', '#C71585');
        } else {
          $('#' + timeIDs[i])
            .find('textarea')
            .css('background-color', '#3CB371');
        }
      }
    }
   
  }

//set resetbutton schedule

 function resetSchedule() {
    $('#clear-button').on('click', function() {
      plan2 = {};
      plan1.length = 0;
      plan2['date'] = period;
      plan1.push(plan2);

      localStorage.removeItem(period);
      $('.input-area').val('');

      localStorage.setItem(period, JSON.stringify(plan1));
    });
  }
//show schedule by different color
   function showSchedule() {
    savedDate = JSON.parse(localStorage.getItem(period));
    $('.input-area').val('');
    for (let i = 0; i < savedDate.length; i++) {
      let getKey = Object.keys(savedDate[i]);
      let getValue = Object.values(savedDate[i]);
      $('#area-' + getKey).val(getValue[0]);
    }
  }
  
  
  
/* 
  function saveDate2(){
    $('#but').on('click', function() {
    for (let i =0; i < 9; i++) {
     let inputText =  $(this).siblings("#input-area" + i + 1).val();
         $('#btn' + inputText).val(inputTax[0]);

         localStorage.setItem(period, JSON.stringify(dateA));
       
    }
  
  }*/




//set date for previous day
  
     function nextDay() {
    $('ul').on('click', function(e) {
      let dayButtonID = e.target.id;

      if (dayButtonID === 'previous-day') {
        day--;
        changeActive(dayButtonID);

        lastDate = moment().add(day, 'days');
        period = lastDate.format('LL');
        changeDate();
        timeChange(lastDate.format('dddd MMMM Do, YYYY'));
        showSchedule();
        planFocus();
        return period;
    
    //set date for next date
    
    
      } else if (dayButtonID === 'next-day') {
        day++;
        changeActive(dayButtonID);

        nextDate = moment().add(day, 'days');
        period = nextDate.format('LL');
        changeDate();
        timeChange(nextDate.format('dddd MMMM Do, YYYY'));
        showSchedule();
        planFocus();
        return period;
    //return back from previous date or next date to current date
    
      }else {
        day = 0;
        currentDayButtonID = 'current-day';
        changeActive(currentDayButtonID);

        period = moment().format('LL');
        $('.input-area').val('');
        timeChange();
        showSchedule();
        planFocus();
        return period;
      }
    });
  }

 //flex date to allow to go last day and future
 
 function changeActive(page) {
    let activeClass = $('#change-div>ul>li.active');

    plan1.length = 0;
    activeClass.removeClass('active');
    $('#' + page)
      .parent('li')
      .addClass('active');
  }

//save schedule to localstorage
 function storeEvent() {
    $('#btn').on('click', function() {
      let inputeId = $(this)
        .closest('tr')
        .attr('id');
      let textAreaVal = $(this)
        .closest('tr')
        .find('textarea')
        .val()
        .trim();

      storedDate = JSON.parse(localStorage.getItem(scheduleArray));
      plan2 = {};

      plan2[trId] = textAreaVal;
      plan1.push(plan2);
      localStorage.setItem(scheduleArray, JSON.stringify(plan1));

      for (let i = 0; i < storedDate.length; i++) {
        if (storedDate[i].hasOwnProperty(trId)) {
          storedDate[i][inputeId] = textAreaVal;
          plan1 = storedDate;
          localStorage.setItem(period, JSON.stringify(plan1));
          return;
        }
      }
    });
  }
});

/*let dailySchedule =[];
let addDailySchedule= (ev)=>{
  ev.preventDefault();
document.addEventListener('DOMContendLoad', ()=>{
document.getElementById('btn').addEventListener('click', addDailySchedule)
});*/