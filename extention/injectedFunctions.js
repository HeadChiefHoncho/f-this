// ----------------------------
//     FUNCTION INJECTION
// ----------------------------

var originalBody;

function findAndReplace(filter) {
    revert();
    var root = document.body;
    for (i in filter.find) {
        var findRegex = new RegExp(filter.find[i]);
        replaceText(findRegex, filter.replace[i], root);
    }
}

function revert() {
    document.body = originalBody.cloneNode(true);
}

function replaceText(findRegex, replace, node) {
    var children = node.childNodes;
    if (node.nodeType == 3) {
        node.data = node.data.replace(findRegex, replace);
    }
    for (var child in children) {
        replaceText(findRegex, replace, children[child]);
    }
}

// ----------------------------
//            SETUP
// ----------------------------

$(document).ready(function() {
    originalBody = document.body.cloneNode(true);
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        switch(request.type) {
            case "find-and-replace":
                findAndReplace(request.filter);
                break;
            case "check-loaded":
                sendResponse({type: "check-loaded", done: true});
                break;
            case "revert":
                revert();
                break;
        }
        return true;
    });
});
