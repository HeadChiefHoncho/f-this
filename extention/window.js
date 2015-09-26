
var enableUI = function() {
    document.getElementById('save').disabled = false;
    document.getElementById('preview').disabled = false;
    document.getElementById('revert').disabled = false;
}

var revert = function() {
    var message = {
        type: "revert"
    }
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}

var preview = function() {
    var find = document.getElementById("find").value;
    var replace = document.getElementById("replace").value;
    var message = {
            type: "find-and-replace",
            data: {
                find: find,
                replace: replace
            }
        }
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}

var success = function() {
    document.getElementById('name').style.borderColor = null;
}

var saveFilter = function() {
    var find = document.getElementById("find").value;
    var replace = document.getElementById("replace").value;
    var name = document.getElementById("name").value;
    var url = "http://f-this.appspot.com/createFilter?name=" + name + "&find=" + find + "&replace=" + replace;
    $.ajax({
        type: "POST",
        url: url,
        data: "",
        success: success,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            document.getElementById('name').style.borderColor = "red";
        }
    });
    //$.post(url, "", success, "text");
}

window.onload = function() {
    document.getElementById('save').addEventListener('click', saveFilter);
    document.getElementById('preview').addEventListener('click', preview);
    document.getElementById('revert').addEventListener('click', revert);
    var message = {type: "check-loaded", done: false};
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response){
            if(response.done){
                enableUI();
            }
        });
    });
}
