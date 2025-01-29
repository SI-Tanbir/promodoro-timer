let time = 1 * 60; // 25 minutes
let interval;

self.onmessage = (e) => {
  if (e.data === "start") {
    interval = setInterval(() => {
      if (time > 0) {
        time--;
        self.postMessage(time);
      } else {
        clearInterval(interval);
        self.postMessage("done");
      }
    }, 1000);

  } else if (e.data === "stop") {
    clearInterval(interval);

  } else if (e.data === "reset") {
    clearInterval(interval);
    time = 25 * 60; // Reset to 25 minutes
    self.postMessage(time);

  } else if (e.data.action === "update") { 
    // Handling the update action sent from the main thread
    time = e.data.time; // Update time to the new value
    self.postMessage(time); // Send the updated time back to the main thread
  }
};
