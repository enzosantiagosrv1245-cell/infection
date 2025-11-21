
// editor.js - Editor completo de mapa
const EditorSystem = {
    isEditorMode: false,
    selectedObject: null,
    selectedPlayer: null,
    isDraggingSelected: false,
    editorPanel: null,
    
    objectTypes: [
        'small_bed', 'big_bed', 'big_bed2', 'big_table', 'square_table',
        'mini_sofa', 'mini_sofa2', 'sofa', 'car', 'box', 'atm',
        'park_bench', 'pool_table'
    ],
    
    init() {
        this.createEditorButton();
        this.setupEditorEvents();
    },
    
    createEditorButton() {
        const btn = document.createElement('button');
        btn.innerHTML = 'EDITOR';
        btn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            padding: 15px 25px;
            background: #000;
            color: #fff;
            border: 2px solid #fff;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            z-index: 10000;
            transition: all 0.3s;
        `;
        
        btn.addEventListener('click', () => this.toggleEditor());
        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#333';
            btn.style.transform = 'scale(1.05)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = '#000';
            btn.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(btn);
        this.editorButton = btn;
    },
    
    toggleEditor() {
        this.isEditorMode = !this.isEditorMode;
        
        if (this.isEditorMode) {
            this.editorButton.style.background = '#f00';
            this.editorButton.innerHTML = 'SAIR';
            this.createEditorPanel();
            const me = gameState.players[myId];
            if (me) {
                me._editorMode = true;
                me._ghostMode = true;
            }
        } else {
            this.editorButton.style.background = '#000';
            this.editorButton.innerHTML = 'EDITOR';
            this.closeEditorPanel();
            const me = gameState.players[myId];
            if (me) {
                me._editorMode = false;
                me._ghostMode = false;
            }
            this.selectedObject = null;
            this.selectedPlayer = null;
        }
    },
    
    createEditorPanel() {
        const panel = document.createElement('div');
        panel.id = 'editorPanel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
            width: 280px;
            max-height: 80vh;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #fff;
            border-radius: 10px;
            padding: 20px;
            color: #fff;
            z-index: 9999;
            overflow-y: auto;
            font-family: Arial;
        `;
        
        panel.innerHTML = `
            <h3 style="margin: 0 0 15px 0; text-align: center; border-bottom: 2px solid #fff; padding-bottom: 10px;">EDITOR DE MAPA</h3>
            
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 5px 0;">Adicionar Objeto:</h4>
                <select id="objectTypeSelect" style="width: 100%; padding: 8px; background: #222; color: #fff; border: 1px solid #fff; border-radius: 5px; margin-bottom: 10px;">
                    ${this.objectTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                </select>
                <button id="addObjectBtn" style="width: 100%; padding: 10px; background: #0a0; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">ADICIONAR OBJETO</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 5px 0;">Objeto Selecionado:</h4>
                <div id="selectedObjectInfo" style="padding: 10px; background: #222; border-radius: 5px; min-height: 50px;">
                    Nenhum objeto selecionado
                </div>
                <button id="deleteObjectBtn" style="width: 100%; padding: 10px; background: #f00; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin-top: 10px;">DELETAR SELECIONADO</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 5px 0;">Jogador Selecionado:</h4>
                <div id="selectedPlayerInfo" style="padding: 10px; background: #222; border-radius: 5px; min-height: 50px;">
                    Nenhum jogador selecionado
                </div>
                <input type="number" id="gemsInput" placeholder="Quantidade de gemas" style="width: 100%; padding: 8px; background: #222; color: #fff; border: 1px solid #fff; border-radius: 5px; margin-top: 10px;">
                <button id="addGemsBtn" style="width: 100%; padding: 10px; background: #fa0; color: #000; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin-top: 5px;">DAR GEMAS</button>
                <button id="healPlayerBtn" style="width: 100%; padding: 10px; background: #0af; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin-top: 5px;">CURAR JOGADOR</button>
                <button id="killPlayerBtn" style="width: 100%; padding: 10px; background: #f00; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin-top: 5px;">INFECTAR JOGADOR</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 5px 0;">Ações Globais:</h4>
                <button id="clearMapBtn" style="width: 100%; padding: 10px; background: #f90; color: #000; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin-bottom: 5px;">LIMPAR MAPA</button>
                <button id="restartGameBtn" style="width: 100%; padding: 10px; background: #09f; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">REINICIAR PARTIDA</button>
            </div>
            
            <div style="font-size: 12px; opacity: 0.7; margin-top: 15px; border-top: 1px solid #555; padding-top: 10px;">
                <b>Controles:</b><br>
                • Clique: Selecionar<br>
                • Q/E: Rotacionar<br>
                • Clique+Arraste: Mover<br>
                • Delete: Remover
            </div>
        `;
        
        document.body.appendChild(panel);
        this.editorPanel = panel;
        this.setupPanelEvents();
    },
    
    setupPanelEvents() {
        document.getElementById('addObjectBtn').onclick = () => {
            const type = document.getElementById('objectTypeSelect').value;
            const me = gameState.players[myId];
            if (!me) return;
            
            // map default sizes by type (can be extended)
            const sizeMap = {
                small_bed: { w: 138, h: 230 },
                big_bed: { w: 180, h: 260 },
                big_bed2: { w: 200, h: 260 },
                big_table: { w: 380, h: 200 },
                square_table: { w: 170, h: 170 },
                mini_sofa: { w: 120, h: 100 },
                mini_sofa2: { w: 120, h: 100 },
                sofa: { w: 230, h: 100 },
                car: { w: 280, h: 450 },
                box: { w: 192, h: 192 },
                atm: { w: 150, h: 130 },
                park_bench: { w: 100, h: 240 },
                pool_table: { w: 340, h: 210 }
            };

            const s = sizeMap[type] || { w: 80, h: 80 };
            const newObj = {
                id: type,
                x: me.x,
                y: me.y,
                width: s.w,
                height: s.h,
                rotation: 0,
                isStatic: false
            };

            // send to server; server will create the physics body and broadcast the new gameState
            socket.emit('editorAction', { type: 'add', object: newObj });
        };
        
        document.getElementById('deleteObjectBtn').onclick = () => {
            if (this.selectedObject) {
                socket.emit('editorAction', { type: 'delete', objectId: this.selectedObject.uniqueId });
                this.selectedObject = null;
                this.isDraggingSelected = false;
                this.updateSelectedInfo();
            }
        };
        
        document.getElementById('addGemsBtn').onclick = () => {
            if (this.selectedPlayer) {
                const amount = parseInt(document.getElementById('gemsInput').value) || 0;
                socket.emit('editorAction', { type: 'addGems', playerId: this.selectedPlayer.id, amount });
            }
        };
        
        document.getElementById('healPlayerBtn').onclick = () => {
            if (this.selectedPlayer) {
                socket.emit('editorAction', { type: 'heal', playerId: this.selectedPlayer.id });
            }
        };
        
        document.getElementById('killPlayerBtn').onclick = () => {
            if (this.selectedPlayer) {
                socket.emit('editorAction', { type: 'kill', playerId: this.selectedPlayer.id });
            }
        };
        
        document.getElementById('clearMapBtn').onclick = () => {
            if (confirm('Limpar todos os objetos do mapa?')) {
                socket.emit('editorAction', { type: 'clearMap' });
            }
        };
        
        document.getElementById('restartGameBtn').onclick = () => {
            if (confirm('Reiniciar a partida?')) {
                socket.emit('editorAction', { type: 'restart' });
            }
        };
    },
    
    closeEditorPanel() {
        if (this.editorPanel) {
            this.editorPanel.remove();
            this.editorPanel = null;
        }
    },
    
    updateSelectedInfo() {
        if (!this.editorPanel) return;
        
        const objInfo = document.getElementById('selectedObjectInfo');
        const playerInfo = document.getElementById('selectedPlayerInfo');
        
        if (this.selectedObject) {
            objInfo.innerHTML = `
                <b>Tipo:</b> ${this.selectedObject.id}<br>
                <b>X:</b> ${Math.round(this.selectedObject.x)}<br>
                <b>Y:</b> ${Math.round(this.selectedObject.y)}<br>
                <b>Rotação:</b> ${this.selectedObject.rotation.toFixed(2)}
            `;
        } else {
            objInfo.innerHTML = 'Nenhum objeto selecionado';
        }
        
        if (this.selectedPlayer) {
            playerInfo.innerHTML = `
                <b>Nome:</b> ${this.selectedPlayer.name}<br>
                <b>Role:</b> ${this.selectedPlayer.role}<br>
                <b>Gemas:</b> ${this.selectedPlayer.gems}<br>
                <b>Velocidade:</b> ${this.selectedPlayer.speed}
            `;
        } else {
            playerInfo.innerHTML = 'Nenhum jogador selecionado';
        }
    },
    
    setupEditorEvents() {
        document.addEventListener('keydown', (e) => {
            if (!this.isEditorMode) return;
            
            if (this.selectedObject) {
                if (e.key.toLowerCase() === 'q') {
                    this.selectedObject.rotation -= 0.1;
                    socket.emit('editorAction', { type: 'rotate', objectId: this.selectedObject.uniqueId, rotation: this.selectedObject.rotation });
                    this.updateSelectedInfo();
                } else if (e.key.toLowerCase() === 'e') {
                    this.selectedObject.rotation += 0.1;
                    socket.emit('editorAction', { type: 'rotate', objectId: this.selectedObject.uniqueId, rotation: this.selectedObject.rotation });
                    this.updateSelectedInfo();
                } else if (e.key === 'Delete') {
                    gameState.objects = gameState.objects.filter(o => o.uniqueId !== this.selectedObject.uniqueId);
                    socket.emit('editorAction', { type: 'delete', objectId: this.selectedObject.uniqueId });
                    this.selectedObject = null;
                    this.updateSelectedInfo();
                }
            }
        });
        // mouse move: if dragging, update selected object/player position to follow pointer
        document.addEventListener('mousemove', (e) => {
            if (!this.isEditorMode) return;
            if (!this.isDraggingSelected) return;
            const coords = this.getWorldCoordsFromMouse();
            if (this.selectedObject) {
                this.selectedObject.x = coords.x - (this.selectedObject.width || 80) / 2;
                this.selectedObject.y = coords.y - (this.selectedObject.height || 80) / 2;
                this.updateSelectedInfo();
            } else if (this.selectedPlayer) {
                this.selectedPlayer.x = coords.x - (this.selectedPlayer.width || 40) / 2;
                this.selectedPlayer.y = coords.y - (this.selectedPlayer.height || 40) / 2;
                this.updateSelectedInfo();
            }
        });
    },

    // compute world coords from current global mouse and camera
    getWorldCoordsFromMouse() {
        const zoomLevel = 0.67;
        const me = gameState.players[myId];
        if (!me) return { x: 0, y: 0 };
        const cameraX = (me.x + me.width / 2) - (canvas.width / (2 * zoomLevel));
        const cameraY = (me.y + me.height / 2) - (canvas.height / (2 * zoomLevel));
        return { x: mouse.x / zoomLevel + cameraX, y: mouse.y / zoomLevel + cameraY };
    },
    
    handleClick(worldX, worldY) {
        if (!this.isEditorMode) return false;
        // If currently dragging a selected object/player, a click releases it
        if (this.isDraggingSelected) {
            if (this.selectedObject) {
                this.isDraggingSelected = false;
                socket.emit('editorAction', { type: 'move', objectId: this.selectedObject.uniqueId, x: this.selectedObject.x, y: this.selectedObject.y });
                this.updateSelectedInfo();
                return true;
            }
            if (this.selectedPlayer) {
                this.isDraggingSelected = false;
                socket.emit('editorAction', { type: 'movePlayer', playerId: this.selectedPlayer.id, x: this.selectedPlayer.x, y: this.selectedPlayer.y });
                this.updateSelectedInfo();
                return true;
            }
        }

        // Check players first
        for (let playerId in gameState.players) {
            const player = gameState.players[playerId];
            if (worldX >= player.x && worldX <= player.x + player.width &&
                worldY >= player.y && worldY <= player.y + player.height) {
                if (this.selectedPlayer && this.selectedPlayer.id === player.id) {
                    // already selected - start dragging
                    this.isDraggingSelected = true;
                    return true;
                }
                // select immediately (no confirm) and start dragging
                this.selectedPlayer = player;
                this.selectedObject = null;
                this.isDraggingSelected = true;
                this.updateSelectedInfo();
                return true;
            }
        }

        // Then objects
        for (let obj of gameState.objects) {
            if (worldX >= obj.x && worldX <= obj.x + (obj.width || 0) &&
                worldY >= obj.y && worldY <= obj.y + (obj.height || 0)) {
                if (this.selectedObject && this.selectedObject.uniqueId === obj.uniqueId) {
                    this.isDraggingSelected = true;
                    return true;
                }
                // select immediately (no confirm) and start dragging
                this.selectedObject = obj;
                this.selectedPlayer = null;
                this.isDraggingSelected = true;
                this.updateSelectedInfo();
                return true;
            }
        }

        // If clicked empty space and an object is selected, start dragging it immediately
        if (this.selectedObject) {
            this.selectedObject.x = worldX - this.selectedObject.width / 2;
            this.selectedObject.y = worldY - this.selectedObject.height / 2;
            socket.emit('editorAction', { type: 'move', objectId: this.selectedObject.uniqueId, x: this.selectedObject.x, y: this.selectedObject.y });
            this.updateSelectedInfo();
            return true;
        }

        return false;
    },
    
    drawEditorUI(ctx) {
        if (!this.isEditorMode) return;
        
        // Highlight objeto selecionado
        if (this.selectedObject) {
            ctx.save();
            ctx.strokeStyle = '#0f0';
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 5]);
            ctx.strokeRect(this.selectedObject.x, this.selectedObject.y, this.selectedObject.width, this.selectedObject.height);
            ctx.restore();
        }
        
        // Highlight jogador selecionado
        if (this.selectedPlayer) {
            ctx.save();
            ctx.strokeStyle = '#ff0';
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 5]);
            ctx.strokeRect(this.selectedPlayer.x, this.selectedPlayer.y, this.selectedPlayer.width, this.selectedPlayer.height);
            ctx.restore();
        }
    }
};

if (typeof window !== 'undefined') {
    window.EditorSystem = EditorSystem;
    // Só inicia o editor quando o servidor informar que o jogador é dev
    if (typeof socket !== 'undefined') {
        socket.on('devMode', (flag) => {
            if (flag) {
                // Initialize editor UI for devs
                if (!EditorSystem.editorButton) EditorSystem.init();
            } else {
                // Remove editor button se existir
                if (EditorSystem.editorButton) EditorSystem.editorButton.remove();
                EditorSystem.editorButton = null;
            }
        });
    }
}