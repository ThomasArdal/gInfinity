function getIndex(input) {
    var index = -1, i = 0, found = false;
    while (i < input.form.length && index == -1)
        if (input.form[i] == input) index = i;
        else i++;
    return index;
}

var codes = new Array(8, 9, 13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39,
                      40, 45, 46, 91, 92, 93, 112, 113, 114, 115, 116, 117, 118,
                      119, 120, 121, 122, 123, 144, 145);

chrome.extension.sendRequest({ method: "getLocalStorage", key: "enable_tabs" }, function (response) {
    if (response.data == "true") {
        document.onkeyup = function (event) {
            if ($.inArray(event.keyCode, codes) == -1) {
                if ($(event.target).is('input')) {
                    if (event.target.maxLength) {
                        if (event.target.value.length >= event.target.maxLength) {
                            var index = (getIndex(event.target) + 1);
                            var mod = index % event.target.form.length;
                            var ctrl = event.target.form[mod];
                            ctrl.focus();
                        }
                    }
                }
            }
        } 
    }
});
