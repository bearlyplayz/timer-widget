let isRunning = undefined, triggerPattern = null;
let hideTimer = 15, hideTimeout = undefined;
let soundAlertUrl = undefined;
let showHour = true, showMinute = true;
let seconds = 0;
let resetSecond = 0;

function hideContainer() {
  document.getElementById("timer-widget").style = "display:none;";
  hideTimeout = undefined;
}

function showContainer() {
  document.getElementById("timer-widget").style = "display:block;";
}

function updateTimer() {
  let timeToDisplay = "";
  const hour = getHours(seconds);
  if (showHour) {
    timeToDisplay += hour + ":";
  } else if (hour > 0) {
    timeToDisplay += hour + ":";
  }

  const minute = getMinutes(seconds);
  if (showMinute) {
    timeToDisplay += minute + ":";
  } else if (minute > 0) {
    timeToDisplay += minute + ":";
  }

  timeToDisplay += getSeconds(seconds);

  document.getElementById("timebox").innerHTML = timeToDisplay;
}

function getHours(num_seconds) {
  return formatNumber(Math.floor(num_seconds / 3600));
}

function getMinutes(num_seconds) {
  return formatNumber(Math.floor((num_seconds % 3600) / 60));
}

function getSeconds(num_seconds) {
  return formatNumber(num_seconds % 60);
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
  if( seconds === 0) {
    clearInterval(isRunning);
    isRunning = undefined;
    soundAlert();
    if(hideTimer > 0) {
      hideTimeout = setTimeout(hideContainer, hideTimer * 1000);
    }
    return;
  }
  seconds -= 1;
}

function resetWidgetTime() {
    seconds = resetSecond;
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
    let s = fields["hour"] * 3600;
    s += fields["minute"] * 60;
    s += fields["second"];
    
    seconds = resetSecond = s;
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
