const socket = io();

const clientsTotal = document.getElementById('clients-total');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const messageForm = document.getElementById('message-form');
const nameInput = document.getElementById('name-input');

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total clients: ${data}`;
});

// Receive previous messages
socket.on('previousMessages', (messages) => {
    messages.forEach(data => addMessageToUI(false, data));
});

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

function sendMessage() {
    if (messageInput.value === '') return; // not send empty messages
    const data = { name: nameInput.value, message: messageInput.value };

    socket.emit('message', data); // Send message to server
    addMessageToUI(true, data);
    messageInput.value = ''; // Clear input
}

// Receive messages from server
socket.on('giveAnyName', (data) => {
    addMessageToUI(false, data);
});

// const isOwnMessage = data.name === nameInput.value;
function addMessageToUI(isOwnMessage, data) {
    const element = `<li class="${isOwnMessage ? 'message-right' : 'message-left'}">
                        <p class="message">
                            ${data.message}
                            <span>${data.name}</span>
                        </p>
                    </li>`;

    messageContainer.innerHTML += element; // Append message to UI
}


