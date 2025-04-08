function blockFacebookFeed() {
  const feedSelector = '[role="main"]';
  const feed = document.querySelector(feedSelector);
  
  if (feed && !feed.classList.contains('focus-time-blocked')) {
    feed.classList.add('focus-time-blocked');
  }
}

function checkAndBlock() {
  chrome.storage.sync.get(['blockFacebook'], (result) => {
    if (result.blockFacebook) {
      blockFacebookFeed();
    }
  });
}

const observer = new MutationObserver(checkAndBlock);
observer.observe(document.body, { childList: true, subtree: true });

checkAndBlock(); 