const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');
let socket = io();

// get the query string
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

// joining the room
socket.emit('joinRoom',{username,room});

// sending message to the server
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    socket.emit('enteredMessage',e.target.elements.msg.value); 
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})

socket.on('message',(msg)=>{
    console.log(msg);
    showMessage(msg);

    // automatic scrolling of messages
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('roomUsers',({room,users})=>{
    // displaying room name
    roomName.innerText = room;
    showUsers(users);
})

// showing msg into the screen
function showMessage(msg){
    const message = document.createElement('div');

    message.classList.add('message');
    message.innerHTML = `<p class="meta">${msg.username} <span> ${msg.time} </span></p>
    <p class="text">${msg.text}</p>`;

    chatMessages.appendChild(message);
}

// displaying the users with username
function showUsers(users){
    usersList.innerHTML = '';
    for(let user of users){
        const li = document.createElement('li');
        li.innerText = user.username;
        usersList.appendChild(li);
    }
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = "../index.html";
    }else{
    }
})