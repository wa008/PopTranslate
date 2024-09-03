// set default
document.addEventListener('DOMContentLoaded', function() {
    // set target language
    chrome.storage.local.get('selectedLanguage', function(data) {
        if (data.selectedLanguage) {
            document.getElementById('targetLanguage').value = data.selectedLanguage;
        } else {
            selectedLanguage = 'zh-CN';
            chrome.storage.local.set({ 'selectedLanguage': selectedLanguage });
            document.getElementById('targetLanguage').value = selectedLanguage;
        }
    });
    // dictionaryFeature
    chrome.storage.local.get('dictionaryFeature', function(data) {
        if (data.dictionaryFeature) {
            document.getElementById('dictionaryFeature').checked = data.dictionaryFeature;
        } else {
            dictionaryFeature = false;
            chrome.storage.local.set({ 'dictionaryFeature': dictionaryFeature });
            document.getElementById('dictionaryFeature').checked = dictionaryFeature;
        }
    });
});

// target language
document.getElementById('targetLanguage').addEventListener('change', function() {
    var selectedLanguage = this.value;
    chrome.storage.local.set({ 'selectedLanguage': selectedLanguage });
    console.log('Automatically saved target language: ' + selectedLanguage);
});

// dictionaryFeature
document.getElementById('dictionaryFeature').addEventListener('change', function() {
    var dictionaryFeature = this.checked;
    chrome.storage.local.set({ 'dictionaryFeature': dictionaryFeature });
    console.log('Automatically saved dictionaryFeature: ' + dictionaryFeature);
});