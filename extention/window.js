

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
        chrome.tabs.sendMessage(tabs[0].id, message)
    });
}

var success = function() {
    alert("Success!");
}

var saveFilter = function() {
    var find = document.getElementById("find").value;
    var replace = document.getElementById("replace").value;
    var name = document.getElementById("name").value;
    var url = "http://f-this.appspot.com/createFilter?name=" + name + "&find=" + find + "&replace=" + replace;
    $.post(url, "", success, "text");
}

window.onload = function() {
    document.getElementById('save').addEventListener('click', saveFilter);
    document.getElementById('preview').addEventListener('click', preview);
}
