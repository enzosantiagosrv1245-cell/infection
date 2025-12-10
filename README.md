# 🎮 Infestation - Jogo Multiplayer em Tempo Real

Um jogo de estratégia e ação multiplayer estilo **EvoWorld.io** onde humanos lutam para sobreviver contra zumbis.

## 🎯 Características Principais

### 🏆 Sistema de Nível e XP
- **Progressão Exponencial**: Suba de nível conforme ganha XP (gemas)
- **Cores Dinâmicas**: Cada nível tem uma cor única (estilo EvoWorld.io)
- **Bônus por Nível**: Ganhe mais gemas conforme sobe de nível
- **Skins Diferenciadas**: Apareça diferente conforme seu nível

### 💎 Sistema de Gemas e Itens
- Ganhe gemas completando objetivos
- Compre itens na loja (apenas humanos)
- Diferentes raridades de itens
- Sistema de inventário aprimorado

### 🎯 Missões Diárias e Semanais
- **Missões Diárias**: Sobreviva 5min, ganhe 100 gemas, mate zumbis
- **Missões Semanais**: Suba de nível, ganhe 1000 gemas, vença 5 rodadas
- Recompensas em gemas por completar missões
- Reset automático a cada 24h (daily) e 7 dias (weekly)

### 📛 Sistema de Resgate de Códigos
- Resgate códigos para ganhar bônus
- Código Developer: `1204201114` (acesso ao menu dev)
- Suporta múltiplas recompensas por código
- Sistema de limite de usos

### ⚙️ Menu Dev Protegido
- Menu na esquerda com comandos de desenvolvedor
- Acesso restrito apenas para usuários flagados como dev
- Proteção contra exposição via console
- Honeypo para enganar hackers
- Comandos: spawn item, add gems, teleport, listar players, etc

### 🔒 Sistema de Segurança
- **Sanitização Robusta**: Remove caracteres perigosos
- **Validação de Movimentos**: Anti-teleport hack
- **Validação de Velocidade**: Anti-speed hack
- **Rastreamento de Atividade**: Detecção de comportamento suspeito
- **Honeypot**: Fake dados para enganar bots
- **Proteção contra SQL Injection e XSS**

### 🎨 Menu Principal Estilo EvoWorld
- Design moderno com gradientes
- Links para Discord e YouTube
- Modal de login/registro integrado
- Informações do jogo destacadas
- Tema dark com neon verde

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 14+
- npm

### Instalação
```bash
cd /workspaces/infection
npm install
```

### Iniciar Servidor
```bash
node server.js
```

O servidor rodará em `http://localhost:3000`

## 📱 Como Jogar

### Controles
| Tecla | Ação |
|-------|------|
| **WASD** / **Setas** | Mover |
| **Clique Esquerdo** | Atacar/Usar item |
| **B** | Loja (humanos) |
| **E** | Pegar/Largar item |
| **G** | Largar item |
| **Enter** | Chat |
| **X** | Instruções |

### Objetivos
**🧑 Humanos:**
- Sobreviva até o tempo acabar
- Ganhe gemas completando objetivos
- Compre itens para se defender
- Evite infecção pelos zumbis

**🧟 Zumbis:**
- Infecte todos os humanos
- Trabalhe em equipe
- Adapte sua estratégia
- Ganhe gemas infectando humanos

## 📂 Estrutura do Projeto

```
infection/
├── server.js              # Servidor principal (Express + Socket.io)
├── game.js                # Lógica do jogo (cliente)
├── menu.js                # Sistema de menu e login
├── index.html             # Página principal
├── style.css              # Estilos CSS
│
├── levelSystem.js         # Sistema de níveis e XP
├── redeemSystem.js        # Sistema de resgate de códigos
├── missionSystem.js       # Sistema de missões
├── devMenu.js             # Menu de desenvolvedor
├── securitySystem.js      # Sistema de segurança
│
├── users.json             # Dados dos usuários (persistido)
├── messages.json          # Histórico de mensagens
├── links.json             # Links compartilhados
└── Sprites/               # Assets do jogo
    ├── Human.png
    ├── Zombie.png
    ├── ...
```

## 🔐 Códigos de Resgate

### Código Developer
```
1204201114
```
- Desbloqueia o menu de desenvolvedor
- Acesso a comandos administrativos
- Limite: 1 uso por conta

### Outros Códigos
```
WELCOME100  - 100 gemas de boas-vindas
LEVEL10     - 50 gemas ao atingir nível 10
```

## 👨‍💻 Comandos Dev

Após ativar o código dev, você terá acesso a:
- **Spawn Item**: Spawnar items no mapa
- **Add Gems**: Adicionar gemas
- **Teleport**: Teleportar para coordenadas
- **Listar Players**: Ver todos os jogadores
- **Reset Round**: Resetar a rodada
- **God Mode**: Modo invulnerável
- **Ver Estado**: Ver estado completo do jogo
- **Messenger**: Enviar mensagens globais

## 🎨 Sistema de Cores por Nível

| Nível | Cor | Descrição |
|-------|-----|-----------|
| 0-5 | Cinzento | Iniciante |
| 6-10 | Verde Claro | Novato |
| 11-15 | Verde | Experiente |
| 16-20 | Azul Claro | Avançado |
| 21-25 | Azul | Profissional |
| 26-30 | Roxo | Épico |
| 31-40 | Rosa | Lendário |
| 41-50 | Vermelho | Mítico |
| 50+ | Branco Piscante | Imortal |

## 📊 Progressão de Nível

A dificuldade cresce exponencialmente:
- Nível 1: 100 XP
- Nível 5: 841 XP
- Nível 10: 3.162 XP
- Nível 20: 31.623 XP
- Nível 50: ~100M XP

## 🔗 Links

- **Discord**: https://discord.gg/AZzAX2cQR7
- **YouTube**: https://www.youtube.com/@canalmegacode

## 🛡️ Segurança

Este projeto implementa múltiplas camadas de proteção:
- Validação rigorosa de inputs no servidor
- Sanitização de dados do usuário
- Detecção de atividades suspeitas
- Honeypots para enganar hackers
- Proteção contra manipulação de dados
- Rastreamento de tentativas maliciosas

## 📝 Licença

Este projeto é proprietário. Todos os direitos reservados.

## 👤 Autor

Desenvolvido por **Mingau**
- Discord: MegaCode Community
- YouTube: CanalMegaCode

---

**Versão**: 1.0.0  
**Última Atualização**: Dezembro 2024
