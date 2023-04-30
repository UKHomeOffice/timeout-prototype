/*
  This code aims to: 
    - Simulate the display a modal after a set period of time.
    - Simulate the timeout of the page after a set period of inactivity and redirect to another page.
    
  @TODO MOSCOW

    **** MUST
    @todo - confirm and update timings on HTML pages.

    **** COULD HAVE (its only a prototype)
    @todo - look at when we announce the change to the times on screen reader?
    @todo - minute/second plurals - removing the S when singular.

*/

$( document ).ready(function() {
    // Initiate page variables.
    MILLISECOND_COUNT = 1000;    // Used for the timers to tick in seconds.
    TIMEOUT_TIME_SECONDS = 3;  // Time before page times out, in seconds.

    // Initialise the variables for the countdown from the page.
    // - Can only be set once the modal is visible on the page.
    countdownNum = 0; // any integer
    countdownUnit = ''; // can only be minutes or seconds.

    // The timer objects
    modalTrigger = ''; // Initialise as a string for no reason.
    modalTimeout = ''; // Initialise as a string for no reason.

    // Trigger screen reader announce when true.
    srAnnounce = false;

    /*

      Script will only run on the page path names below.

    */

    // If modal page, then start the countdown to show the modal.
    if(window.location.pathname == '/scenario2/upload-photo') {
      startPageTimeoutCount();
    }
    // If the page timeout, then just activate the text updates.
    if(window.location.pathname == '/scenario-1/time-out-page') {
      setUpRedirectCountdown();
    }
});

startPageTimeoutCount = () => {
    // Create a time count to increment (could be done via the timer itself, but its what we have).
    var _time = TIMEOUT_TIME_SECONDS;
    // Create the time which triggers the modal window to appear.
    modalTrigger = setInterval(function() {
        // reduce the time count by 1 on each tick of the timer.
        _time--;
        console.log('time: '+_time);
        // When the time count.
        if (_time == 0) {
            // stop timer.
            clearInterval(modalTrigger);
            // trigger a click on the modal - @todo find out why.
            $('#label_modal_1').click();
            // We've timed out so call the redirect function to move on.
            setUpRedirectCountdown();
        }
    }, MILLISECOND_COUNT)
};

setUpRedirectCountdown = () => {

  countdownNum = $('#timeout--countdown').text(); // any integer.
  countdownUnit = $('#timeout--countdown-unit').text(); // can only be minutes or seconds.

  if(countdownUnit == 'minutes') {
      var _mins = countdownNum;
      var _time = (countdownNum * 60);
      var _minsChange = _time - 60; //set the next minute to change the display.
  }else{
      var _time = countdownNum;
  }

  // create a new timer when the redirect function is called to time the redirect.
  modalTimeout = setInterval(function() {
    // reduce newTime count by 1 on each tick of the timer.
    _time--;
    // Screenreader announce should always be false on each timer tick, unless conditions are set after this time.
    srAnnounce = false;

    console.log(_time);

    // Display minutes until we have 1 minute to go, then change to countdown by the second.
    if(countdownUnit == 'minutes') {

      // Reduce the main minute count.
      if(_time == _minsChange) {
        _mins--;
        _minsChange = _time - 60;
        srAnnounce = true; // We want to announce the time every minute.
      }

      // For this prototype we are assuming 59 will only ever be seconds.
      if(_time == 59) {
        console.log(_time);
        // set the unit to seconds from here onwards.
        countdownUnit = 'seconds';
        updateDisplayText(_time, countdownUnit);
      }else{
        updateDisplayText(_mins, countdownUnit);
      }

    }else{
      // update the seconds.
      updateDisplayText(_time, countdownUnit);
    }

    // When we reach 0, cancel the timer and call the redirect function.
    if(_time == 0) {
      clearInterval(modalTimeout);
      timeoutAndRedirect();
    }
  
    // When newTime gets to 0.
  }, MILLISECOND_COUNT);

  initResets();
};

updateDisplayText = (_val, _unit) => {
  $('#timeout--countdown').text(_val);
  $('#timeout--countdown-unit').text(_unit); 
  if(srAnnounce == true) {
    var _text = $('#timeout--p').text();
    $('#timeout--announce').text(_text); 
  }
};

initResets = () => {
  // Remove the timer if the modal close button is clicked.
  $('#js-modal-close').click(function() {
    resetAll();
  });
  // Remove the timer if the escape key is clicked.
  $('body').keypress(function(e){
    if(e.key == 'Escape'){
      resetAll();
    }
  });
};

resetAll = () => {
  // Clear timeout.
  clearInterval(modalTrigger);
  clearInterval(modalTimeout);
  // Begin again.
  startPageTimeoutCount();
};

timeoutAndRedirect = () => {
  // redirect to signed-out page.
  window.location.replace("signed-out");
};
