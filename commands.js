
// commands.js - Sistema de comandos de moderação (CommonJS)
const bannedPlayers = new Set();
const mutedPlayers = new Set();

function hasAdminPermission(socket, player) {
    // Permite se socket.isDev for true ou nome do jogador for MINGAU (case-insensitive)
    if (socket && socket.isDev) return true;
    if (player && typeof player.name === 'string' && player.name.toUpperCase() === 'MINGAU') return true;
    return false;
}

function executeCommand(socket, messageText, gameState, io) {
    const parts = messageText.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const player = gameState.players[socket.id];
    if (!player) return;

    // Comandos que requerem permissão admin
    const adminCommands = new Set(['/mute','/unmute','/ban','/kick','/godmode','/addobject','/removeobject']);

    if (adminCommands.has(command) && !hasAdminPermission(socket, player)) {
        socket.emit('serverMessage', { text: 'Sem permissão para usar esse comando.', color: '#FF6B6B' });
        return;
    }

    switch (command) {
        case '/mute':
            if (args.length < 1) {
                socket.emit('serverMessage', { text: 'Uso: /mute <nome>', color: '#FF6B6B' });
                return;
            }

            var muteTarget = Object.values(gameState.players)
                .find(p => p.name.toLowerCase() === args.join(' ').toLowerCase());

            if (!muteTarget) {
                socket.emit('serverMessage', { text: 'Jogador não encontrado!', color: '#FF6B6B' });
                return;
            }

            mutedPlayers.add(muteTarget.id);
            io.emit('serverMessage', { text: `${muteTarget.name} foi silenciado por ${player.name}!`, color: '#FFA500' });
            break;

        case '/unmute':
            if (args.length < 1) {
                socket.emit('serverMessage', { text: 'Uso: /unmute <nome>', color: '#FF6B6B' });
                return;
            }

            var unmuteTarget = Object.values(gameState.players)
                .find(p => p.name.toLowerCase() === args.join(' ').toLowerCase());

            if (!unmuteTarget) {
                socket.emit('serverMessage', { text: 'Jogador não encontrado!', color: '#FF6B6B' });
                return;
            }

            mutedPlayers.delete(unmuteTarget.id);
            io.emit('serverMessage', { text: `${unmuteTarget.name} pode falar novamente!`, color: '#90EE90' });
            break;

        case '/ban':
            if (args.length < 1) {
                socket.emit('serverMessage', { text: 'Uso: /ban <nome>', color: '#FF6B6B' });
                return;
            }

            var banTarget = Object.values(gameState.players)
                .find(p => p.name.toLowerCase() === args.join(' ').toLowerCase());

            if (!banTarget) {
                socket.emit('serverMessage', { text: 'Jogador não encontrado!', color: '#FF6B6B' });
                return;
            }

            bannedPlayers.add(banTarget.id);
            io.to(banTarget.id).emit('banned');
            io.emit('serverMessage', { text: `${banTarget.name} foi banido por ${player.name}!`, color: '#FF0000' });
            break;

        case '/kick':
            if (args.length < 1) {
                socket.emit('serverMessage', { text: 'Uso: /kick <nome>', color: '#FF6B6B' });
                return;
            }

            var kickTarget = Object.values(gameState.players)
                .find(p => p.name.toLowerCase() === args.join(' ').toLowerCase());

            if (!kickTarget) {
                socket.emit('serverMessage', { text: 'Jogador não encontrado!', color: '#FF6B6B' });
                return;
            }

            io.to(kickTarget.id).emit('kicked');
            io.emit('serverMessage', { text: `${kickTarget.name} foi expulso por ${player.name}!`, color: '#FFA500' });
            break;

        case '/help':
            socket.emit('serverMessage', {
                text: 'Comandos: /help, /godmode on|off, /rename [oldName] <newName>, /mute, /unmute, /ban, /kick',
                color: '#FFD700'
            });
            break;

        case '/godmode': {
            // /godmode on|off
            if (args.length < 1) {
                socket.emit('serverMessage', { text: 'Uso: /godmode on|off', color: '#FF6B6B' });
                return;
            }
            const val = args[0].toLowerCase();
            const me = gameState.players[socket.id];
            if (!me) return;
            if (val === 'on') {
                me.isGod = true;
                socket.emit('serverMessage', { text: 'Godmode ativado.', color: '#90EE90' });
            } else if (val === 'off') {
                me.isGod = false;
                socket.emit('serverMessage', { text: 'Godmode desativado.', color: '#FFA500' });
            } else {
                socket.emit('serverMessage', { text: 'Uso: /godmode on|off', color: '#FF6B6B' });
            }
            break;
        }

        case '/rename': {
            // /rename <newName>  (rename self)
            // /rename <oldName> <newName> (admins can rename others)
            if (args.length === 1) {
                const newName = args[0];
                const me = gameState.players[socket.id];
                if (!me) return;
                me.name = newName;
                io.emit('serverMessage', { text: `${socket.username || me.id} mudou o nome para ${newName}`, color: '#90EE90' });
                return;
            } else if (args.length >= 2) {
                const oldName = args[0];
                const newName = args.slice(1).join(' ');
                const target = Object.values(gameState.players).find(p => p.name.toLowerCase() === oldName.toLowerCase());
                if (!target) {
                    socket.emit('serverMessage', { text: 'Jogador não encontrado!', color: '#FF6B6B' });
                    return;
                }
                target.name = newName;
                io.emit('serverMessage', { text: `${oldName} agora é ${newName}`, color: '#90EE90' });
                return;
            } else {
                socket.emit('serverMessage', { text: 'Uso: /rename <newName> ou /rename <oldName> <newName>', color: '#FF6B6B' });
            }
            break;
        }

        default:
            socket.emit('serverMessage', {
                text: 'Comando não reconhecido. Use /help',
                color: '#FF6B6B'
            });
    }
}

function isMuted(playerId) {
    return mutedPlayers.has(playerId);
}

function isBanned(playerId) {
    return bannedPlayers.has(playerId);
}

module.exports = { executeCommand, isMuted, isBanned };