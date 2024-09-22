// html load
document.addEventListener('DOMContentLoaded', function() {
    // set target language
    chrome.storage.local.get('selectedLanguage', function(data) {
        if (data.selectedLanguage !== undefined) {
            document.getElementById('targetLanguage').value = data.selectedLanguage;
        } else {
            selectedLanguage = 'zh-CN';
            chrome.storage.local.set({ 'selectedLanguage': selectedLanguage });
            document.getElementById('targetLanguage').value = selectedLanguage;
        }
    });
    // dictionaryFeature
    chrome.storage.local.get('dictionaryFeature', function(data) {
        if (data.dictionaryFeature !== undefined) {
            document.getElementById('dictionaryFeature').checked = data.dictionaryFeature;
        } else {
            dictionaryFeature = false;
            chrome.storage.local.set({ 'dictionaryFeature': dictionaryFeature });
            document.getElementById('dictionaryFeature').checked = dictionaryFeature;
        }
    });
    // extensionOn
    chrome.storage.local.get('extensionOn', function(data) {
        if (data.extensionOn !== undefined) {
            document.getElementById('extensionOn').checked = data.extensionOn;
        } else {
            extensionOn = true;
            chrome.storage.local.set({ 'extensionOn': extensionOn });
            document.getElementById('extensionOn').checked = extensionOn;
        }
        language = document.getElementById("language-selection-line");
        target_language = document.getElementById("targetLanguage");
        dictionary = document.getElementById("dictionary-feature-line");
        if (document.getElementById('extensionOn').checked == true) {
            language.style.color = 'black';
            target_language.style.color = 'black';
            dictionary.style.color = 'black';
        } else {
            language.style.color = 'silver';
            target_language.style.color = 'silver';
            dictionary.style.color = 'silver';
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

// extensionOn
document.getElementById('extensionOn').addEventListener('change', function() {
    var extensionOn = this.checked;
    language = document.getElementById("language-selection-line");
    target_language = document.getElementById("targetLanguage");
    dictionary = document.getElementById("dictionary-feature-line");
    if (extensionOn === false) {
        language.style.color = 'silver';
        target_language.style.color = 'silver';
        dictionary.style.color = 'silver';
    } else {
        language.style.color = 'black';
        target_language.style.color = 'black';
        dictionary.style.color = 'black';
    }
    chrome.storage.local.set({ 'extensionOn': extensionOn });
    console.log('Automatically saved extensionOn: ' + extensionOn);
});