var window_id = -1;
var previous_selection = "";
console.log(window.navigator.language);

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
    console.log("Created begin");
    var div = document.createElement("div");
    div.id = 'my_overlay'
    div.style.position = "fixed";
    div.style.display = "none";
    div.style.width = "20%";
    div.style.height = "20%";
    div.style.top = '10px';
    div.style.right = '10px';
    div.style.backgroundColor = "rgba(255,255,255,1)";
    div.style.zIndex = "999999999";
    div.style.padding = "10px"; // 增加内边距
    div.style.overflow = "auto"; // 允许内容滚动
    div.style.resize = 'vertical'; // make div scalable
    div.style.overflow = 'auto'; // make div scalable
    div.style.boxShadow = "1px 1px 10px 5px gray" // 阴影

    div.innerHTML = "Loading...";
    document.body.insertBefore(div, document.body.firstChild);
    console.log("Created end");
}
CreateDiv();

function openOverlay(){
    if (document.getElementById("my_overlay").style.display != "block") {
        console.log("open overlay!");
        document.getElementById("my_overlay").style.display = "block";
    }
};

function removeOverlay(){
    if (document.getElementById("my_overlay").style.display != "none") {
        console.log("Removing overlay!");
        document.getElementById("my_overlay").style.display = "none";
        document.getElementById("my_overlay").innerHTML = "Loading...";
    }
};

function isInTargetDiv(evt) {
    var rect = document.getElementById("my_overlay").getBoundingClientRect();
    if (evt.clientY >= rect.top && evt.clientY <= rect.bottom && 
                evt.clientX >= rect.left && evt.clientX <= rect.right) {
        return true;
    } else {
        return false;
    }
}

async function requestTranslation(selection, target_language) {
    let gitignore_path = chrome.runtime.getURL(".gitignore")
    console.log('gitignore_path ' + gitignore_path);
    console.log('target_language ' + target_language);
    res_json = await getLocalParameter(gitignore_path)
    google_translation_api_key = res_json['google_translation_api_key'];
    let url = "https://translation.googleapis.com/language/translate/v2?key=" + google_translation_api_key;  // Modified
    console.log(url);
    console.log('debug 1' + selection);
    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({  // Modified 
            target: target_language,
            q: selection
        }),
    });
    console.log('debug requet end');
    let response_json = await response.json();
    return response_json;
}

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


window.addEventListener('mouseup', function (evt) {
    console.log('mouseup');
    let selection = window.getSelection().toString();
    if (isInTargetDiv(evt) == false && selection.length > 0 && selection != ' ') {
        console.log("select message: " + selection);
        previous_selection = selection;
        (async() => {
            // 从存储中获取选中的语言 
            let target_language = 'en';
            let local_target_language = await readLocalStorage('selectedLanguage');
            if (local_target_language.length >= 2) {
                console.log('read from local language ' + local_target_language);
                target_language = local_target_language;
            }
            console.log('target_language ' + target_language);
            let response_json = await requestTranslation(selection, target_language);
            console.log(response_json);
            translation = response_json['data']['translations'][0]['translatedText'];
            raw_language = response_json['data']['translations'][0]['detectedSourceLanguage'];
            if (raw_language != target_language) {
                openOverlay();
                let prefix = raw_language + " -> " + target_language + "<br>"
                console.log('target_language ' + target_language);
                document.getElementById("my_overlay").innerHTML = prefix + translation;
                console.log(translation);
            } else {
                console.log('same language: ' + raw_language);
            }
        })()
    }
});

window.addEventListener('mousedown', function (evt) {
    if (isInTargetDiv(evt)) {
        console.log('in rect');
    } else {
        console.log('out rect');
        console.log('mousedown'); 
        removeOverlay();
    }
});

