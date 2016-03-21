var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var system = require("sdk/system");
const {Cu} = require("chrome");

// To read & write content to file
const {TextDecoder, TextEncoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});

var button = buttons.ActionButton({
  id: "sitesecser-link",
  label: "Open SiteSecurityServiceState",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state) {
	tabs.open({
	url: "index.html",
	onReady: runScript
  });
}

function runScript(tab) {
    var file = null;
    if(system.platform == 'winnt'){
        file = system.pathFor("ProfD") + "\\SiteSecurityServiceState.txt";
    }
    else if(system.platform == 'darwin' || system.platform == 'linux')
    {
        file = system.pathFor("ProfD") + "/SiteSecurityServiceState.txt";
    }

    let decoder = new TextDecoder();
    let promise = OS.File.read(file); // Read the complete file as an array
    var worker = tab.attach({
        contentScriptFile: self.data.url("SiteSecSer.js")
    });

    promise = promise.then(
    function onSuccess(array) {
      var text = decoder.decode(array);
      var list = text.split("\n");
      worker.port.emit("onSuccess", list);
      return list;        // Convert this array to a text
    }, function onRejected(array){
          worker.port.emit("onRejected", array);
    }
    );
}