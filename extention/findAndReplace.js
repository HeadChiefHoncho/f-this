function findAndReplace(find, replace) {
    alert("find and replace called");
    var root = document.body;
    alert("now onto replacing");
    alert(root.innerHTML);
    replaceText(find, replace, root);
}

function replaceText(find, replace, node) {
    var children = node.childNodes;
    if (node.nodeType == 3) {
        node.data = node.data.replace(find, replace);
    }
    for (var child in children) {
        replaceText(find, replace, children[child]);
    }
}

window.onload = function() {
   alert("loaded");
   chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        switch(request.type) {
            case "find-and-replace":
                alert("message recieved");
                findAndReplace(request.data.find, request.data.replace);
            break;
        }
        return true;
    });
}
