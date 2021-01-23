

  
let schedule1 = [];
let schedule2 = {};
let date1 = [];
let date2 = {};
/*let saveSchedule;*/
let savedDate;
let now = moment().format('LL');
previous = 0;
next = 0;
day = 0;

$(document).ready(function() {
  init();

  function init() {
    todaysDate();
    updateDay();
    timeMove();
    displayTable();
    tableFocus();
    saveTable();
    clearEvent();
  }

  function todaysDate() {
    savedDate = JSON.parse(localStorage.getItem(now));

    if (savedDate === null) {
      console.log();
      date2[''] = now;
      date1.push(dateObj);
      localStorage.setItem(now, JSON.stringify(date1));
    }
  }

  function differentDate() {
    let existingStorage = JSON.parse(localStorage.getItem(now));

    if (existingStorage !== null) {
      schedule1 = existingStorage;
    } else {
      currentDateObj = {};
      currentDateArr = [];
      currentDateObj[''] = now;
      currentDateArr.push(currentDateObj);
      localStorage.setItem(now, JSON.stringify(currentDateArr));
    }
  }

  function timeMove(differentDate) {
    if (differentDate !== now) {
      let currentDate = moment().format('dddd, MMMM YYYY');
       $('#schedule-date').html(currentDate);
       dynamicTime();
    }

    if (day < 0) {
      $('#schedule-date1').html(differentDate);
      $('#dynamic-time').hide();

    var dayOfYear = moment().dayOfYear();
      if (dayOfYear + day === 0) {
        currentYear = previousDate.format('YYYY');
    
      }
    } else if (day > 0) {
      currentYear = nextDate.format('YYYY');
      $('#schedule-date1').html(differentDate);
      $('#title-year').html(currentYear);
      $('#dynamic-time').hide();
    } else {
      currentYear = moment().format('YYYY');
      $('.lead').html();

      $('#dynamic-time').show();
      dynamicTime();
    }
  }

  function dynamicTime() {
    let currentTime = moment().format('HH:mm:ss');
    $('#dynamic-time').text(currentTime);
    setInterval(dynamicTime, 1000);
  }

  function tableFocus() {
    let currentHourInt = parseInt(moment().format('HH'));

    let timeIDs = $('#schedule-table tr[id]')
      .map(function() {
        return this.id;
      })
      .get();

    if (day < 0) {
      $('.input-area').css('background-color', 'gray');
    } else if (day > 0) {
      $('.input-area').css('background-color', 'lightblue');
    } else {
      for (let i = 0; i < timeIDs.length; i++) {
        let timeIDsInt = parseInt(timeIDs[i]);
        if (timeIDsInt < currentHourInt) {
          $('#' + timeIDs[i])
            .find('textarea')
            .css('background-color', 'grey');
        } else if (timeIDsInt === currentHourInt) {
          $('#' + timeIDs[i])
            .find('textarea')
            .css('background-color', '#ccffff');
        } else {
          $('#' + timeIDs[i])
            .find('textarea')
            .css('background-color', 'lightblue');
        }
      }
    }
    // setInterval(scheduleFocus, 1000);
  }

  function clearEvent() {
    $('#clear-schedule').on('click', function() {
      schedule2 = {};
      schedule1.length = 0;
      schedule2[''] = now;
      schedule1.push(schedule2);

      localStorage.removeItem(now);
      $('.input-area').val('');

      localStorage.setItem(now, JSON.stringify(schedule1));
    });
  }

  function displayTable() {
    savedDate = JSON.parse(localStorage.getItem(now));
    $('.input-area').val('');
    for (let i = 0; i < savedDate.length; i++) {
      let getKey = Object.keys(savedDate[i]);
      let getValue = Object.values(savedDate[i]);
      $('#area-' + getKey).val(getValue[0]);
    }
  }

  function updateDay() {
    $('.page1').on('click', function(e) {
      let dayButtonID = e.target.id;

      if (dayButtonID === 'previous-day') {
        day--;
        changeActive(dayButtonID);

        previousDate = moment().add(day, 'days');
        now = previousDate.format('LL');
        differentDate();
        timeMove(previousDate.format('dddd, MMMM Do'));
        displayTable();
        tableFocus();
        return now;
      } else if (dayButtonID === 'next-day') {
        day++;
        changeActive(dayButtonID);

        nextDate = moment().add(day, 'days');
        now = nextDate.format('LL');
        differentDate();
        timeMove(nextDate.format('dddd, MMMM Do'));
        displayTable();
        tableFocus();
        return now;
      } else {
        day = 0;
        dayButtonID = 'current-day';
        changeActive(dayButtonID);

        now = moment().format('LL');
        $('.input-area').val('');
        timeMove();
        displayTable();
        tableFocus();
        return now;
      }
    });
  }

  function changeActive(page) {
    let activeClass = $('.active');

    schedule1.length = 0;
    activeClass.removeClass('active');
    $('#' + page)
      .parent('li')
      .addClass('active');
  }

  function saveTable() {
    $('.save-button').on('click', function() {
      var trId = $(this)
        .closest('tr')
        .attr('id');
      let textAreaVal = $(this)
        .closest('tr')
        .find('textarea')
        .val()
        .trim();

      saveSchedule = JSON.parse(localStorage.getItem(now));
      schedule2 = {};

      schedule2[trId] = textAreaVal;
      schedule1.push(schedule2);
      localStorage.setItem(date, JSON.stringify(schedule1));

      for (let i = 0; i < saveSchedule.length; i++) {
        if (saveSchedule[i].hasOwnProperty(trId)) {
          saveSchedule[i][trId] = textAreaVal;
          schedule1 = saveSchedule;
          localStorage.setItem(date, JSON.stringify(schedule1));
          return;
        }
      }
    });
  }
});


