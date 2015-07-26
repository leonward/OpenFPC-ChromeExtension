// popup.js for OpenFPC Chrome extension
// Leon Ward


function ofpcFetch(){
	console.log("fetching");
}

function ofpcSearch(){
	console.log("searching");
}


function formatTime(ts){
  //2015-06-11 17:44:47
  d=new Date(ts*1000);

  if (ts > 1) {
    var yyyy=d.getFullYear();
    var mm=d.getMonth();
    var dd=d.getDate();
    var hrs=d.getHours();
    var mins=d.getMinutes();
    var secs=d.getSeconds();
    ++mm;
    var hts= yyyy + "-" + mm + "-" + dd + " " + hrs + ":" + mins + ":" + secs;
    console.log("Formatted time of unix timestamp " + ts + " is " + hts);
    return(hts);
  } else {
    console.log("Date input didn't make sense" + ts);
    return("");
  }
}

function showError(){
  console.log("Asking if there is an error to show..");
     chrome.runtime.sendMessage({
      method: "getError",
    },
    function(j){
      console.log("And the error response was...");
      console.log(j);

      if (j.error) {
        var errorHtml = "<br>" + j.error + "<br>";
        error.innerHTML=errorHtml;
      }
    });
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
      var dip = document.getElementById('dip');
      var spt = document.getElementById('spt');
      var dpt = document.getElementById('dpt');
      var stime = document.getElementById('stime');
      var etime = document.getElementById('etime');
      sip.value = sj.sip;
      dip.value = sj.dip;
      dpt.value = sj.dpt;
      spt.value = sj.spt;
      stime.value = sj.stime;
      etime.value = sj.etime;
    });
    chrome.storage.sync.get(["limit"], function(ofpc) {
      var limit = document.getElementById('limit');
      limit.value = ofpc.limit;
    });
}

function ofpcFetch(){
  console.log("Fetching packets");
  var sip = document.getElementById('sip').value;
  var dip = document.getElementById('dip').value;
  var spt = document.getElementById('spt').value;
  var dpt = document.getElementById('dpt').value;
  var stime = document.getElementById('stime').value;
  var etime = document.getElementById('etime').value;
  var logline = document.getElementById('logline').value;

  chrome.storage.sync.get(["apikey", "pre_secs", "post_secs", "last_secs", "ofpc_server", "ofpc_port"], function(ofpc) {
    var theUrl = "http://" + ofpc.ofpc_server + ":" + ofpc.ofpc_port +  "/api/1/fetch?apikey=" + ofpc.apikey;

    if (sip) {theUrl = theUrl + "&sip=" + sip; }
    if (dip) {theUrl = theUrl + "&dip=" + dip; }
    if (spt) {theUrl = theUrl + "&spt=" + spt; }
    if (dpt) {theUrl = theUrl + "&dpt=" + dpt; }
    if (stime) {theUrl = theUrl + "&stime=" + stime; }
    if (etime) {theUrl = theUrl + "&etime=" + etime; }

    if (logline) {theUrl = theUrl + "&logline=" + logline; }

    console.log(" The URL for request is " +theUrl);
    chrome.downloads.download({
      url: theUrl
    })
  });
}

function ofpcSearch(){
  console.log("Searching packets from popup");
  var sip = document.getElementById('sip').value;
  var dip = document.getElementById('dip').value;
  var spt = document.getElementById('spt').value;
  var dpt = document.getElementById('dpt').value;
  var stime = document.getElementById('stime').value;
  var etime = document.getElementById('etime').value;
  var logline = document.getElementById('logline').value;
  var limit = document.getElementById('limit').value;

  chrome.storage.sync.get(["apikey", "pre_secs", "post_secs", "last_secs", "ofpc_server", "ofpc_port"], function(ofpc) {
    var theUrl = "http://" + ofpc.ofpc_server + ":" + ofpc.ofpc_port +  "/api/1/search?apikey=" + ofpc.apikey;

    if (sip) {theUrl = theUrl + "&sip=" + sip; }
    if (dip) {theUrl = theUrl + "&dip=" + dip; }
    if (spt) {theUrl = theUrl + "&spt=" + spt; }
    if (dpt) {theUrl = theUrl + "&dpt=" + dpt; }
    if (stime) {theUrl = theUrl + "&stime=" + stime; }
    if (etime) {theUrl = theUrl + "&etime=" + etime; }
    if (limit) {theUrl = theUrl + "&limit=" + limit; }

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
        if (oj.error) {
          console.log("Error performing request:" +oj.error);
          var errortext = "<b>Error: " + oj.error + "</b>";
          results.innerHTML=errortext;
        } else {
          console.log("Looks like success");
          showTable(oj);
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
  // update timestamp fields in search

  var stime = document.getElementById('stime');
  var etime = document.getElementById('etime');
  stime.value = formatTime(oj.stime);
  etime.value = formatTime(oj.etime);
  console.log("stime from search results is "+oj.stime + "-> " + formatTime(oj.stime));
  console.log("etime from search results is "+oj.etime + "-> " + formatTime(oj.etime));

	console.log("updating table");
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
  table = table + "<table width='1000' border='1'>";
	table = table + "<tr><td> Start Time<td>Source IP<td>Src port<td>Dest IP<td>Dst port<td>Protocol<td>Src bytes<td>Dst bytes<td>Total Bytes<td>Node</tr>";
	for (r = 0; r < rows; r++){
		table=table+"<tr>";

		for (e=0; e<10; ++e ){
			table=table+"<td>";
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
  showError();
}

document.addEventListener('DOMContentLoaded', loadData);
document.getElementById('fetch').addEventListener('click', ofpcFetch);
document.getElementById('search').addEventListener('click', ofpcSearch);

