// Elementos de Login
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");
const loginImageInput = document.querySelector(".login__image-input");

// Elementos do Chat
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = document.querySelector(".chat__messages");
const chatImageInput = document.querySelector(".chat__image-input");

const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33FF", "#57FF33", "#FF3357"];

const user = { id: "", name: "", color: "", profileImage: "" };

let websocket;

// Função para criar mensagens do próprio usuário
const createMessageSelfElement = (content, image, profileImage) => {
  const div = document.createElement("div");
  div.classList.add("message--self");

  const imgProfile = document.createElement("img");
  imgProfile.src = profileImage;
  imgProfile.classList.add("profile-image");

  div.appendChild(imgProfile);
  div.innerHTML += content ? content : "";

  if (image) {
    const imgElement = document.createElement("img");
    imgElement.src = image;
    imgElement.style.maxWidth = "200px";
    imgElement.style.borderRadius = "5px";
    div.appendChild(imgElement);
  }

  return div;
};

// Função para criar mensagens de outros usuários
const createMessageOtherElement = (content, sender, senderColor, image, profileImage) => {
  const div = document.createElement("div");
  const span = document.createElement("span");

  div.classList.add("message--other");
  span.classList.add("message--sender");
  span.style.color = senderColor;
  span.innerHTML = sender;

  const imgProfile = document.createElement("img");
  imgProfile.src = profileImage;
  imgProfile.classList.add("profile-image");

  div.appendChild(imgProfile);
  div.appendChild(span);
  div.innerHTML += content ? content : "";

  if (image) {
    const imgElement = document.createElement("img");
    imgElement.src = image;
    imgElement.style.maxWidth = "200px";
    imgElement.style.borderRadius = "5px";
    div.appendChild(imgElement);
  }

  return div;
};

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const scrollScreen = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
};

// Função para enviar mensagens automáticas no início do chat
const sendAutoMessages = () => {
  const introMessages = [
    { content: "Olá! Seja bem-vindo ao nosso chat.", delay: 1000 },
    { content: "Antes de começarmos, pode me dizer seu nome?", delay: 3000 },
    { content: "E sua data de nascimento?", delay: 5000 }
  ];

  introMessages.forEach(({ content, delay }) => {
    setTimeout(() => {
      const botMessage = createMessageOtherElement(content, "Assistente", "#000000", null, "https://via.placeholder.com/40");
      chatMessages.appendChild(botMessage);
      scrollScreen();
    }, delay);
  });
};

// Processamento das mensagens recebidas via WebSocket
const processMessage = ({ data }) => {
  const { userId, userName, userColor, content, image, profileImage } = JSON.parse(data);

  let messageElement = userId === user.id
    ? createMessageSelfElement(content, image, profileImage)
    : createMessageOtherElement(content, userName, userColor, image, profileImage);

  chatMessages.appendChild(messageElement);
  scrollScreen();
};

// Função de login do usuário
const handleLogin = (event) => {
  event.preventDefault();
  user.id = crypto.randomUUID();
  user.name = loginInput.value;
  user.color = getRandomColor();

  const inputProfileImage = loginImageInput.files[0];
  user.profileImage = inputProfileImage ? URL.createObjectURL(inputProfileImage) : "https://via.placeholder.com/40";

  login.style.display = "none";
  chat.style.display = "flex";

  websocket = new WebSocket("ws://localhost:8080");
  websocket.onmessage = processMessage;

  // Enviar mensagens automáticas após login
  sendAutoMessages();
};

// Função para enviar mensagens
const sendMessage = (event) => {
  event.preventDefault();
  const inputImage = chatImageInput.files[0];

  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    profileImage: user.profileImage,
    content: chatInput.value,
    image: inputImage ? URL.createObjectURL(inputImage) : null,
  };

  websocket.send(JSON.stringify(message));

  chatInput.value = "";
  chatImageInput.value = ""; // Limpa a seleção de imagem
};

// Adicionar eventos aos formulários
loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);