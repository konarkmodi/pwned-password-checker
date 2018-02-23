if(typeof('chrome') === 'undefined') {
  var chrome = browser;
}

function tabListener(tabId, changeInfo, tab) {
  try {
    if (changeInfo.status == 'complete' && tab.status == 'complete' && tab.url != undefined) {
        if (tab.url.startsWith('https://') || tab.url.startsWith('http://') || tab.url.startsWith('about:blank')) {
            // We should execute the content script, with runAt, instead of setting timeout in content script.
            chrome.tabs.executeScript(tabId, {file: contentScriptPath, runAt: 'document_end', all_frames: true});
            // chrome.tabs.executeScript(tabId, {file: 'test.js', runAt: 'document_start'});
        }
    }
  } catch(ee){}
}

chrome.tabs.onUpdated.addListener(tabListener);