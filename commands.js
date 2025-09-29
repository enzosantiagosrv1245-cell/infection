
// commands.js - Sistema de comandos de moderação
const bannedPlayers = new Set();
const mutedPlayers = new Set();

module.exports = {
    executeCommand: function(socket, messageText, gameState, io) {
        const parts = messageText.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        const player = gameState.players[socket.id];
        if (!player) return;
        
        switch(command) {
            case '/mute':
                if (args.length < 1) {
                    socket.emit('serverMessage', { text: 'Uso: /mute <nome>', color: '#FF6B6B' });
                    return;
                }
                
                const muteTarget = Object.values(gameState.players)
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
                
                const unmuteTarget = Object.values(gameState.players)
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
                
                const banTarget = Object.values(gameState.players)
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
                
                const kickTarget = Object.values(gameState.players)
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
                    text: 'Comandos: /mute, /unmute, /ban, /kick, /help',
                    color: '#FFD700'
                });
                break;
                
            default:
                socket.emit('serverMessage', {
                    text: 'Comando não reconhecido. Use /help',
                    color: '#FF6B6B'
                });
        }
    },
    
    isMuted: function(playerId) {
        return mutedPlayers.has(playerId);
    },
    
    isBanned: function(playerId) {
        return bannedPlayers.has(playerId);
    }
};