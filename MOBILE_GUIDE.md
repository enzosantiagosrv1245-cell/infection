# 📱 Infestation - Versão Mobile

## Detecção Automática de Dispositivo

A aplicação **detecta automaticamente** se é mobile ou desktop e carrega a interface apropriada.

### Como Funciona:

1. **Detecção no HEAD** (`index.html`):
   ```javascript
   const isMobileDevice = () => {
     return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            (window.innerWidth < 768 && window.matchMedia('(hover: none) and (pointer: coarse)').matches);
   };
   ```

2. **Carregamento de CSS Condicional**:
   - **Desktop**: `style.css` (layout multi-painéis, mouse)
   - **Mobile**: `style-mobile.css` (interface vertical, botões grandes, touch)

3. **Flag Global**: `window.IS_MOBILE` disponível em todos os scripts

---

## 🎮 Controles Mobile

### Interface de Jogo (Mobile)

Quando você entra em jogo no mobile, aparecem automaticamente:

#### **1. Joystick Virtual**
- **Localização**: Canto inferior esquerdo
- **Função**: Controlar movimento (WASD)
- **Como usar**: Toque e arraste o knob
- **Movimento**:
  - **Cima** = W (avançar)
  - **Baixo** = S (recuar)
  - **Esquerda** = A (esquerda)
  - **Direita** = D (direita)

#### **2. Botões de Ação**
- **Localização**: Grade 2x2 na parte inferior
- **Botões**:
  - 🔨 **Pular** (Space)
  - ⚔️ **Atacar** (Click)
  - 👐 **Pegar** (E)
  - 📦 **Soltar** (G)

#### **3. Gestos Touch**
- **Swipe Direita**: Item anterior
- **Swipe Esquerda**: Próximo item
- **Pinch Out (afastar)**: Zoom out
- **Pinch In (juntar)**: Zoom in

---

## 🎨 Interface Mobile

### Menu Principal
- **Vertical** em vez de multi-painéis
- **Botões maiores** para toque
- **Instruções simplificadas**
- **Modais em full-screen** com animação de slide

### Chat e Comunicação
- **Chat flutuante reduzido**
- **Input maior** para texto
- **Amigos visíveis** em scroll horizontal

### Perfil
- **Bola de perfil** no canto superior direito (50x50px)
- **Clicável** para acessar settings

---

## ⚙️ Arquivos Criados

### 1. `style-mobile.css`
- Estilos responsivos para tela pequena
- Media queries para <768px width
- Touch-friendly sizing
- Layouts verticais

### 2. `game-mobile.js`
Classes e funcionalidades:

#### **VirtualJoystick**
```javascript
const joystick = new VirtualJoystick('#virtualJoystick');
const input = joystick.getInput(); // { x: -1..1, y: -1..1 }
```

#### **MobileActionButtons**
```javascript
const buttons = new MobileActionButtons();
// Simula keydown/keyup ao tocar
```

#### **TouchGestureManager**
```javascript
const gestures = new TouchGestureManager(canvas);
// Detecta swipe, pinch, etc
```

#### **JoystickInputController**
```javascript
const controller = new JoystickInputController(joystick, document);
// Conecta joystick aos eventos do jogo
```

---

## 🚀 Inicialização

### Automática:
```javascript
detectAndInitMobile() // Executado ao carregar a página
// Se mobile: cria HUD do jogo quando jogo começa
```

### Manual (se precisar):
```javascript
// Criar HUD
MobileControls.createMobileGameHUD();

// Inicializar controles
MobileControls.initializeMobileControls();
```

---

## 📐 Responsividade

### Breakpoints:

| Device | Width | Altura | CSS |
|--------|-------|--------|-----|
| iPhone SE | 375px | 667px | style-mobile.css |
| iPhone 13 | 390px | 844px | style-mobile.css |
| iPad Mini | 768px | 1024px | style.css (desktop) |
| Desktop | >1024px | qualquer | style.css |

### Ajustes Mobile:
- Font sizes: -20% vs desktop
- Botões: 15px padding (vs 10px)
- Gap: 12px (vs 20px)
- Max-height: 85vh para modais

---

## 🔧 Customização

### Alterar Tamanho do Joystick:
```css
/* Em style-mobile.css */
#virtualJoystick {
  width: 150px; /* Aumentar */
  height: 150px;
}
```

### Adicionar Novos Botões:
```html
<button class="action-btn" data-action="custom">
  Meu Botão
</button>
```

```javascript
// Em MobileActionButtons
triggerAction('custom', isPressed) {
  // seu código
}
```

### Desabilitar Gestos:
```javascript
// Em game-mobile.js
// Comentar a linha:
// const gestureManager = new TouchGestureManager(canvas);
```

---

## 🧪 Teste Local

### No PC (Emular Mobile):
1. Abra DevTools (F12)
2. Ctrl+Shift+M (ou Cmd+Shift+M)
3. Selecione dispositivo (iPhone 13, etc)
4. Recarregue a página

### Em Dispositivo Real:
1. Acesse `http://seu-ip:3000` do celular
2. Conecte à mesma rede
3. Interface mobile carrega automaticamente

---

## 🐛 Troubleshooting

### Joystick não aparece:
- Verifique se `#virtualJoystick` existe no HTML
- Confirme que `game-mobile.js` carregou (DevTools → Sources)
- Teste em mobile genuíno (emulador pode ter issue)

### Botões não funcionam:
- Verifique `data-action` nos botões
- Console → procure por erros de JavaScript
- Confirme que `socket` está conectado

### Controles lagados:
- Reduzir qualidade gráfica no jogo
- Aumentar FPS-cap para 30fps em mobile
- Usar `requestAnimationFrame` corretamente

---

## 📊 Performance

### Otimizações Incluídas:
- ✅ CSS media queries (carrega só o necessário)
- ✅ `requestAnimationFrame` para joystick
- ✅ Touch event throttling
- ✅ Joystick input loop ~ 60fps

### Próximas Melhorias:
- [ ] Accelerometer support (tilt to move)
- [ ] Haptic feedback (vibração)
- [ ] Voice chat
- [ ] Offline mode

---

## 📱 Suporta:

- ✅ iOS (Safari, Chrome)
- ✅ Android (Chrome, Firefox, Samsung)
- ✅ iPad (detecta como desktop, mas responsive)
- ✅ Tablets (fallback para desktop layout)

---

## 🎯 Fluxo Usuário Mobile

1. **Acessa app** no celular
2. **Detecção automática** → `style-mobile.css` carrega
3. **Menu principal** em layout vertical
4. **Clica Play** → Jogo começa
5. **Joystick + botões** aparecem automaticamente
6. **Chat flutuante** no canto (toque para expandir)
7. **Sai do jogo** → Menu volta para vertical

---

## 🔐 Dev Mode Mobile

Mesmo no mobile:
- F12 continua bloqueado (exceto para dev)
- DevTools acessível via `?devMode=true` query
- Touch gestures respeitam permissões

---

Enjoy playing on mobile! 🎮📱
