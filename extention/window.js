var findAndReplace = function() {
    chrome.extension.sendMessage({
        type: "find-and-replace",
        data: {
            find: "hello",
            replace: "goodbye"
        }
    });
}

document.getElementById('my-button').addEventListener('click', findAndReplace);