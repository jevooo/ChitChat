const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

// join room
socket.emit('joinRoom', { username, room })

// get room/user info
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

// server message
socket.on('message', message => {
    updateMessageBoard(message);

    // autoscroll with messages
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // get message text
    const msg = e.target.elements.msg.value;

    // clear input and focus
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
    
    // send message to server
    socket.emit('chatMessage', msg)
});

// output message
function updateMessageBoard(message) {
    const div = document.createElement('div');
    div.classList.add('message');


    // tag holding username and time
    const msgInfo = document.createElement('p');
    msgInfo.classList.add('meta');
    msgInfo.textContent = message.username;

    const time = document.createElement('span');
    time.textContent = message.time;
    msgInfo.append(' ', time);

    // tag holding the body of the message
    const msgBody = document.createElement('p');
    msgBody.classList.add('text');
    msgBody.textContent = message.text;

    div.append(msgInfo, msgBody);

    // append div to board
    document.querySelector('.chat-messages').append(div);
}

// put room name on dom
function outputRoomName(room) {
    roomName.innerText = room;
}

// add user names to dom`
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach(user =>  userList.append(userHTML(user)));
}

function userHTML(user) {
    const li = document.createElement('li');
    li.textContent = user.username;
    return li;
}