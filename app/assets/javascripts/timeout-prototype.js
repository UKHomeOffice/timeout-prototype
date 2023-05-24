/*
  This code aims to: 
    - Simulate the display a modal after a set period of time.
    - Simulate the timeout of the page after a set period of inactivity and redirect to another page.
    
  @TODO MOSCOW

    **** MUST
    @todo - set, confirm and update timings on HTML pages. -> 3 minutes
    @todo - set timeout on HTML page to be 60secs
    
    **** COULD HAVE (its only a prototype)
    @todo - scroll - lock background scroll
    @todo - minute/second plurals - removing the S when singular.

*/

$( document ).ready(function() {
  // Initiate page variables.
  MILLISECOND_COUNT = 1000;    // Used for the timers to tick in seconds.
  TIMEOUT_TIME_SECONDS = 5;  // Time before page times out, in seconds.

  // Initialise the variables for the countdown from the page.
  // - Can only be set once the modal is visible on the page.
  countdownNum = 0; // any integer
  countdownUnit = ''; // can only be minutes or seconds.

  // The timer objects
  modalTrigger = ''; // Initialise as a string for no reason.
  modalTimeout = ''; // Initialise as a string for no reason.

  // Trigger screen reader announce when true.
  srAnnounce = false;

  // Focus element - to set and return to after the modal is closed.
  focusElement = '';

   // If modal page, then start the countdown to show the modal.
   if(window.location.pathname == '/scenario2/upload-photo') {
    startPageTimeoutCount();
  }
  // If the page timeout, then just activate the text updates.
  if(window.location.pathname == '/scenario-1/time-out-page') {
    setUpRedirectCountdown();
  }   
});

// Countdown to trigger the timeout modal on the page.
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
        // set the element with current focus (for tab navigation - so we can return to where we left off).
        // focusElement = $(document.activeElement);
        // console.log(document.activeElement);
        // trigger a click on the modal - @todo find out why.
        //$('#label_modal_1').click();
        console.log(document.activeElement);
        // add the modal class to the element.
        $(document.activeElement).addClass('js-modal').click();

        // We've timed out so call the redirect function to move on.
        setUpRedirectCountdown();
    }
  }, MILLISECOND_COUNT)
};

// Countdown for the redirect on the modal.
setUpRedirectCountdown = () => {
  countdownNum = $('#timeout--countdown').text(); // any integer - set from the text on the HTML page.
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

    // console.log(_time);
    
    // At intervals of 40 and 20 seconds, announce the time remaining.
    if(_time == 40 || _time == 20) {
      _mins--;
      srAnnounce = true; // We want to announce the time every minute. 
    }
    // When we reach 0, cancel the timer and call the redirect function.
    if(_time == 0) {  
      clearInterval(modalTimeout);
      timeoutAndRedirect();
    }

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
  
    // When newTime gets to 0.
  }, MILLISECOND_COUNT);

  initResets();
};

// Set the display text, and if on a screenreader increment, then update the text to announce.
updateDisplayText = (_val, _unit) => {
  $('#timeout--countdown').text(_val);
  $('#timeout--countdown-unit').text(_unit); 
  if(srAnnounce == true) {
    var _text = $('#timeout--p').text();
    $('#timeout--announce').text(_text);
   //console.log('screenreader: '+_text); 
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
  // Set the focus element to be where we left off before the modal.
  // focusElement.focus();
  // console.log(focusElement);
  // Begin again.
  startPageTimeoutCount();
};

timeoutAndRedirect = () => {
  // redirect to signed-out page.
  window.location.replace("signed-out");
};
