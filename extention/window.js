var showCreateTab = function() {
    var createPanel = document.getElementById('create_panel');
    var searchPanel = document.getElementById('search_panel');
    createPanel.style.display = "block";
    searchPanel.style.display = "none";
}

var showSearchTab = function() {
    var createPanel = document.getElementById('create_panel');
    var searchPanel = document.getElementById('search_panel');
    createPanel.style.display = "none";
    searchPanel.style.display = "block";
}


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

var success = function(newFilter) {
    document.getElementById('name').style.borderColor = null;
    var searchResultList = document.getElementById("search_result_list");
    var entry = document.createElement("li");
    entry.appendChild(document.createTextNode(newFilter));
    searchResultList.appendChild(entry);
}

var populateSearchResults = function(list) {
    var searchResultList = document.getElementById("search_result_list");
    while (searchResultList.firstChild) {
        searchResultList.removeChild(searchResultList.firstChild);
    }
    for (var l in list) {
        var entry = document.createElement("li");
        entry.appendChild(document.createTextNode(list[l]));
        searchResultList.appendChild(entry);
    }
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
}

var loadFilters = function() {
    // $.ajax({
    //     type: "GET",
    //     url: "http://f-this.appspot.com/getFilters",
    //     data: "",
    //     success: populateSearchResults
    //     // error: function(XMLHttpRequest, textStatus, errorThrown) {
    //     //     document.getElementById('search_bar').style.borderColor = "red";
    //     // }
    // });
    $.get("http://f-this.appspot.com/getFilters", "", populateSearchResults, "json");
}

window.onload = function() {
    showCreateTab();
    document.getElementById('save').addEventListener('click', saveFilter);
    document.getElementById('preview').addEventListener('click', preview);
    document.getElementById('revert').addEventListener('click', revert);
    document.getElementById('create_tab').addEventListener('click', showCreateTab);
    document.getElementById('search_tab').addEventListener('click', showSearchTab);
    loadFilters();
    var message = {type: "check-loaded", done: false};
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response){
            if(response.done){
                enableUI();
            }
        });
    });
}
