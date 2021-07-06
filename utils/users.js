const users = [];

// Joining user to the chat
function userJoins(id,username,room){
    const user = {id,username,room};
    users.push(user);
    return user;
}

// when user leaves the chat
function userLeaves(id){
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        const user = users.splice(index,1);
        return user[0];
    }
}

// find the current user
function getCurrentUser(id){
   return users.find(user => user.id === id);
}

// Get the users in the room
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoins,
    userLeaves,
    getCurrentUser,
    getRoomUsers
}