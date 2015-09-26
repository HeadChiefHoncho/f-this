var originalRoot;

function findAndReplace(find, replace) {
    // alert("find and replace called");
    revert();
    var root = document.body; // Cloning original root, so that new find & replace operates on original content
    // alert("now onto replacing");
    // alert(root.innerHTML);
    var findRegex = new RegExp(find);
    replaceText(findRegex, replace, root);
}

function revert() {
    document.body = originalRoot.cloneNode(true);
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

$(document).ready(function() {
   //alert("loaded");
   originalRoot = document.body.cloneNode(true);
   chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        switch(request.type) {
            case "find-and-replace":
                // alert("message recieved");
                findAndReplace(request.data.find, request.data.replace);
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
