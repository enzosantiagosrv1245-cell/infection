
const _0x4a7c = {
    _0x1b8d: 'ZW56b3NhbnRpYWdvc3J2MTI0NUBnbWFpbC5jb20=',
    _0x2e9f: 'TWluZ2F1X2RldiMyMDEx',
    _0x3f0a: 'aGVscA==',
    _0x4b1c: 'cGxheWVycw==', 
    _0x5d2e: 'dGltZQ==',
    _0x6f3a: 'dHA=',
    _0x7b4c: 'aGVhbA==',
    _0x8d5e: 'Z2Vtcw==',
    _0x9f6a: 'a2lsbA==',
    _0xa17b: 'c3BlZWQ=',
    _0xb28c: 'Z29k',
    _0xc39d: 'aXRlbXM=',
    _0xd4ae: 'cmVzdGFydA=='
};

const _0x7f2b = (function() {
    const _0xa = Buffer.from(_0x4a7c._0x1b8d, 'base64').toString();
    const _0xb = Buffer.from(_0x4a7c._0x2e9f, 'base64').toString();
    let _0xc = new Set();
    let _0xd = new Map();
    
    return {
        _0xe5f: function(_0x123) { return _0x123 === _0xa; },
        _0xf6g: function(_0x456) { return _0x456 === _0xb; },
        _0xg7h: function(_0x789) { _0xc.add(_0x789); },
        _0xh8i: function(_0xabc) { return _0xc.has(_0xabc); },
        _0xi9j: function(_0xdef, _0x012) { _0xd.set(_0xdef, _0x012); },
        _0xj0k: function(_0x345) { return _0xd.get(_0x345); },
        _0xk1l: function(_0x678) { _0xc.delete(_0x678); _0xd.delete(_0x678); }
    };
})();

