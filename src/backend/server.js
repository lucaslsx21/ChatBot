// Importa a classe WebSocketServer do pacote 'ws' para criar o servidor WebSocket
const { WebSocketServer } = require('ws');

// Importa o pacote dotenv para usar variáveis de ambiente do arquivo .env
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do arquivo .env para process.env
dotenv.config();

// Cria uma instância do WebSocketServer escutando na porta definida em .env ou, por padrão, na porta 8080
const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

// Escuta o evento de nova conexão de cliente WebSocket
wss.on('connection', (ws) => {
  
  // Escuta e exibe erros que ocorrem na conexão do cliente
  ws.on('error', console.error);

  // Escuta mensagens recebidas de um cliente
  ws.on('message', (data) => {
    
    // Envia a mensagem recebida para todos os clientes conectados
    wss.clients.forEach((client) => client.send(data.toString()));
  });

  // Exibe no console que um cliente se conectou ao servidor
  console.log('Client connected');
});
