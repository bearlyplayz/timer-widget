let isRunning = undefined, triggerPattern = null;
let hideTimer = 15, hideTimeout = undefined;
let soundAlertUrl = undefined;
let showHour = true, showMinute = true;
let hour = 0, minute = 15, second = 0;
let resetHour = 0, resetMinute = 15, resetSecond = 0;

function hideContainer() {
  document.getElementById("timer-widget").style = "display:none;";
  hideTimeout = undefined;
}

function showContainer() {
  document.getElementById("timer-widget").style = "display:block;";
}

function updateTimer() {
  let timeToDisplay = "";
  if (showHour) {
    timeToDisplay += formatNumber(hour) + ":";
  } else if (hour > 0) {
    timeToDisplay += formatNumber(hour) + ":";
  }

  if (showMinute) {
    timeToDisplay += formatNumber(minute) + ":";
  } else if (minute > 0) {
    timeToDisplay += formatNumber(minute) + ":";
  }

  timeToDisplay += formatNumber(second);

  document.getElementById("timebox").innerHTML = timeToDisplay;
}

function formatNumber(number) {
  if (number <= 9) {
    return '0' + number;
  } 
  return number;
}

function soundAlert() {
  if (!soundAlert) {
    return;
  }
  const audio = new Audio(soundAlertUrl);
  audio.play();
}

function exectuteTick() {
  updateTimer();
  if( hour === 0 && minute === 0 && second === 0) {
    clearInterval(isRunning);
    isRunning = undefined;
    soundAlert();
    if(hideTimer > 0) {
      hideTimeout = setTimeout(hideContainer, hideTimer * 1000);
    }
    return;
  }
  if (second > 0) {
    second -= 1;
  } else {
    if (minute > 0) {
      minute -= 1;
      second = 59;
    } else {
      hour -= 1;
      minute = 59;
      second = 59;
    }
  }
}

function resetWidgetTime() {
    hour = resetHour;
    minute = resetMinute;
    second = resetSecond;
    isRunning = setInterval(exectuteTick, 1000);
    if (hideTimeout === undefined) {
      clearTimeout(hideTimeout);
      hideTimeout = undefined;
    }
    showContainer();
}

window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail.event) {
      return;
    }
    const event = obj.detail.event;
    if (event.data.redemption?.toLowerCase() !== triggerPattern) {
      return;
    }
    if (isRunning === undefined) {
      resetWidgetTime();
    }

});

window.addEventListener('onWidgetLoad', function (obj) {
    const fields = obj["detail"]["fieldData"];
    console.debug("########## Fields", fields)
    hour = resetHour = fields["hour"];
    minute = resetMinute = fields["minute"];
    second = resetSecond = fields["second"];
    soundAlertUrl = fields["alertSound"];

    hideTimer = fields["fadeAfterZero"];
    
    showHour = fields["alwaysShowHour"] === "yes" ? true : false;
    showMinute = fields["alwaysShowMinute"] === "yes" ? true : false;
    triggerPattern = fields["triggerPattern"].toLowerCase();

    updateTimer();
    if (hideTimer > 0) {
      hideContainer();
    }
});