const _0xm2n = {
    _0xn3o: function(_0x9ab, _0xcde, _0xfgh, _0xijk) {
        const _0xlmn = Buffer.from(_0x4a7c._0x3f0a, 'base64').toString();
        const _0xopq = Buffer.from(_0x4a7c._0x4b1c, 'base64').toString(); 
        const _0xrst = Buffer.from(_0x4a7c._0x5d2e, 'base64').toString();
        
        const _0xuv = _0xcde.split(' ');
        const _0xwx = _0xuv[0].toLowerCase();
        const _0xyz = _0xuv.slice(1);
        
        const _0x123a = _0xfgh.players[_0x9ab.id];
        if (!_0x123a) return;
        
        switch(_0xwx) {
            case `/${_0xlmn}`:
                _0x9ab.emit('serverMessage', {
                    text: 'Comandos: /help, /players, /time' + 
                          (_0x7f2b._0xh8i(_0x9ab.id) ? ', /tp, /heal, /gems, /kill, /speed, /god, /items, /restart' : ''),
                    color: '#FFD700'
                });
                break;
                
            case `/${_0xopq}`:
                const _0x456b = Object.values(_0xfgh.players)
                    .map(_0x789c => `${_0x789c.name}${_0x789c._0xdev ? ' [DEV]' : ''} (${_0x789c.role})`)
                    .join(', ');
                _0x9ab.emit('serverMessage', {
                    text: `Online: ${_0x456b}`,
                    color: '#87CEEB'
                });
                break;
                
            case `/${_0xrst}`:
                const _0xdef = Math.floor(_0xfgh.timeLeft / 60);
                const _0xghi = _0xfgh.timeLeft % 60;
                _0x9ab.emit('serverMessage', {
                    text: `Tempo: ${_0xdef}:${String(_0xghi).padStart(2, '0')}`,
                    color: '#FFA500'
                });
                break;
                
            default:
                if (!_0x7f2b._0xh8i(_0x9ab.id)) {
                    _0x9ab.emit('serverMessage', {
                        text: 'Sem permissao!',
                        color: '#FF6B6B'
                    });
                    return;
                }
                _0xm2n._0xo4p(_0x9ab, _0xwx, _0xyz, _0xfgh, _0xijk);
        }
    },
    
    _0xo4p: function(_0x9ab, _0xcmd, _0xargs, _0xstate, _0xio) {
        const _0x6tp = Buffer.from(_0x4a7c._0x6f3a, 'base64').toString();
        const _0x7hl = Buffer.from(_0x4a7c._0x7b4c, 'base64').toString();
        const _0x8gm = Buffer.from(_0x4a7c._0x8d5e, 'base64').toString();
        const _0x9kl = Buffer.from(_0x4a7c._0x9f6a, 'base64').toString();
        const _0xa1sp = Buffer.from(_0x4a7c._0xa17b, 'base64').toString();
        const _0xb2gd = Buffer.from(_0x4a7c._0xb28c, 'base64').toString();
        const _0xc3it = Buffer.from(_0x4a7c._0xc39d, 'base64').toString();
        const _0xd4rs = Buffer.from(_0x4a7c._0xd4ae, 'base64').toString();
        
        const _0xplyr = _0xstate.players[_0x9ab.id];
        
        switch(_0xcmd) {
            case `/${_0x6tp}`:
                if (_0xargs.length < 1) {
                    _0x9ab.emit('serverMessage', { text: 'Uso: /tp <nome>', color: '#FF6B6B' });
                    return;
                }
                
                const _0xtgt = Object.values(_0xstate.players)
                    .find(_0xp => _0xp.name.toLowerCase() === _0xargs.join(' ').toLowerCase());
                
                if (!_0xtgt) {
                    _0x9ab.emit('serverMessage', { text: 'Jogador nao encontrado!', color: '#FF6B6B' });
                    return;
                }
                
                _0xplyr.x = _0xtgt.x;
                _0xplyr.y = _0xtgt.y;
                _0x9ab.emit('serverMessage', { text: `Teleportado para ${_0xtgt.name}!`, color: '#90EE90' });
                break;
                
            case `/${_0x7hl}`:
                if (_0xargs.length === 0) {
                    _0xplyr.role = 'human';
                    _0x9ab.emit('serverMessage', { text: 'Voce foi curado!', color: '#90EE90' });
                } else {
                    const _0xhtgt = Object.values(_0xstate.players)
                        .find(_0xp => _0xp.name.toLowerCase() === _0xargs.join(' ').toLowerCase());
                    
                    if (!_0xhtgt) {
                        _0x9ab.emit('serverMessage', { text: 'Jogador nao encontrado!', color: '#FF6B6B' });
                        return;
                    }
                    
                    _0xhtgt.role = 'human';
                    _0xio.emit('serverMessage', { text: `${_0xhtgt.name} foi curado!`, color: '#90EE90' });
                }
                break;
                
            case `/${_0x8gm}`:
                if (_0xargs.length < 2) {
                    _0x9ab.emit('serverMessage', { text: 'Uso: /gems <nome> <quantidade>', color: '#FF6B6B' });
                    return;
                }
                
                const _0xamt = parseInt(_0xargs[_0xargs.length - 1]);
                const _0xgtgt = Object.values(_0xstate.players)
                    .find(_0xp => _0xp.name.toLowerCase() === _0xargs.slice(0, -1).join(' ').toLowerCase());
                
                if (!_0xgtgt || isNaN(_0xamt)) {
                    _0x9ab.emit('serverMessage', { text: 'Erro nos parametros!', color: '#FF6B6B' });
                    return;
                }
                
                _0xgtgt.gems = Math.max(0, _0xgtgt.gems + _0xamt);
                _0x9ab.emit('serverMessage', { text: `${_0xamt > 0 ? '+' : ''}${_0xamt} gemas para ${_0xgtgt.name}!`, color: '#FFD700' });
                break;
                
            case `/${_0x9kl}`:
                if (_0xargs.length < 1) {
                    _0x9ab.emit('serverMessage', { text: 'Uso: /kill <nome>', color: '#FF6B6B' });
                    return;
                }
                
                const _0xktgt = Object.values(_0xstate.players)
                    .find(_0xp => _0xp.name.toLowerCase() === _0xargs.join(' ').toLowerCase());
                
                if (!_0xktgt) {
                    _0x9ab.emit('serverMessage', { text: 'Jogador nao encontrado!', color: '#FF6B6B' });
                    return;
                }
                
                _0xktgt.role = 'zombie';
                _0xio.emit('serverMessage', { text: `${_0xktgt.name} foi infectado!`, color: '#FF6B6B' });
                break;
                
            case `/${_0xa1sp}`:
                if (_0xargs.length < 2) {
                    _0x9ab.emit('serverMessage', { text: 'Uso: /speed <nome> <velocidade>', color: '#FF6B6B' });
                    return;
                }
                
                const _0xspd = parseFloat(_0xargs[_0xargs.length - 1]);
                const _0xstgt = Object.values(_0xstate.players)
                    .find(_0xp => _0xp.name.toLowerCase() === _0xargs.slice(0, -1).join(' ').toLowerCase());
                
                if (!_0xstgt || isNaN(_0xspd) || _0xspd < 0.1 || _0xspd > 50) {
                    _0x9ab.emit('serverMessage', { text: 'Parametros invalidos!', color: '#FF6B6B' });
                    return;
                }
                
                _0xstgt.speed = _0xspd + 2;
                _0x9ab.emit('serverMessage', { text: `Velocidade ${_0xstgt.name}: ${_0xspd}`, color: '#87CEEB' });
                break;
                
            case `/${_0xb2gd}`:
                _0xplyr._0xgodMode = !_0xplyr._0xgodMode;
                _0x9ab.emit('serverMessage', { 
                    text: `God Mode: ${_0xplyr._0xgodMode ? 'ON' : 'OFF'}`, 
                    color: _0xplyr._0xgodMode ? '#90EE90' : '#FF6B6B' 
                });
                break;
                
            case `/${_0xc3it}`:
                _0xplyr.inventory = [
                    { id: 'card' }, { id: 'skateboard' }, { id: 'drone', ammo: 999 },
                    { id: 'invisibilityCloak' }, { id: 'gravityGlove' }, { id: 'portals' },
                    { id: 'cannon' }, { id: 'angelWings' }, { id: 'bow', ammo: 999 }
                ];
                _0xplyr.inventorySlots = 2;
                _0x9ab.emit('serverMessage', { text: 'Todos os itens adicionados!', color: '#90EE90' });
                break;
                
            case `/${_0xd4rs}`:
                _0xio.emit('serverMessage', { text: `Jogo reiniciado por ${_0xplyr.name}!`, color: '#FFA500' });
                _0xstate.timeLeft = 120;
                _0xstate.startTime = 60;
                _0xstate.gamePhase = 'waiting';
                break;
        }
        
        _0xio.emit('gameStateUpdate', _0xstate);
    },
    
    _0xp5q: function(_0xemail) {
        return _0x7f2b._0xe5f(_0xemail);
    },
    
    _0xq6r: function(_0xcode) {
        return _0x7f2b._0xf6g(_0xcode);
    },
    
    _0xr7s: function(_0xsocketId) {
        _0x7f2b._0xg7h(_0xsocketId);
    },
    
    _0xs8t: function(_0xsocketId) {
        return _0x7f2b._0xh8i(_0xsocketId);
    },
    
    _0xt9u: function(_0xsocketId) {
        _0x7f2b._0xk1l(_0xsocketId);
    }
};

module.exports = _0xm2n;