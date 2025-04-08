function blockInstagramFeed() {
  const feedSelector = 'article';
  const feeds = document.querySelectorAll(feedSelector);
  
  feeds.forEach(feed => {
    if (!feed.classList.contains('focus-time-blocked')) {
      feed.classList.add('focus-time-blocked');
    }
  });
}

function checkAndBlock() {
  chrome.storage.sync.get(['blockInstagram'], (result) => {
    if (result.blockInstagram) {
      blockInstagramFeed();
    }
  });
}

const observer = new MutationObserver(checkAndBlock);
observer.observe(document.body, { childList: true, subtree: true });

checkAndBlock(); 