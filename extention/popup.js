var filterNames = [];

// ----------------------------
//     FILTER APPLICATION
// ----------------------------

var preview = function() {
    var find = document.getElementById("find").value;
    var replace = document.getElementById("replace").value;
    findAndReplace(find, replace);
}

var useSelectedFilter = function(data) {
    findAndReplace(data.find, data.replace);
}

var getOnFilterSelected = function(f) {
    return function() {
        var filter = f;
        console.log("filter selected");
        $.get("http://f-this.appspot.com/getFilter?name=" + filter, "", useSelectedFilter, "json");
    }
}

var findAndReplace = function(find, replace) {
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

var revert = function() {
    var message = {
        type: "revert"
    }
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}

// ----------------------------
//        DATA CREATION
// ----------------------------

var saveFilter = function() {
    var find = document.getElementById("find").value;
    var replace = document.getElementById("replace").value;
    var name = document.getElementById("name").value;
    var url = "http://f-this.appspot.com/createFilter?name=" + name + "&find=" + find + "&replace=" + replace;
    $.ajax({
        type: "POST",
        url: url,
        data: "",
        success: onCreateFilterSuccess,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            document.getElementById('name').style.borderColor = "red";
        }
    });
}

var onCreateFilterSuccess = function(newFilter) {
    document.getElementById('name').style.borderColor = null;
    var searchResultList = document.getElementById("search_result_list");
    var entry = document.createElement("li");
    entry.appendChild(document.createTextNode(newFilter));
    searchResultList.appendChild(entry);
    filterNames.push(newFilter);
}

// ----------------------------
//        DATA FETCHING
// ----------------------------

var loadFilters = function() {
    $.get("http://f-this.appspot.com/getFilters", "", populateFilters, "json");
}

var populateFilters = function(list) {
    filterNames = list;
    populateSearchResults(list);
}

var populateSearchResults = function(list) {
    var searchResultList = document.getElementById("search_result_list");
    while (searchResultList.firstChild) {
        searchResultList.removeChild(searchResultList.firstChild);
    }
    for (var l in list) {
        var entry = document.createElement("li");
        var div = document.createElement("div");
        div.className = "search-result";
        div.appendChild(document.createTextNode(list[l]));
        entry.appendChild(div);
        searchResultList.appendChild(entry);
        div.addEventListener('click', getOnFilterSelected(list[l]));
    }
}

var updateSearchResults = function() {
    var searchTerm = document.getElementById('search_bar').value;
    var searchResults = [];
    for (var l in filterNames) {
        if (filterNames[l].indexOf(searchTerm) >= 0) {
            searchResults.push(filterNames[l]);
        }
    }
    populateSearchResults(searchResults);
}

// ----------------------------
//           UI SETUP
// ----------------------------
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

window.onload = function() {
    showCreateTab();
    document.getElementById('save').addEventListener('click', saveFilter);
    document.getElementById('preview').addEventListener('click', preview);
    document.getElementById('revert').addEventListener('click', revert);
    document.getElementById('create_tab').addEventListener('click', showCreateTab);
    document.getElementById('search_tab').addEventListener('click', showSearchTab);
    document.getElementById('search_bar').addEventListener('input', updateSearchResults);
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
