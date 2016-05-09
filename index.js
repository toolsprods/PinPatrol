var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var system = require("sdk/system");
const {Cu} = require("chrome");

// To read & write content to file
const {TextDecoder, TextEncoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});


var button = buttons.ActionButton({
  id: "pinpatrol-link",
  label: "Open PinPatrol",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
    onClick: handleClick
});
var panel = require("sdk/panel").Panel({
    width: 90,
    height: 80,
    contentURL: self.data.url("loading.html"),
    onHide: handleHide,

});

function handleHide() {
    button.state('window', {checked: false});
}


function handleClick(state) {
    panel.show({
        position: button
    });

	tabs.open({
        url: "index.html",
	    onReady: runScript,
  });


}

function runScript(tab) {
    var file = null;
    if(system.platform === 'winnt'){
        file = system.pathFor("ProfD") + "\\SiteSecurityServiceState.txt";
    }
    else if(system.platform === 'darwin' || system.platform === 'linux')
    {
        file = system.pathFor("ProfD") + "/SiteSecurityServiceState.txt";
    }

    let decoder = new TextDecoder();
    let promise = OS.File.read(file); // Read the complete file as an array
    var worker = tab.attach({
        contentScriptFile: [
            self.data.url("jquery.min.js"),
            self.data.url("jquery.dataTables.min.js"),
            self.data.url("dataTables.bootstrap.min.js"),
            self.data.url("bootstrap.min.js"),
            self.data.url("SiteSecSer.js"),
        ]
    });
    worker.port.on("close-tab", function(elementContent) {
        panel.hide();
    });

    promise = promise.then(
    function onSuccess(array) {
        var text = decoder.decode(array);
        var list = text.split("\n");
        list.pop(); //delete the last
        worker.port.emit("onSuccess", list);
        worker.port.emit("panel", panel);
        return list;
    }, function onRejected(array){
          worker.port.emit("onRejected", array);
    }
    );



}
