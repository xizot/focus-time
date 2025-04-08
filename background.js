chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    blockFacebook: true,
    blockInstagram: true,
    timerState: {
      timeLeft: 25 * 60,
      isRunning: false,
      endTime: null
    }
  });
});

function updateTimer() {
  chrome.storage.sync.get(['timerState'], (result) => {
    const { isRunning, endTime } = result.timerState || {};
    
    if (isRunning && endTime) {
      const now = Date.now();
      const timeLeft = Math.max(0, Math.ceil((endTime - now) / 1000));
      
      chrome.storage.sync.set({
        timerState: {
          timeLeft,
          isRunning: timeLeft > 0,
          endTime: timeLeft > 0 ? endTime : null
        }
      });

      if (timeLeft === 0) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'assets/icon128.png',
          title: 'Focus Time',
          message: 'Time to take a break! You\'ve completed your focus session.',
        });
      }
    }
  });
}

// Update timer every second when running
setInterval(updateTimer, 1000);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startTimer') {
    chrome.storage.sync.set({
      timerState: {
        timeLeft: request.timeLeft,
        isRunning: true,
        endTime: Date.now() + (request.timeLeft * 1000)
      }
    });
  } else if (request.action === 'pauseTimer') {
    chrome.storage.sync.set({
      timerState: {
        timeLeft: request.timeLeft,
        isRunning: false,
        endTime: null
      }
    });
  } else if (request.action === 'resetTimer') {
    chrome.storage.sync.set({
      timerState: {
        timeLeft: 25 * 60,
        isRunning: false,
        endTime: null
      }
    });
  }
}); 