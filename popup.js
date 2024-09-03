// 在页面加载时设置语言选择框的默认值
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get('selectedLanguage', function(data) {
        if (data.selectedLanguage) {
            document.getElementById('targetLanguage').value = data.selectedLanguage;
        } else {
            document.getElementById('targetLanguage').value = 'en';
        }
    });
});

// 监听语言选择变化事件并保存到本地存储
document.getElementById('targetLanguage').addEventListener('change', function() {
    var selectedLanguage = this.value;
    chrome.storage.local.set({ selectedLanguage: selectedLanguage });
    console.log('Automatically saved target language: ' + selectedLanguage);
});