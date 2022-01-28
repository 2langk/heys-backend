const socket = io('http://localhost:4000');

const message = document.getElementById('message');
const messages = document.getElementById('messages');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleSubmitNewMessage = () => {
  socket.emit('message', { data: message.value });
};

socket.on('server-message', ({ data }) => {
  handleNewMessage(data);
});

const handleNewMessage = (message) => {
  messages.appendChild(buildNewMessage(message));
};

const buildNewMessage = (message) => {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(message));
  return li;
};
