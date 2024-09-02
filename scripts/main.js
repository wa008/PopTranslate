var window_id = -1;

function CreateDiv(){
    console.log("Created begin");
    var div = document.createElement("div");
    div.id = 'my_overlay'
    div.style.position = "fixed";
    div.style.display = "none";
    div.style.width = "20%";
    div.style.height = "20%";
    div.style.top = '20px';
    div.style.right = '20px';
    div.style.backgroundColor = "rgba(255,255,255,1)";
    div.style.zIndex = "999999999";

    // 设置内边距和边框
    div.style.padding = "10px"; // 增加内边距
    div.style.border = "10px solid"; // 设置边框宽度 
    div.style.overflow = "auto"; // 允许内容滚动 

    div.innerHTML = "Apple<br>苹果 手机品牌<br>苹果 一种水果";
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
    }
};

window.addEventListener('mouseup', function () {
    let selection = window.getSelection().toString();
    if (selection.length > 0) {
        console.log("select message: " + selection);
        openOverlay();
        // chrome.runtime.sendMessage(
        //     {'key': 'createWindow'}, 
        //     (response) => {
        //         console.log('received create window ', response);
        //         window_id = response.windows_id
        //     }
        // );
    }
});

window.addEventListener('mousedown', function () {
    console.log('mousedown'); 
    removeOverlay();
    // console.log(window_id); 
    // if (window_id != -1) {
    //     chrome.runtime.sendMessage(
    //         {'key': 'removeWindow', 'value': window_id}, 
    //         (response) => {
    //             console.log('received remove', response);
    //         }
    //     );
    //     window_id = -1;
    // }
});