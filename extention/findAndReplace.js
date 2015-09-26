function findAndReplace(find, replace) {
    alert(find);
    alert(replace);
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
    switch(request.type) {
        case "find-and-replace":
            console.log("hey");
            findAndReplace(request.data.find, request.data.replace);
        break;
    }
    return true;
});