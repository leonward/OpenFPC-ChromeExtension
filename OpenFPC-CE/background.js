// OpenFPC Chrome context plugin
// Leon Ward leon@leonward.com

var rj={};  // results json to store and send back to popup when it asks for it. 
var sj={sip: "",
        dip: "",
        spt: "",
        dpt: "",
        stime: "",
        etime: "",
        limit: "",
};
var ej={error: 'Status Okay'};


function resetConstraints(){
  console.log("DEBUG: Clearing search constraints");
  sj={sip: "",
        dip: "",
        spt: "",
        dpt: "",
        stime: "",
        etime: "",
        limit: "",
  };
}

function ofpcFetchPcap(constraint, type){
  console.log("Fetching selection is "+constraint);
  console.log("Type of selection is "+type);

  chrome.storage.sync.get(["apikey", "pre_secs", "post_secs", "last_secs", "ofpc_server", "ofpc_port"], function(ofpc) {
    var theUrl = "http://" + ofpc.ofpc_server + ":" + ofpc.ofpc_port + "/api/1/fetch?apikey=" + ofpc.apikey + "&" + type + "=" +constraint + "&last=" + ofpc.last_secs;
    console.log(" The URL for request is " +theUrl);
    chrome.downloads.download({
      url: theUrl
    })
  });
}

function ofpcSearch(constraint, type){
  console.log("Searching packets for"+constraint);
 
  chrome.storage.sync.get(["apikey", "pre_secs", "post_secs", "last_secs", "ofpc_server", "ofpc_port"], function(ofpc) {
    var theUrl = "http://" + ofpc.ofpc_server + ":" + ofpc.ofpc_port + "/api/1/search?apikey=" + ofpc.apikey + "&" + type + "=" + constraint + "&last=" + ofpc.last_secs;
    console.log(" The URL for request is " +theUrl);
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange=function(){
      if (xmlHttp.readyState == 4) {
        // Got response back from API
        console.log ("Data is " + xmlHttp.response);
        console.log (xmlHttp);
        var oj = JSON.parse(xmlHttp.response);

        // Show error if we have an error
        console.log(oj);
        rj=oj;
        if (oj.error) {
          console.log("Error performing request:" +oj.error);
          ej=oj;
          console.log("Set ej error as " +ej.error);
        }
      }
    }

    xmlHttp.open( "GET", theUrl, true );
    xmlHttp.send();
  
  });
}


function ofpcFetchIp(highlight,tab){
  console.log("Asked for Fetch of " + highlight.selectionText);
  ofpcFetchPcap(highlight.selectionText,"sip");
}

function ofpcStatus(){
  console.log("Asked for status");
  chrome.storage.sync.get(["apikey", "ofpc_server", "ofpc_port"], function(ofpc) {
    var theUrl = "http://" + ofpc.ofpc_server + ":" + ofpc.ofpc_port + "/api/1/status?apikey=" + ofpc.apikey;
    console.log(" The URL for request is " +theUrl);
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange=function(){
      if (xmlHttp.readyState == 4) {
        // Got response back from API
        console.log ("Data is " + xmlHttp.response);
        console.log (xmlHttp);
        var oj = JSON.parse(xmlHttp.response);

        // Show error if we have an error
        console.log(oj);
        if (oj.error) {
          console.log("Error performing request:" +oj.error);
          ej=oj;
          console.log("Set ej error as " +ej.error);
        } else {
          var text="Node: " + oj['nodename'];
          text= text + "\nDescription: " + oj[oj['nodename']].description.val;
          text= text + "\nTraffic window: " + oj[oj['nodename']].sessiontime.val;
          text= text + "\nReady...";
          alert(text);
        } 
      }
    }

    xmlHttp.open( "GET", theUrl, true );
    xmlHttp.send();
  
  });

}

function ofpcFetchLog(highlight, tab){
  console.log("Asked for Log Fetch");
  console.log("Asked for Fetch of " + highlight.selectionText);
  resetConstraints();
  ofpcFetchPcap(highlight.selectionText,"logline");
}

function ofpcFetchDport(highlight, tab){
  console.log("Asked for Fetch of " + highlight.selectionText);
  ofpcFetchPcap(highlight.selectionText,"dpt");
}

function ofpcFetchSport(highlight, tab){
  console.log("Asked for Fetch of " + highlight.selectionText);
  ofpcFetchPcap(highlight.selectionText,"spt");
}

function ofpcSearchSip(highlight, tab){
  console.log("Asked for search of " + highlight.selectionText);
  resetConstraints();
  sj.sip = highlight.selectionText;
  ofpcSearch(highlight.selectionText,"sip");
}

function ofpcSearchSpt(highlight, tab){
  console.log("Asked for search of " + highlight.selectionText);
  resetConstraints();
  sj.spt = highlight.selectionText;
  ofpcSearch(highlight.selectionText,"spt");
}

function ofpcSearchDip(highlight, tab){
  console.log("Asked for search of " + highlight.selectionText);
  resetConstraints();
  sj.dip = highlight.selectionText;
  ofpcSearch(highlight.selectionText,"dip");
}

