# 📖 Guia de Desenvolvimento

## Estrutura de Arquivos

### Core
- **server.js** - Servidor Express + Socket.io principal
- **game.js** - Lógica de jogo (cliente), física com Matter.js
- **index.html** - Página principal com menu
- **style.css** - Estilos do jogo

### Sistemas
- **levelSystem.js** - Progressão de níveis e XP
- **redeemSystem.js** - Códigos de resgate
- **missionSystem.js** - Missões diárias/semanais
- **devMenu.js** - Menu de desenvolvedor
- **securitySystem.js** - Proteção contra hacks
- **menu.js** - Lógica de login/registro

### Dados
- **users.json** - Dados persistidos de jogadores
- **messages.json** - Histórico do chat
- **links.json** - Links compartilhados
- **Sprites/** - Assets do jogo

## 🔌 Sistema de Socket.io

### Events Emitidos pelo Cliente → Servidor

#### Autenticação
```javascript
socket.emit('register', { username, password });
socket.emit('login', { username, password });
```

#### Gameplay
```javascript
socket.emit('playerInput', { x, y, action });
socket.emit('chatMessage', message);
```

#### Missões
```javascript
socket.emit('getMissions');
socket.emit('completeMission', missionId);
```

#### Código de Resgate
```javascript
socket.emit('redeemCode', code);
```

#### Dev (requer isDeveloper)
```javascript
socket.emit('devSpawnItem', { x, y, itemType });
socket.emit('devAddGems', { username, amount });
socket.emit('devTeleport', { username, x, y });
socket.emit('devListPlayers');
socket.emit('devResetRound');
socket.emit('devToggleGodMode', username);
socket.emit('devGetState');
socket.emit('devBroadcast', message);
```

### Events Recebidos pelo Cliente ← Servidor

```javascript
socket.on('loginResult', { success, message, userData });
socket.on('gameState', gameState);
socket.on('playerUpdate', playerData);
socket.on('chatMessage', { username, message });
socket.on('redeemCodeResult', { success, message, reward });
socket.on('missionUpdate', missionsData);
socket.on('playerInfected', { username, infector });
```

## 🏗️ Estrutura de Dados do Jogador

```javascript
{
  username: "player123",
  role: "human" || "zombie",
  x: 100,
  y: 200,
  vx: 0,
  vy: 0,
  radius: 15,
  speed: 0,
  alive: true,
  gems: 5000,
  level: 25,
  totalXP: 50000,
  levelColor: "#FF69B4",
  skinColor: "#FF1493",
  isDeveloper: false,
  redeemedCodes: ["1204201114"],
  godMode: false,
  inventory: [
    { id: "item123", type: "gun", rarity: "rare" }
  ],
  missionsDaily: {
    survive5min: { progress: 300, target: 300, completed: true },
    earn100gems: { progress: 100, target: 100, completed: true },
    killZombies: { progress: 5, target: 5, completed: true },
    infectHumans: { progress: 3, target: 5, completed: false }
  },
  missionsWeekly: {
    levelUp5: { progress: 3, target: 5, completed: false },
    earn1000gems: { progress: 800, target: 1000, completed: false },
    win5Rounds: { progress: 2, target: 5, completed: false },
    collaborate10: { progress: 7, target: 10, completed: false }
  }
}
```

## 🎯 Como Adicionar uma Nova Missão

1. Edite `missionSystem.js`:

```javascript
// Em DAILY_MISSIONS ou WEEKLY_MISSIONS
{
  id: 'novaMe
ssão',
  title: 'Nome da Missão',
  description: 'Descrição...',
  target: 100,
  reward: 50,
  category: 'combat' // ou 'survival', 'economy', 'progression'
}
```

2. Em `updateMissionProgress()`, adicione o rastreamento:

```javascript
case 'novaMissao':
  if (event.type === 'algumEvento') {
    progress.novaMissao.progress++;
  }
  break;
```

3. Emita o evento no `game.js`:

```javascript
socket.emit('missionProgress', {
  missionId: 'novaMissao',
  progress: 1
});
```

## 🛡️ Como Adicionar um Novo Código de Resgate

1. Edite `redeemSystem.js`:

```javascript
const REDEMPTION_CODES = {
  'NOVO_CODIGO': {
    reward: 'gems',
    amount: 500,
    maxUses: 10,
    expiresAt: new Date('2025-12-31').getTime()
  }
};
```

2. Socket handler em `server.js` já está pronto para processar

## ⚙️ Como Adicionar um Comando Dev

1. Edite `devMenu.js` para adicionar botão:

```javascript
const devButton = document.createElement('button');
devButton.textContent = 'Novo Comando';
devButton.onclick = () => {
  socket.emit('devNovoComando', { param1, param2 });
};
devMenuPanel.appendChild(devButton);
```

2. Edite `server.js` para adicionar handler:

```javascript
socket.on('devNovoComando', (data) => {
  if (!user.isDeveloper) return;
  // Lógica aqui
  socket.emit('devNovoComandoResult', { success: true });
});
```

## 🔐 Segurança - Boas Práticas

### ✅ DO's
- Sempre sanitizar inputs no servidor
- Validar limites de movimento/velocidade
- Fazer checks isDeveloper no servidor
- Logar atividades suspeitas
- Usar Socket.io rooms para segregar dados

### ❌ DON'Ts
- Nunca confiar em dados do cliente
- Não expor lógica sensível no game.js
- Não permitir XP/gems sem validação
- Não deletar honeypots (enganam hackers)

### Validações Implementadas

```javascript
// Input sanitization
const sanitized = security.sanitize(userInput);

// Movement validation (anti-teleport)
if (Math.hypot(newX - oldX, newY - oldY) > 500) {
  security.logSuspicious(userId, 'Possible teleport hack');
  return;
}

// Speed validation (anti-speed hack)
if (speed > 10) {
  security.logSuspicious(userId, 'Speed hack detected');
  return;
}
```

## 🧪 Testes

### Sintaxe
```bash
npm run check
```

### Servidor
```bash
npm start
# Deve mostrar: 🚀 Game server running at http://localhost:3000
```

### Dev Menu Access
1. Register/Login
2. Play game
3. Console: `socket.emit('redeemCode', '1204201114')`
4. Dev menu deve aparecer na esquerda

### Hackear Tentativas (para testar segurança)

```javascript
// Teste XSS
socket.emit('login', { username: '<script>alert(1)</script>', password: '123' });

// Teste SQL Injection
socket.emit('login', { username: "admin'; --", password: '123' });

// Teste Teleport
// Mover 1000px em um movimento (será rejeitado)

// Teste Speed
// Tentar andar muito rápido (será detectado)
```

## 📊 Monitoragem

### Ver logs de segurança
Todos os eventos suspeitos estão em `security.suspiciousActivity`

```javascript
console.log(security.suspiciousActivity);
// {
//   "playerId": [
//     { reason: "XSS injection attempt", timestamp: 1234567890 },
//     { reason: "Possible teleport hack", timestamp: 1234567891 }
//   ]
// }
```

## 🚀 Deploy

### Produção
1. Instalar dependências: `npm install`
2. Setar NODE_ENV: `export NODE_ENV=production`
3. Rodar: `npm start`
4. Usar PM2 para keep-alive:
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 save
   ```

### Variáveis de Ambiente (futuro)
Crie `.env`:
```
NODE_ENV=production
PORT=3000
DB_PATH=./users.json
SECRET_KEY=sua_chave_secreta
```

## 🐛 Troubleshooting

### Game não inicia
- Verifique se socket.io está conectando: Ver console do navegador (F12)
- Verifique servidor: `npm start` deve mostrar porta 3000

### Menu dev não aparece
- Resgate o código: `1204201114`
- Verifique isDeveloper no userData
- Limpe cache: Ctrl+Shift+Del

### Gemas não aumentam
- Verifique se levelSystem.js está importado em server.js
- Verifique se addXPToUser() está sendo chamado
- Veja logs do servidor

### Missões não progridem
- Verifique se missionSystem está importado
- Verifique se eventos são emitidos corretamente
- Limpe users.json se houver corrupção

## 📝 Logs Úteis

### Terminal Servidor
```bash
# Inicia servidor e mostra logs
npm start

# Com nodemon (auto-restart)
npm run dev
```

### Console do Navegador (F12)
```javascript
// Ver estado do player
console.log(gameState.players.find(p => p.username === 'seu_nome'));

// Ver socket conectado
console.log(socket);

// Testar resgate
socket.emit('redeemCode', '1204201114');
```

## 📚 Referências

- [Socket.io Docs](https://socket.io/docs/)
- [Matter.js Docs](https://brm.io/matter-js/docs/)
- [Express.js Docs](https://expressjs.com/)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

**Última atualização**: Dezembro 2024  
**Versão**: 1.0.0
