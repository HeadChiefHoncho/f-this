var filterNames = [];

var findInputs = [];
var replaceInputs = [];

// ----------------------------
//     FILTER APPLICATION
// ----------------------------

var createFilter = function() {
    name = document.getElementById("name").value;
    find = [];
    replace = [];
    for (var i in findInputs){
        find.push(findInputs[i].value);
        replace.push(replaceInputs[i].value);
    }
    return {"name": name, "find": find, "replace": replace};
}

var preview = function() {
    findAndReplace(createFilter());
}

var useSelectedFilter = function(filter) {
    findAndReplace(filter);
}

var getOnFilterSelected = function(f) {
    return function() {
        var filterName = f;
        console.log("filter selected");
        $.get("http://f-this.appspot.com/getFilter?name=" + filterName, "", useSelectedFilter, "json");
    }
}

var findAndReplace = function(filter) {
    var message = {
            type: "find-and-replace",
            filter: filter
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
    var filter = createFilter();
    var url = "http://f-this.appspot.com/createFilter";
    $.ajax({
        type: "POST",
        url: url,
        data: filter,
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

var addInputElement = function() {
    var findReplaceItem = document.createElement('div');
    findReplaceItem.className = "find-replace-item";
    var findReplace = document.createElement('div');
    findReplace.className = "find-replace";
    var find = document.createElement('input');
    find.type = "text";
    find.id = "find_" + replaceInputs.length;
    var replace = document.createElement('input');
    replace.type = "text";
    replace.id = "replace_" + replaceInputs.length;
    findReplace.appendChild(find);
    findReplace.appendChild(replace);
    findReplaceItem.appendChild(findReplace);

    findInputs.push(find);
    replaceInputs.push(replace);
    document.getElementById("find-replace-inputs").appendChild(findReplaceItem);
}

var removeInputElement = function() {
    var container = document.getElementById("find-replace-inputs");
    container.removeChild(container.childNodes[-1]);
    findInputs.pop();
    replaceInputs.pop();
}

window.onload = function() {
    addInputElement();
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
