function save_options() {
  console.log("Saving Configuration...");

  var apikey = document.getElementById('apikey').value;
  var ofpc_server = document.getElementById('ofpc_server').value;
  var last_secs = document.getElementById('last_secs').value;
  var pre_secs = document.getElementById('pre_secs').value;
  var post_secs = document.getElementById('post_secs').value;

  chrome.storage.sync.set({
    apikey: apikey,
    ofpc_server: ofpc_server,
    last_secs: last_secs,
    pre_secs: pre_secs,
    post_secs: post_secs,
  }, function() {
    var status = document.getElementById('status');

    status.textContent = 'Options saved.';
    console.log("Saved API as:"+ apikey);
    console.log("Saved ofpc_server as:"+ ofpc_server);
    console.log("Saved pre_secs as:"+ pre_secs);
    console.log("Saved post_secs as:"+ post_secs);
    console.log("Saved last_secs as:"+ last_secs);

    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  console.log("Restring options");
  chrome.storage.sync.get({
    apikey: '',
    ofpc_server: '',
    pre_secs: '60',
    post_secs: '60',
    last_secs: '600',
  }, function(items) {
    document.getElementById('apikey').value = items.apikey;
    document.getElementById('ofpc_server').value = items.ofpc_server;
    document.getElementById('pre_secs').value = items.pre_secs;
    document.getElementById('post_secs').value = items.post_secs;
    document.getElementById('last_secs').value = items.last_secs;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
