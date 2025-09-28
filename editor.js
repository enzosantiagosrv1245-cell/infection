
const EditorSystem = {
    isEditorMode: false,
    selectedObject: null,
    draggedObject: null,
    editorButton: null,
    
    // Objetos organizados para spawnar na casa
    houseObjects: [
        { id: 'small_bed', x: 250, y: 250, width: 80, height: 160, rotation: 0 },
        { id: 'big_table', x: 400, y: 300, width: 120, height: 80, rotation: 0 },
        { id: 'mini_sofa', x: 600, y: 250, width: 100, height: 60, rotation: 0 },
        { id: 'mini_sofa2', x: 700, y: 250, width: 100, height: 60, rotation: Math.PI },
        { id: 'square_table', x: 500, y: 400, width: 80, height: 80, rotation: 0 },
        { id: 'big_bed', x: 750, y: 300, width: 120, height: 180, rotation: 0 },
        { id: 'big_bed2', x: 300, y: 500, width: 120, height: 180, rotation: Math.PI/2 },
        { id: 'sofa', x: 650, y: 500, width: 140, height: 80, rotation: 0 }
    ],
    
    init() {
        this.createEditorButton();
        this.setupEditorEvents();
    },
    
    createEditorButton() {
        this.editorButton = document.createElement('button');
        this.editorButton.innerHTML = '🔧';
        this.editorButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(45deg, #ff6b35, #f7931e);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(255,107,53,0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        this.editorButton.addEventListener('click', () => {
            this.toggleEditor();
        });
        
        document.body.appendChild(this.editorButton);
    },
    
    toggleEditor() {
        this.isEditorMode = !this.isEditorMode;
        const me = gameState.players[myId];
        
        if (this.isEditorMode) {
            this.editorButton.innerHTML = '❌';
            this.editorButton.style.background = 'linear-gradient(45deg, #ff4757, #ff3838)';
            
            if (me) {
                me._editorMode = true;
                me._ghostMode = true;
                this.spawnHouseObjects();
                socket.emit('toggleEditorMode', { enabled: true });
            }
            
            this.showEditorInstructions();
            
        } else {
            this.editorButton.innerHTML = '🔧';
            this.editorButton.style.background = 'linear-gradient(45deg, #ff6b35, #f7931e)';
            
            if (me) {
                me._editorMode = false;
                me._ghostMode = false;
                socket.emit('toggleEditorMode', { enabled: false });
            }
            
            this.selectedObject = null;
            this.draggedObject = null;
            this.hideEditorInstructions();
        }
    },
    
    spawnHouseObjects() {
        this.houseObjects.forEach(objData => {
            const exists = gameState.objects.find(obj => 
                obj.id === objData.id && 
                Math.abs(obj.x - objData.x) < 50 && 
                Math.abs(obj.y - objData.y) < 50
            );
            
            if (!exists) {
                const newObj = {
                    ...objData,
                    uniqueId: 'house_' + objData.id + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
                };
                gameState.objects.push(newObj);
            }
        });
    },
    
    showEditorInstructions() {
        const instructions = document.createElement('div');
        instructions.id = 'editorInstructions';
        instructions.innerHTML = `
            <div style="background: rgba(0,0,0,0.9); color: white; padding: 15px; border-radius: 8px; position: fixed; top: 20px; right: 20px; z-index: 10001; max-width: 300px; font-size: 14px;">
                <h4 style="color: #ff6b35; margin: 0 0 10px 0;">🔧 EDITOR ATIVO</h4>
                <div style="text-align: left; line-height: 1.3;">
                    • Modo fantasma ativado<br>
                    • Clique para selecionar<br>
                    • Clique novamente para mover<br>
                    • Q/E para rotacionar<br>
                    • DEL para deletar
                </div>
                <button onclick="document.getElementById('editorInstructions').remove()" style="background: #ff6b35; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 8px; font-size: 12px;">OK</button>
            </div>
        `;
        document.body.appendChild(instructions);
        
        setTimeout(() => {
            const elem = document.getElementById('editorInstructions');
            if (elem) elem.remove();
        }, 5000);
    },
    
    hideEditorInstructions() {
        const elem = document.getElementById('editorInstructions');
        if (elem) elem.remove();
    },
    
    setupEditorEvents() {
        document.addEventListener('keydown', (e) => {
            if (!this.isEditorMode || !this.selectedObject) return;
            
            switch(e.key.toLowerCase()) {
                case 'q':
                    this.selectedObject.rotation -= 0.1;
                    socket.emit('editorAction', { 
                        type: 'rotate', 
                        objectId: this.selectedObject.uniqueId, 
                        rotation: this.selectedObject.rotation 
                    });
                    break;
                case 'e':
                    this.selectedObject.rotation += 0.1;
                    socket.emit('editorAction', { 
                        type: 'rotate', 
                        objectId: this.selectedObject.uniqueId, 
                        rotation: this.selectedObject.rotation 
                    });
                    break;
                case 'delete':
                    socket.emit('editorAction', { 
                        type: 'delete', 
                        objectId: this.selectedObject.uniqueId 
                    });
                    this.selectedObject = null;
                    break;
            }
        });
    },
    
    handleClick(worldX, worldY) {
        if (!this.isEditorMode) return false;
        
        if (this.selectedObject && this.draggedObject) {
            // Soltar objeto
            this.selectedObject.x = worldX - this.selectedObject.width / 2;
            this.selectedObject.y = worldY - this.selectedObject.height / 2;
            
            socket.emit('editorAction', {
                type: 'move',
                objectId: this.selectedObject.uniqueId,
                x: this.selectedObject.x,
                y: this.selectedObject.y
            });
            
            this.draggedObject = null;
            return true;
        }
        
        //selecionar objeto
        const clickedObject = this.findObjectAt(worldX, worldY);
        if (clickedObject) {
            this.selectedObject = clickedObject;
            this.draggedObject = clickedObject;
            return true;
        }
        
        return false;
    },
    
    findObjectAt(x, y) {
        
        for (let obj of gameState.objects) {
            if (x >= obj.x && x <= obj.x + obj.width &&
                y >= obj.y && y <= obj.y + obj.height) {
                return obj;
            }
        }

        for (let playerId in gameState.players) {
            const player = gameState.players[playerId];
            if (x >= player.x && x <= player.x + player.width &&
                y >= player.y && y <= player.y + player.height) {
                return player;
            }
        }
        
        return null;
    },
    
    drawEditorUI(ctx) {
        if (!this.isEditorMode) return;
        
        if (this.selectedObject) {
            ctx.save();
            ctx.strokeStyle = '#ff6b35';
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 5]);
            ctx.strokeRect(
                this.selectedObject.x, 
                this.selectedObject.y, 
                this.selectedObject.width, 
                this.selectedObject.height
            );
            ctx.restore();
        }
    }
};

if (typeof window !== 'undefined') {
    window.EditorSystem = EditorSystem;
}