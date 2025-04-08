let timeLeft = 25 * 60;
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startTimer');
const resetButton = document.getElementById('resetTimer');
const facebookToggle = document.getElementById('facebookToggle');
const instagramToggle = document.getElementById('instagramToggle');

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateDisplay() {
  chrome.storage.sync.get(['timerState'], (result) => {
    const { timeLeft: storedTimeLeft, isRunning: storedIsRunning } = result.timerState || {};
    
    timeLeft = storedTimeLeft || 25 * 60;
    isRunning = storedIsRunning || false;
    
    timerDisplay.textContent = formatTime(timeLeft);
    startButton.textContent = isRunning ? 'Pause' : (timeLeft < 25 * 60 ? 'Resume' : 'Start Focus');
  });
}

// Update display every second
setInterval(updateDisplay, 1000);

// Initial display update
updateDisplay();

startButton.addEventListener('click', () => {
  if (!isRunning) {
    chrome.runtime.sendMessage({
      action: 'startTimer',
      timeLeft: timeLeft
    });
  } else {
    chrome.runtime.sendMessage({
      action: 'pauseTimer',
      timeLeft: timeLeft
    });
  }
  isRunning = !isRunning;
  startButton.textContent = isRunning ? 'Pause' : 'Resume';
});

resetButton.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'resetTimer' });
  isRunning = false;
  timeLeft = 25 * 60;
  timerDisplay.textContent = formatTime(timeLeft);
  startButton.textContent = 'Start Focus';
});

function saveSettings() {
  chrome.storage.sync.set({
    blockFacebook: facebookToggle.checked,
    blockInstagram: instagramToggle.checked,
  });
}

facebookToggle.addEventListener('change', saveSettings);
instagramToggle.addEventListener('change', saveSettings);

chrome.storage.sync.get(['blockFacebook', 'blockInstagram'], (result) => {
  facebookToggle.checked = result.blockFacebook ?? true;
  instagramToggle.checked = result.blockInstagram ?? true;
}); 