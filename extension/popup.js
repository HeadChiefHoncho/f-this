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
        contentType: "application/json",
        url: url,
        data: JSON.stringify(filter),
        success: onCreateFilterSuccess,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);
            document.getElementById('name').style.borderColor = "red";
        }
    });
}

var onCreateFilterSuccess = function(newFilter) {
    console.log("success");
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
        var entry = document.createElement("button");
        var div = document.createElement("div");
        div.className = "search-result";
        entry.className = "btn btn-xs btn-custom";
        entry.appendChild(document.createTextNode(list[l]));
        div.appendChild(entry);
        searchResultList.appendChild(div);
        entry.addEventListener('click', getOnFilterSelected(list[l]));
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
    var createTab = document.getElementById('create_tab');
    var searchTab = document.getElementById('search_tab');
    createPanel.style.display = "block";
    searchPanel.style.display = "none";
    createTab.className = "active";
    searchTab.className = "";
}

var showSearchTab = function() {
    var createPanel = document.getElementById('create_panel');
    var searchPanel = document.getElementById('search_panel');
    var createTab = document.getElementById('create_tab');
    var searchTab = document.getElementById('search_tab');
    createPanel.style.display = "none";
    searchPanel.style.display = "block";
    createTab.className = "";
    searchTab.className = "active";
}

var enableUI = function() {
    document.getElementById('save').disabled = false;
    document.getElementById('preview').disabled = false;
    document.getElementById('revert').disabled = false;
}

var addInputElement = function() {
    var findReplaceItem = document.createElement('div');
    findReplaceItem.className = "find-replace-item";

    var findReplaceOne = document.createElement('div');
    findReplaceOne.className = "find-replace";
    var find = document.createElement('input');
    find.type = "text";
    find.placeholder = "find";
    find.id = "find_" + replaceInputs.length;
    find.className = "form-control";

    var findReplaceTwo = document.createElement('div');
    findReplaceTwo.className = "find-replace";
    var replace = document.createElement('input');
    replace.type = "text";
    replace.placeholder = "replace";
    replace.id = "replace_" + replaceInputs.length;
    replace.className = "form-control";

    findReplaceOne.appendChild(find);
    findReplaceTwo.appendChild(replace);
    findReplaceItem.appendChild(findReplaceOne);
    findReplaceItem.appendChild(findReplaceTwo);

    findInputs.push(find);
    replaceInputs.push(replace);
    document.getElementById("find-replace-inputs").appendChild(findReplaceItem);
}

var removeInputElement = function() {
    var container = document.getElementById("find-replace-inputs");
    if (findInputs.length <= 1) {
        return;
    }
    container.removeChild(container.childNodes[container.childNodes.length - 1]);
    findInputs.pop();
    replaceInputs.pop();
}

window.onload = function() {
    showCreateTab();
    addInputElement();
    document.getElementById('save').addEventListener('click', saveFilter);
    document.getElementById('preview').addEventListener('click', preview);
    document.getElementById('revert').addEventListener('click', revert);
    document.getElementById('create_tab').addEventListener('click', showCreateTab);
    document.getElementById('search_tab').addEventListener('click', showSearchTab);
    document.getElementById('add-input').addEventListener('click', addInputElement);
    document.getElementById('remove-input').addEventListener('click', removeInputElement);
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
