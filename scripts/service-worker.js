chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.key === 'createWindow') {
        chrome.windows.create(
            {
                url: chrome.runtime.getURL('show.html'),
                // url: 'https://www.youtube.com/',
                type: 'popup',
                height: 150,
                width: 200,
                left: 1600
            }, 
            function (win) {
                sendResponse({'windows_id': win.id});
            }
        );
    }
    if (message.key === 'removeWindow') {
        windows_id = message.value;
        chrome.windows.remove(
            windows_id, 
            function (call_parameter) {
              console.log(call_parameter); 
            }
        );
    }
    return true;
});