function ofpcSearchDpt(highlight, tab){
  console.log("Asked for search of " + highlight.selectionText);
  resetConstraints();
  sj.dpt = highlight.selectionText;
  ofpcSearch(highlight.selectionText,"dpt");
}

function addSip(highlight, tab){
  console.log("Adding " + highlight.selectionText);
  sj.sip = highlight.selectionText;
}

function addDip(highlight, tab){
  console.log("Adding " + highlight.selectionText);
  sj.dip = highlight.selectionText;
}

function addSpt(highlight, tab){
  console.log("Adding " + highlight.selectionText);
  sj.spt = highlight.selectionText;
}

function addDpt(highlight, tab){
  console.log("Adding " + highlight.selectionText);
  sj.dpt = highlight.selectionText;
}

function addStime(highlight, tab){
  console.log("Adding " + highlight.selectionText);
  sj.stime = highlight.selectionText;
}

function addEtime(highlight, tab){
  console.log("Adding " + highlight.selectionText);
  sj.etime = highlight.selectionText;
}


var topmenu = chrome.contextMenus.create(
  {"title": "OpenFPC"});
var getstatus = chrome.contextMenus.create(
  {"title": "Status", "parentId": topmenu, "onclick": ofpcStatus});

// Search menu items
var searchMenu = chrome.contextMenus.create(
  {"title": "Search Sessions", "contexts": ["selection"]});

var sIpSearch = chrome.contextMenus.create(
  {"title": "Source IP Address: %s", "parentId": searchMenu, "contexts": ["selection"], "onclick": ofpcSearchSip});
var sPortSearch = chrome.contextMenus.create(
  {"title": "Source Port: %s", "parentId": searchMenu, "contexts": ["selection"], "onclick": ofpcSearchSpt});

var dIpSearch = chrome.contextMenus.create(
  {"title": "Destination IP Address: %s", "parentId": searchMenu, "contexts": ["selection"], "onclick": ofpcSearchDip});
var dPortSearch = chrome.contextMenus.create(
  {"title": "Destination Port: %s", "parentId": searchMenu, "contexts": ["selection"], "onclick": ofpcSearchDpt});

// Fetch menu items
var fetchmenu = chrome.contextMenus.create(
  {"title": "Fetch packets...", "contexts": ["selection"]});

var ipfetch = chrome.contextMenus.create(
  {"title": "Source IP Address: %s", "parentId": fetchmenu, "contexts": ["selection"], "onclick": ofpcFetchIp});
var portfetch = chrome.contextMenus.create(
  {"title": "Source Port: %s", "parentId": fetchmenu, "contexts": ["selection"], "onclick": ofpcFetchSport});

var ipfetch = chrome.contextMenus.create(
  {"title": "Destination IP Address: %s", "parentId": fetchmenu, "contexts": ["selection"], "onclick": ofpcFetchIp});
var portfetch = chrome.contextMenus.create(
  {"title": "Destination Port: %s", "parentId": fetchmenu, "contexts": ["selection"], "onclick": ofpcFetchDport});

var logfetch = chrome.contextMenus.create(
 {"title": "Work it out: %s", "contexts": ["selection"], "onclick": ofpcFetchLog, "parentId": fetchmenu, });

// Add constraints menu items

var buildQuery = chrome.contextMenus.create(
  {"title": "Build Query...", "contexts": ["selection"]});
var addSip = chrome.contextMenus.create(
  {"title": "Source IP Address: %s", "parentId": buildQuery, "contexts": ["selection"], "onclick": addSip});
var addDip = chrome.contextMenus.create(
  {"title": "Destination IP Address: %s", "parentId": buildQuery, "contexts": ["selection"], "onclick": addDip});
var addDpt = chrome.contextMenus.create(
  {"title": "Destination port: %s", "parentId": buildQuery, "contexts": ["selection"], "onclick": addDpt});
var addSpt = chrome.contextMenus.create(
  {"title": "Source port: %s", "parentId": buildQuery, "contexts": ["selection"], "onclick": addSpt});
var addStime = chrome.contextMenus.create(
  {"title": "Start Time: %s", "parentId": buildQuery, "contexts": ["selection"], "onclick": addStime});
var addCelear = chrome.contextMenus.create(
  {"title": "Clear constraints", "parentId": buildQuery, "contexts": ["selection"], "onclick": resetConstraints});
// Listen for the popup to ask if there are already results to show when it's opened.

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method == "getSearchResults") {
    sendResponse(rj);
  } else if (request.method == "getSearchConstraints") {
    console.log("Sending Search constraints to popup" + sj);
    console.log(sj);
    sendResponse(sj);
  } else if (request.method == "getError") {
    console.log("Sending Error text" + ej.error);
    console.log(ej);
    sendResponse(ej);
  } else  {
    console.log("No idea what is being asked of me with "+request.method);
    sendResponse({}); 
   return true; 
  }
});


