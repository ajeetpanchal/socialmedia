//check in one to one chat which user is loogedin once it find then return the name of other user with whome the chat is created

export const getSender = (loggeduser, users) => {
  return users[0]._id === loggeduser._id ? users[1].name : users[0].name;
};
export const getSenderFull = (loggeduser, users) => {
  return users[0]._id === loggeduser._id ? users[1] : users[0];
};
export const isSameSender = (allmessage, m, i, userId) => {
  return (
    i < allmessage.length - 1 &&
    (allmessage[i + 1].sender._id !== m.sender._id ||
      allmessage[i + 1].sender._id === undefined) &&
    allmessage[i].sender._id !== userId
  );
};

export const isLastMessage = (allmessage, i, userId) => {
  return (
    i === allmessage.length - 1 &&
    allmessage[allmessage.length - 1].sender._id !== userId &&
    allmessage[allmessage.length - 1].sender._id
  );
};
// to show the chat of logginuser at the right side and the other chat which is recieved by looginuser at the left
//so we need to check which user is currently loggedin and which is not so this function will do that stuff
export const isSameSenderMargin = (allmessage, m, i, userId) => {
  //it check if it is same sender that is currently loggedin so return 33 as margin value
  if (
    i < allmessage.length - 1 &&
    allmessage[i + 1].sender._id === m.sender._id &&
    allmessage[i].sender._id !== userId
  ) {
    return 33;
  } else if (
    (i < allmessage.length - 1 &&
      allmessage[i + 1].sender._id !== m.sender._id &&
      allmessage[i].sender._id !== userId) ||
    (i === allmessage.length - 1 && allmessage[i].sender._id !== userId)
  ) {
    return 0;
  } else {
    return "auto";
  }
};
//to check previous message is also send by the current user so it function will return true and we add space between two messages
export const isSameUser = (allmessage, m, i) => {
  //it is checking that previous message is also send by the user who is currently sending the message
  return i > 0 && allmessage[i - 1].sender._id === m.sender._id;
};
