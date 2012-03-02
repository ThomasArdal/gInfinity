chrome.extension.sendRequest({ method: "getLocalStorage", key: "enable_focus" }, function (response) {
    if (response.data == "true") {
        document.addEventListener("contextmenu", function(event) {
            if ($(event.target).is(':input')) {
                var xpath = getElementXPath(event.target);
                if (!xpath || xpath == '') {
                    return;
                }

                chrome.extension.sendRequest({ xpath: xpath, method: "context" }, function(response) { });
            }
        });
    }
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

    var elements = getElementsByXPath(document, request.xpath);
    if (elements && elements.length > 0) {
        $(elements[0]).focus();
    }
    sendResponse();
});

$(document).ready(function() {
    chrome.extension.sendRequest({ method: "getLocalStorage", key: "enable_tabs" }, function (response) {
        if (response.data == "true") {
            chrome.extension.sendRequest({ method: "ready" }, function(response) {
            });
        }
    });
});
