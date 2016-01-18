onmessage = function(e) {
  console.log('Message received from main script');
  console.log(e.data);
  postMessage("workerResult");
}
