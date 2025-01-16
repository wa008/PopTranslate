var window_id = -1;
var previous_selection = "";
var flag_update_shape_of_div = false;
var flag_close_div_click = false;
var mouse_down_time = new Date().getTime();

const language_map = new Map([
    ["en", "English"],
    ["zh", "Chinese (Simplified)"],
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
async function CreateDiv() {
    let heightOfDiv = await readLocalStorage('heightOfDiv', "20%");

    var div = document.createElement("div");
    div.id = 'my_overlay'
    div.style.position = "fixed";
    div.style.display = "none";
    div.style.width = "20%";
    div.style.height = heightOfDiv;
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
    document.getElementById("my_overlay").style.fontSize = 'medium';
}

if (document.getElementById("my_overlay") === undefined) {
    (async() => {
        CreateDiv();
    })();
}

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

// try to udpate the shape of div
function updateShapeOfDiv() {
    var current_height = document.getElementById("my_overlay").getBoundingClientRect().height;
    let current_related_height = ((current_height / window.innerHeight * 100) | 0);
    if (current_related_height > 95) {
        current_related_height = 95;
    }
    let current_related_height_str = current_related_height + "%"
    chrome.storage.local.set({ 'heightOfDiv': current_related_height_str });
}

async function requestTranslation(selection, target_language) {
    console.log("Requestting translate service...");
    let response_json = await fetch(`https://translate-pa.googleapis.com/v1/translate?params.client=gtx&query.source_language=en&query.target_language=${target_language}&query.display_language=en-GB&query.text=${selection}&key=AIzaSyDLEeFI5OtFBwYBIoK_jj5m32rZK5CkCXA&data_types=TRANSLATION&data_types=SENTENCE_SPLITS&data_types=BILINGUAL_DICTIONARY_FULL`)
        .then( response => response.json() );

    // let response_json = await response.json();
    translatedText = response_json['translation'];
    language = response_json['sourceLanguage'];
    output = {'translatedText': translatedText, 'detectedLanguage': {'language': language}}
    console.log("response_json: ", response_json);
    console.log("output: ", output);
    return output;
}

// request self-hosted service to get translation
async function requestTranslationSelfHost(selection, target_language) {
    // let gitignore_path = chrome.runtime.getURL("env.gitignore");
    // res_json = await getLocalParameter(gitignore_path);
    // unknown_variable = atob(res_json['unknown_variable']);
    // let url = "https://translation.googleapis.com/language/translate/v2?key=" + unknown_variable.split('_')[1];  // Modified

    console.log("Requestting translate service...");
    let url = "https://translate.informal.top";
    let response = await fetch(url, {
        method: "POST",
        headers: {
                "Content-Type": "application/json",
        },
        body: JSON.stringify({  // Modified 
            target: target_language,
	        source: "auto",
            q: selection
        }),
    });
    let response_json = await response.json();
    return response_json;
}

// read local parameter
const readLocalStorage = async (key, default_value = undefined) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], function (result) {
            if (result[key] === undefined) {
                // reject();
                resolve(default_value);
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

function check_valid_selection(selection) {
    // match numbers 
    const digits = selection.match(/[\d]/g)?.join('') || "";

    // special letter
    if (selection.length <= 1) return false;
    spe_cnt = digits.length;
    // selection.length > 0 && selection != ' '
    const spe_list = ["[", "`", "!", "@", "#", "$", "%", "^", "&", "*", 
        "(", ")", "_", "+", "-", "=", "[", "\\", "]", "{", "}", ";", "'", ":", '"', "|", ",", ".", 
        "<", ">", "/", "?", "~", "]", " "];
    for (const element of selection) {
        if (spe_list.includes(element)) {
            if(selection.length <= 3) {
                return false;
            }
            spe_cnt += 1;
        }
    }
    const SpeChatPercentage = (spe_cnt / selection.length);
    // console.log(SpeChatPercentage, selection.length, spe_cnt, digits.length);
    if (selection.length >= 3 && SpeChatPercentage > 0.6) return false;
    if (selection.length >= 5 && SpeChatPercentage > 0.5) return false;
    if (selection.length >= 10 && SpeChatPercentage > 0.4) return false;
    if (selection.length >= 20 && SpeChatPercentage > 0.3) return false;
    return true;
}

function getChineseRatio(str) {
    const chineseRegex = /[\u4e00-\u9fa5]/g;
    const chineseMatches = str.match(chineseRegex);
    if (!chineseMatches) {
        return 0;
    }
    const chineseCount = chineseMatches.length;
    const totalCount = str.length;
    return chineseCount / totalCount;
}

// trigger when mouse up
window.addEventListener('mouseup', function (evt) {
    mouse_up_time = new Date().getTime();
    var current_click_for_request = Date.now();
    if (flag_update_shape_of_div === true) {
        updateShapeOfDiv();
    }
    // console.log("window.getSelection(): ", window.getSelection());
    // console.log("window.getSelection().tostring(): ", window.getSelection().toString());
    // let {anchorNode, anchorOffset, focusNode, focusOffset} = window.getSelection();
    // console.log(anchorNode);
    // console.log("window.getSelection().anchorNode.innerText: ", window.getSelection().anchorNode.innerText);
    // console.log("window.getSelection().anchorNode.baseURI: ", window.getSelection().anchorNode.baseURI);
    let selection = window.getSelection().toString();
    let baseURI = window.getSelection().anchorNode.baseURI;
    let anchorNodeInnerText = window.getSelection().anchorNode.innerText;
    if (anchorNodeInnerText !== undefined && baseURI.includes('www.reddit.com')) { // speical process for reddit comment
        selection = anchorNodeInnerText;
    }

    let chinese_ratio = getChineseRatio(selection);

    var seletion_flag = check_valid_selection(selection);
    // console.log('mouse time diff: ', mouse_up_time, mouse_down_time, mouse_up_time - mouse_down_time);
    // console.log("seletion_flag: ", seletion_flag, "selection: ", selection);
    if (seletion_flag === true && isInTargetDiv(evt) === false && 
            (flag_close_div_click === false // this click for close div
                || mouse_up_time - mouse_down_time >= 200 // this click for select text again, one click not double clicks
            )
        ) {
        previous_selection = selection;
        (async() => {
            let extensionOn = await readLocalStorage('extensionOn', true);
            if (extensionOn !== true) {
                return ;
            }
            // get language from local storage
            var target_language = await readLocalStorage('selectedLanguage', 'zh');
            let raw_language = 'en', translation = '';
            if (target_language === 'zh' && chinese_ratio > 0.2) {
                raw_language = 'zh';
            } else {
                let response_json = await requestTranslation(selection, target_language);
                translation = response_json['translatedText'];
                if (translation.endsWith(".")) {
                    translation = translation.substring(0, translation.length - 1);
                }
                raw_language = response_json['detectedLanguage']['language'];
            }

            // single word
            if (!selection.includes(' ') && raw_language === 'en') {
                var dictionaryFeature = await readLocalStorage('dictionaryFeature', false);
                // process single word for dictionary
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
    mouse_down_time = new Date().getTime();
    if (document.getElementById("my_overlay") === null) { // creat new div when there isn't, becuase chatGPT.com will delete my div, maybe this's related to generated website
        (async() => {
            CreateDiv();
        })();
    }
    
    if (!isInTargetDiv(evt)) {
        flag_update_shape_of_div = false;
        if (document.getElementById("my_overlay").style.display === "block") {
            flag_close_div_click = true;
        } else {
            flag_close_div_click = false;
        }
        removeOverlay();
    } else {
        flag_close_div_click = false;
        flag_update_shape_of_div = true;
    }
});
// gray
