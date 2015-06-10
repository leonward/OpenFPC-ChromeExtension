// popup.js for OpenFPC Chrome extension
// Leon Ward


function ofpcFetch(){
	console.log("fetching");
}

function ofpcSearch(){
	console.log("searching");
}

function showResults(){
	console.log("Asking if there are any results to show..");
     chrome.runtime.sendMessage({
      method: "getSearchResults",
    },
    function(j){
      console.log("And the response was...");
      console.log(j);

      if (j.nodename) {
        showTable(j);
      }
    });
}

function showSearch(){
  console.log("Asking for Search Constraints");
     chrome.runtime.sendMessage({
      method: "getSearchConstraints",
    },
    function(sj){
      console.log("And the constraints are...");
      console.log(sj);
      var sip = document.getElementById('sip');
      sip.value = sj.sip;

    });
}

function ofpcFetch(){
  console.log("Fetching packets");
  var sip = document.getElementById('sip').value;
  var dip = document.getElementById('dip').value;
  var spt = document.getElementById('spt').value;
  var dpt = document.getElementById('dpt').value;
  var logline = document.getElementById('logline').value;

  chrome.storage.sync.get(["apikey", "pre_secs", "post_secs", "last_secs", "ofpc_server"], function(ofpc) {
    var theUrl = "http://" + ofpc.ofpc_server + ":4222/api/1/fetch?apikey=" + ofpc.apikey;

    if (sip) {theUrl = theUrl + "&sip=" + sip; }
    if (dip) {theUrl = theUrl + "&dip=" + dip; }
    if (spt) {theUrl = theUrl + "&spt=" + spt; }
    if (dpt) {theUrl = theUrl + "&dpt=" + dpt; }
    if (logline) {theUrl = theUrl + "&logline=" + logline; }

    console.log(" The URL for request is " +theUrl);
    chrome.downloads.download({
      url: theUrl
    })
  });
}

function ofpcSearch(){
  console.log("Searching packets");
  var sip = document.getElementById('sip').value;
  var dip = document.getElementById('dip').value;
  var spt = document.getElementById('spt').value;
  var dpt = document.getElementById('dpt').value;
  var logline = document.getElementById('logline').value;

  chrome.storage.sync.get(["apikey", "pre_secs", "post_secs", "last_secs", "ofpc_server"], function(ofpc) {
    var theUrl = "http://" + ofpc.ofpc_server + ":4222/api/1/search?apikey=" + ofpc.apikey;

    if (sip) {theUrl = theUrl + "&sip=" + sip; }
    if (dip) {theUrl = theUrl + "&dip=" + dip; }
    if (spt) {theUrl = theUrl + "&spt=" + spt; }
    if (dpt) {theUrl = theUrl + "&dpt=" + dpt; }
    if (logline) {theUrl = theUrl + "&logline=" + logline; }

    console.log(" The URL for request is " +theUrl);

    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange=function(){
      if (xmlHttp.readyState == 4) {
        // Got response back from API
        console.log ("Data is " + xmlHttp.response);
        var oj = JSON.parse(xmlHttp.response);

        // Show error if we have an error
        console.log(oj);
        rj=oj;
        console.log("Set rj to oj");
        showTable(oj);
        if (oj.error) {
          console.log("Error performing request:" +oj.error);
        } else {
          console.log("Looks like success");
        }
      }
    }

    xmlHttp.open( "GET", theUrl, true );
    xmlHttp.send();
  
  });
}



function showTable(oj){
	console.log("Showing table fow below json");
	console.log(oj);
	console.log("updaying res");
	var rows=0;
	for(var rl in oj.table){
		if(oj.table.hasOwnProperty(rl)) {
			++rows;
		}
	}

	console.log("Result length is" +rows);
	// For the number of rows in the results returned
	var table = ""
  table = table + "</br><b>Search: </b>" + oj.sql + "</br>";
  table = table + "Search: <table width='1000' border='1'>";
	table = table + "<tr><td> Start Time<td>Source IP<td>Dest IP<td>Src port<td>Dst port<td>Protocol<td>Src bytes<td>Dst bytes<td>Total Bytes<td>Node</tr>";
	for (r = 0; r < rows; r++){
		table=table+"<tr>";

		for (e=0; e<10; ++e ){
			table=table+"<td>";
			console.log(oj.table[r][e])
			table=table+oj.table[r][e];
			table=table+"</td>";
		}
		table=table+"</tr>";

	}
	table=table+"</table>";
	results.innerHTML=table;

}

function loadData(){
  console.log("Loading Data!");
  showResults();
  showSearch();
}

document.addEventListener('DOMContentLoaded', loadData);
document.getElementById('fetch').addEventListener('click', ofpcFetch);
document.getElementById('search').addEventListener('click', ofpcSearch);

