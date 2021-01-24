
  
var plan1 = [];
var plan2 = {};
var dateA = [];
var dateB = {};
var storeDate;
var savedDate;
var period = moment().format('LL');
previous = 0;
next = 0;
day = 0;

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

  function todaysDate() {
    savedDate = JSON.parse(localStorage.getItem(period));

    if (savedDate === null) {
      console.log('creating');
      dateB['date'] = period;
      dateA.push(dateB);
      localStorage.setItem(period, JSON.stringify(dateA));
    }
  }

  function changeDate() {
    var existingStorage = JSON.parse(localStorage.getItem(period));

    if (existingStorage !== null) {
      plan1 = existingStorage;
    } else {
      currentDateObj = {};
      currentDateArr = [];
      currentDateObj['date'] = period;
      currentDateArr.push(currentDateObj);
      localStorage.setItem(period, JSON.stringify(currentDateArr));
    }
  }

  function timeChange (differentDate) {
    if (differentDate !== period) {
      var currentDate = moment().format('dddd, Do, MMMM, YYYY');
      var currentYear = moment().format('YYYY');
      $('#title-date').html(currentDate);
      $('#title-year').html(currentYear);
      dynamicTime();
    }

    if (day < 0) {
      $('#title-date').html(differentDate);
      $('#title-time').html(
        'Here is what your schedule looked like for this day.'
      );
      $('#dynamic-time').hide();

      var dayOfYear = moment().dayOfYear();
      if (dayOfYear + day === 0) {
        currentYear = previousDate.format('YYYY');
        $('#title-year').html(currentYear);
      }
    } else if (day > 0) {
      currentYear = nextDate.format('YYYY');
      $('#title-date').html(differentDate);
      $('#title-time').html(
        'Here is what your schedule looks like for this day so far.'
      );
      $('#title-year').html(currentYear);
      $('#dynamic-time').hide();
    } else {
      currentYear = moment().format('YYYY');
      $('#title-time').html(
        'Here is your schedule for today. The current time is: '
      );
      $('#title-year').html(currentYear);
      $('#dynamic-time').show();
      dynamicTime();
    }
  }

  function dynamicTime() {
    var currentTime = moment().format('HH:mm:ss');
    $('#dynamic-time').text(currentTime);
    setInterval(dynamicTime, 1000);
  }

  function planFocus() {
    var currentHourInt = parseInt(moment().format('HH'));

    var timeIDs = $('#schedule-table tr[id]')
      .map(function() {
        return this.id;
      })
      .get();

    if (day < 0) {
      $('.input-area').css('background-color', 'grey');
    } else if (day > 0) {
      $('.input-area').css('background-color', '#3CB371');
    } else {
      for (var i = 0; i < timeIDs.length; i++) {
        var timeIDsInt = parseInt(timeIDs[i]);
        if (timeIDsInt < currentHourInt) {
          $('#' + timeIDs[i])
            .find('textarea')
            .css('background-color', 'grey');
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
    // setInterval(planFocus, 1000);
  }

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

  function showSchedule() {
    savedDate = JSON.parse(localStorage.getItem(period));
    $('.input-area').val('');
    for (var i = 0; i < savedDate.length; i++) {
      var getKey = Object.keys(savedDate[i]);
      var getValue = Object.values(savedDate[i]);
      $('#area-' + getKey).val(getValue[0]);
    }
  }

  function nextDay() {
    $('ul').on('click', function(e) {
      var dayButtonID = e.target.id;

      if (dayButtonID === 'previous-day') {
        day--;
        changeActive(dayButtonID);

        previousDate = moment().add(day, 'days');
        period = previousDate.format('LL');
        changeDate();
        timeChange(previousDate.format('dddd, MMMM Do'));
        showSchedule();
        planFocus();
        return period;
      } else if (dayButtonID === 'next-day') {
        day++;
        changeActive(dayButtonID);

        nextDate = moment().add(day, 'days');
        period = nextDate.format('LL');
        changeDate();
        timeChange(nextDate.format('dddd, MMMM Do'));
        showSchedule();
        planFocus();
        return period;
      } else {
        day = 0;
        dayButtonID = 'current-day';
        changeActive(dayButtonID);

        period = moment().format('LL');
        $('.input-area').val('');
        timeChange();
        showSchedule();
        planFocus();
        return period;
      }
    });
  }

  function changeActive(page) {
    var activeClass = $('#change-div>ul>li.active');

    plan1.length = 0;
    activeClass.removeClass('active');
    $('#' + page)
      .parent('li')
      .addClass('active');
  }

  function storeEvent() {
    $('.save-button').on('click', function() {
      var trId = $(this)
        .closest('tr')
        .attr('id');
      var textAreaVal = $(this)
        .closest('tr')
        .find('textarea')
        .val()
        .trim();

      storedDate = JSON.parse(localStorage.getItem(period));
      plan2 = {};

      plan2[trId] = textAreaVal;
      plan1.push(plan2);
      localStorage.setItem(period, JSON.stringify(plan1));

      for (var i = 0; i < storedDate.length; i++) {
        if (storedDate[i].hasOwnProperty(trId)) {
          storedDate[i][trId] = textAreaVal;
          plan1 = storedDate;
          localStorage.setItem(period, JSON.stringify(plan1));
          return;
        }
      }
    });
  }
});

