// Saves options to localStorage.
function save_options() {
    var enableInfiniteScroll = $("#enableInfiniteScroll").is(":checked");
    var enableTabs = $("#enableTabs").is(":checked");
    var enableFocus = $("#enableFocus").is(":checked");
    var enablePing = $("#enablePing").is(":checked");
    var enableLinks = $("#enableLinks").is(":checked");
    try {
        // Infinite scroll
        localStorage["enable_infinite_scroll"] = enableInfiniteScroll;

        // Tabs
        localStorage["enable_tabs"] = enableTabs;

        // Focus
        localStorage["enable_focus"] = enableFocus;

        // Ping
        localStorage["enable_ping"] = enablePing;

        // Links
        localStorage["enable_links"] = enableLinks;

        var message = "Options saved." + (before != after ? " A restart of Chrome is required for your new options to take effect" : "");
    } catch (e) {
        console.log(e);
    }
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    var enableInfiniteScroll = localStorage["enable_infinite_scroll"];
    var enableTabs = localStorage["enable_tabs"];
    var enableFocus = localStorage["enable_focus"];
    var enablePing = localStorage["enable_ping"];
    var enableLinks = localStorage["enable_links"];

    $("#enableInfiniteScroll").attr("checked", enableInfiniteScroll == "true");
    $("#enableTabs").attr("checked", enableTabs == "true");
    $("#enableFocus").attr("checked", enableFocus == "true");
    $("#enablePing").attr("checked", enablePing == "true");
    $("#enableLinks").attr("checked", enableLinks == "true");
}

$(document).ready(function () {
    restore_options();
    $('#saveButton').click(function () {
        save_options();
        return false;
    });
    $('#cancelButton').click(function () {
        restore_options();
        return false;
    });
});
