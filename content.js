var window_id = -1;
var previous_selection = "";

const language_map = new Map([
    ["en", "English"],
    ["zh-CN", "Chinese (Simplified)"],
    ["es", "Spanish"],
    ["fr", "French"],
    ["de", "German"],
    ["ja", "Japanese"],
    ["pt", "Portuguese"],
    ["ru", "Russian"],
    ["ar", "Arabic"],
    ["ko", "Korean"],
    ["it", "Italian"],
    ["nl", "Dutch"]
]);
var last_click_for_reqeust = Date.now();

// load local key
async function getLocalParameter(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return json;
}

// creat div show
function CreateDiv(){
    var div = document.createElement("div");
    div.id = 'my_overlay'
    div.style.position = "fixed";
    div.style.display = "none";
    div.style.width = "20%";
    div.style.height = "20%";
    div.style.top = '10px';
    div.style.right = '10px';
    div.style.backgroundColor = "rgba(255,255,255,1)";
    div.style.color = 'rgba(0,0,0,1)';
    div.style.zIndex = "999999999";
    div.style.padding = "10px"; // 增加内边距
    div.style.overflow = "auto"; // 允许内容滚动
    div.style.resize = 'vertical'; // make div scalable
    div.style.overflow = 'auto'; // make div scalable
    div.style.boxShadow = "1px 1px 10px 5px gray" // 阴影

    div.innerHTML = "Loading...";
    document.body.insertBefore(div, document.body.firstChild);
}
CreateDiv();

// show div
function openOverlay(){
    if (document.getElementById("my_overlay").style.display != "block") {
        document.getElementById("my_overlay").style.display = "block";
    }
};

// close div
function removeOverlay(){
    if (document.getElementById("my_overlay").style.display != "none") {
        document.getElementById("my_overlay").style.display = "none";
        document.getElementById("my_overlay").innerHTML = "Loading...";
    }
};

// judge click is in range of div
function isInTargetDiv(evt) {
    var rect = document.getElementById("my_overlay").getBoundingClientRect();
    if (evt.clientY >= rect.top && evt.clientY <= rect.bottom && 
                evt.clientX >= rect.left && evt.clientX <= rect.right) {
        return true;
    } else {
        return false;
    }
}

// request google api to get translation
async function requestTranslation(selection, target_language) {
    let gitignore_path = chrome.runtime.getURL("env.gitignore");
    res_json = await getLocalParameter(gitignore_path);
    unknown_variable = atob(res_json['unknown_variable']);
    let url = "https://translation.googleapis.com/language/translate/v2?key=" + unknown_variable;  // Modified
    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({  // Modified 
            target: target_language,
            q: selection
        }),
    });
    let response_json = await response.json();
    return response_json;
}

// read local parameter
const readLocalStorage = async (key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], function (result) {
            if (result[key] === undefined) {
                reject();
            } else {
                resolve(result[key]);
            }
        });
    });
};

// request dictionary, Thanks https://dictionaryapi.dev/
async function get_output_from_word_translation(selection) {
    let word_request_url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + selection
    let response = await fetch(word_request_url, { method: "GET" });
    let response_json = await response.json();

    var output = "<b>" + selection + "&nbsp;" + response_json[0]['phonetic'] + "</b>" + "<br>"
    limitation_per_partOfSpeech = 3;
    for (var i = 0; i < response_json[0]['meanings'].length; i++) { 
        let currenct = response_json[0]['meanings'][i];
        for (var j = 0; j < Math.min(limitation_per_partOfSpeech, currenct['definitions'].length); j++) {
            let definition = currenct['definitions'][j]['definition'];
            output += "[" + currenct['partOfSpeech'] + "]&nbsp;" + definition + "<br>"
        }
    }
    output += "<a href=" + word_request_url + ">More>></a>";
    return output;
}

// trigger when mouse up
window.addEventListener('mouseup', function (evt) {
    var current_click_for_request = Date.now();
    let selection = window.getSelection().toString();
    if (isInTargetDiv(evt) == false && selection.length > 0 && selection != ' ') {
        previous_selection = selection;
        (async() => {
            // get language from local storage
            var target_language = 'zh-CN';
            try {
                let local_target_language = await readLocalStorage('selectedLanguage');
                if (local_target_language.length >= 2) {
                    target_language = local_target_language;
                }
            }
            catch(err) {            
                console.log('get local language error');
            }
            let response_json = await requestTranslation(selection, target_language);
            translation = response_json['data']['translations'][0]['translatedText'];
            raw_language = response_json['data']['translations'][0]['detectedSourceLanguage'];

            // single word
            if (!selection.includes(' ') && raw_language === 'en') {
                var dictionaryFeature = false;
                try {
                    let localDictionaryFeature = await readLocalStorage('dictionaryFeature');
                    if (localDictionaryFeature !== undefined) {
                        dictionaryFeature = localDictionaryFeature;
                    }
                }
                catch(err) {
                    console.log('get localDictionaryFeature error');
                }
                
                // process single word
                if (dictionaryFeature === true) {
                    openOverlay();
                    try {
                        let output = await get_output_from_word_translation(selection);
                        translation += "<br>" + output; // show target language && dictionary
                    }
                    catch(err) {
                        console.log('get localDictionaryFeature error');
                    }
                }
            }
            // show
            if (raw_language != target_language && current_click_for_request > last_click_for_reqeust) {
                openOverlay();
                // let suffix = language_map.get(raw_language) + " -> " + language_map.get(target_language)
                document.getElementById("my_overlay").innerHTML = translation; // + "<br>" + suffix;
                last_click_for_reqeust = current_click_for_request;
            }
        })();
    }
});

// close div when mouse up
window.addEventListener('mousedown', function (evt) {
    if (!isInTargetDiv(evt)) {
        removeOverlay();
    }
});
