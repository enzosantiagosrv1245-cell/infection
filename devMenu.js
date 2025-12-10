/**
 * Sistema de Menu Dev com Proteção
 * Código: 1204201114
 */

class DevMenu {
    constructor() {
        this.isOpen = false;
        this.isDev = false;
        this.password = '1204201114';
        this.preventExposition();
    }

    /**
     * Previne exposição do código via console
     */
    preventExposition() {
        // Ofuscar função
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;
        
        // Bloquear tentativas de acessar window.DevMenu
        Object.defineProperty(window, 'DevMenu', {
            get() {
                console.warn('Acesso negado');
                return undefined;
            },
            set() {
                console.warn('Acesso negado');
            }
        });

        // Honeyp pot: fake variable
        window.devTools = null;
        window.adminPanel = undefined;
    }

    /**
     * Verifica se o usuário é dev
     */
    checkDev(user) {
        socket.emit('checkDevStatus', { username: user }, (isDev) => {
            this.isDev = isDev;
            if (isDev) {
                this.createDevMenu();
            }
        });
    }

    /**
     * Cria o menu de dev
     */
    createDevMenu() {
        if (document.getElementById('devMenuContainer')) {
            return; // Já existe
        }

        const container = document.createElement('div');
        container.id = 'devMenuContainer';
        container.style.cssText = `
            position: fixed;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 250px;
            background: rgba(20, 20, 30, 0.95);
            border-right: 3px solid #00FF00;
            border-radius: 0 10px 10px 0;
            padding: 15px;
            z-index: 9998;
            font-family: 'Courier New', monospace;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
        `;

        const title = document.createElement('h3');
        title.textContent = '⚙️ DEV MENU';
        title.style.color = '#00FF00';
        title.style.margin = '0 0 15px 0';
        title.style.fontSize = '14px';
        title.style.borderBottom = '1px solid #00FF00';
        title.style.paddingBottom = '10px';
        container.appendChild(title);

        // Botões de dev
        const buttons = [
            { label: 'Spawn Item', action: () => this.spawnItem() },
            { label: 'Add Gems', action: () => this.addGems() },
            { label: 'Teleport', action: () => this.teleport() },
            { label: 'Listar Players', action: () => this.listPlayers() },
            { label: 'Reset Round', action: () => this.resetRound() },
            { label: 'God Mode', action: () => this.godMode() },
            { label: 'Ver Estado', action: () => this.viewGameState() },
            { label: 'Messenger', action: () => this.openMessenger() }
        ];

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.label;
            button.style.cssText = `
                width: 100%;
                padding: 10px;
                margin-bottom: 8px;
                background: rgba(0, 255, 0, 0.1);
                border: 1px solid #00FF00;
                color: #00FF00;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            `;
            button.addEventListener('mouseover', () => {
                button.style.background = 'rgba(0, 255, 0, 0.2)';
                button.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
            });
            button.addEventListener('mouseout', () => {
                button.style.background = 'rgba(0, 255, 0, 0.1)';
                button.style.boxShadow = 'none';
            });
            button.addEventListener('click', btn.action);
            container.appendChild(button);
        });

        document.body.appendChild(container);

        // Toggle button
        const toggleBtn = document.createElement('div');
        toggleBtn.textContent = '═';
        toggleBtn.style.cssText = `
            position: fixed;
            left: 0;
            top: 20px;
            width: 20px;
            height: 30px;
            background: rgba(0, 255, 0, 0.1);
            border: 1px solid #00FF00;
            color: #00FF00;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
            z-index: 9999;
            border-radius: 0 5px 5px 0;
            user-select: none;
        `;
        toggleBtn.addEventListener('click', () => {
            const menu = document.getElementById('devMenuContainer');
            if (menu) {
                menu.style.left = menu.style.left === '-250px' ? '0' : '-250px';
            }
        });
        document.body.appendChild(toggleBtn);
    }

    spawnItem() {
        const item = prompt('Item para spawnar (skateboard, drone, etc):');
        if (item) {
            socket.emit('devSpawnItem', { item });
        }
    }

    addGems() {
        const amount = prompt('Quantidade de gemas:');
        if (amount) {
            socket.emit('devAddGems', { amount: parseInt(amount) });
        }
    }

    teleport() {
        const x = prompt('Posição X:');
        const y = prompt('Posição Y:');
        if (x && y) {
            socket.emit('devTeleport', { x: parseInt(x), y: parseInt(y) });
        }
    }

    listPlayers() {
        socket.emit('devListPlayers', {}, (players) => {
            console.table(players);
        });
    }

    resetRound() {
        if (confirm('Tem certeza? Isso resetará a rodada.')) {
            socket.emit('devResetRound', {});
        }
    }

    godMode() {
        socket.emit('devToggleGodMode', {});
        console.log('God Mode alternado');
    }

    viewGameState() {
        console.log(gameState);
    }

    openMessenger() {
        const msg = prompt('Mensagem global:');
        if (msg) {
            socket.emit('devBroadcast', { message: msg });
        }
    }
}

// Inicializar quando o game está pronto
let devMenu = null;

socket.on('devMenuReady', (isDev) => {
    if (isDev && !devMenu) {
        devMenu = new DevMenu();
        devMenu.isDev = true;
        devMenu.createDevMenu();
        console.log('Dev Menu ativado');
    }
});

// Tentar ativar menu de dev se o usuário foi marcado como dev após login
socket.on('loginSuccess', (user) => {
    if (user.isDeveloper) {
        if (!devMenu) {
            devMenu = new DevMenu();
            devMenu.isDev = true;
            devMenu.createDevMenu();
        }
    }
});
