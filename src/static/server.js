const WS_PROTO = "ws://";
const WS_ROUTE = "/echo";
const IA_ROUTE = "/ia";

//handles logging - tuning
function log(topic, message) {
  console.log("[" + topic + "] " + message);
}

//When message sent to connection it creates divs containing the message and timestamp
function wsMessageHandler(event) {
  const payload = JSON.parse(event.data);
  log("WS Response", "Received message: '" + event.data + "'");

  const messages = document.getElementById("messages");
  const message = document.createElement("div");
  message.className = "message";

  const space = document.createElement("br");
  const space2 = document.createElement("br");
  const contentElement = document.createElement("span");
  contentElement.className = "message-content";
  contentElement.appendChild(document.createTextNode(payload.message));
  message.appendChild(contentElement);
  message.appendChild(space);
  message.appendChild(space2);
  let child = messages.appendChild(message);
  /**
   * Result <div id="messages">
   *              <div class="message">
   *                 <span class="message-content">Hello</span>
   *             </div>
   *        </div>
   */

  child.scrollIntoView();

  var tests = document.getElementsByClassName("message");
  console.log(tests);
  if (tests.length > 3) {
    tests[0].remove();
    tests[0].remove();
    tests[0].remove();
  }
}

function iaWsMessageHandler(event) {
  const payload = JSON.parse(event.data);
  log("WS Response", "Received message: '" + event.data + "'");
}

//Sends message to connection
function sendMessage(connection, message) {
  log("Client", 'sending message "' + message + '"');
  connection.send(message);
}

function openWebSocket(route, messageHandler) {
  connection = new WebSocket(WS_PROTO + window.location.host + route);
  connection.onerror = (error) => {
    log("WS", error);
  };
  connection.onmessage = messageHandler;
  return connection;
}

// When DOM is loaded, add event listeners
document.addEventListener("DOMContentLoaded", (e) => {
  const inputField = document.getElementById("userInput");
  const echoConnection = openWebSocket(WS_ROUTE, wsMessageHandler);
  const iaConnection = openWebSocket(IA_ROUTE, iaWsMessageHandler);
  inputField.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      const command = inputField.value.trim();
      if (command !== "") {
        const payload = {
          message: command,
        };
        sendMessage(echoConnection, JSON.stringify(payload));
        inputField.value = "";
      }
    }
  });
  log("OnLoad", "Add event listeners");
});
