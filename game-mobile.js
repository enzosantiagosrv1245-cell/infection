/* ======================================= */
/* === CONTROLES E LÓGICA MOBILE ESPECÍFICA === */
/* ======================================= */

/**
 * Joystick Virtual para Mobile
 * Detecta toque, calcula movimento em tempo real
 */
class VirtualJoystick {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.knob = this.container.querySelector('.knob');
    this.maxRadius = this.container.offsetWidth / 2 - (this.knob.offsetWidth / 2);
    
    this.x = 0;
    this.y = 0;
    this.active = false;
    this.centerX = 0;
    this.centerY = 0;
    
    this.setupListeners();
  }

  setupListeners() {
    this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e));
  }

  handleTouchStart(e) {
    this.active = true;
    const rect = this.container.getBoundingClientRect();
    this.centerX = rect.left + rect.width / 2;
    this.centerY = rect.top + rect.height / 2;
  }

  handleTouchMove(e) {
    if (!this.active) return;

    const touch = e.touches[0];
    const dx = touch.clientX - this.centerX;
    const dy = touch.clientY - this.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.maxRadius) {
      this.x = (dx / distance) * this.maxRadius;
      this.y = (dy / distance) * this.maxRadius;
    } else {
      this.x = dx;
      this.y = dy;
    }

    this.updateKnobPosition();
  }

  handleTouchEnd() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.updateKnobPosition();
  }

  updateKnobPosition() {
    this.knob.style.transform = `translate(calc(-50% + ${this.x}px), calc(-50% + ${this.y}px))`;
  }

  getInput() {
    return {
      x: this.x / this.maxRadius,
      y: this.y / this.maxRadius,
    };
  }
}

/**
 * Gerenciador de Botões de Ação Mobile
 */
class MobileActionButtons {
  constructor() {
    this.buttons = {
      jump: document.querySelector('[data-action="jump"]'),
      attack: document.querySelector('[data-action="attack"]'),
      pickup: document.querySelector('[data-action="pickup"]'),
      use: document.querySelector('[data-action="use"]'),
      drop: document.querySelector('[data-action="drop"]'),
      buy: document.querySelector('[data-action="buy"]'),
      teleport: document.querySelector('[data-action="teleport"]'),
      inventory: document.querySelector('[data-action="inventory"]'),
    };

    this.setupListeners();
  }

  setupListeners() {
    Object.entries(this.buttons).forEach(([action, button]) => {
      if (!button) return;

      button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.triggerAction(action, true);
      });

      button.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.triggerAction(action, false);
      });
    });
  }

  triggerAction(action, isPressed) {
    // Mapear ações para teclas equivalentes
    const actionMap = {
      jump: 'Space',
      attack: 'Click',
      pickup: 'e',
      use: 'e',
      drop: 'g',
      buy: 'b',
      teleport: 'z',
      inventory: 'i',
    };

    const key = actionMap[action];
    if (!key) return;

    // Simular keydown/keyup para o engine do jogo
    const eventType = isPressed ? 'keydown' : 'keyup';
    const event = new KeyboardEvent(eventType, {
      key: key.toLowerCase(),
      code: key,
      bubbles: true,
    });

    document.dispatchEvent(event);
    
    // Feedback visual
    const button = this.buttons[action];
    if (button) {
      if (isPressed) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    }
  }
}

/**
 * Suporte para Gestos Touch (swipe, pinch, etc)
 */
class TouchGestureManager {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartDistance = 0;

    this.setupListeners();
  }

  setupListeners() {
    this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
  }

  handleTouchStart(e) {
    if (e.touches.length === 1) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      this.touchStartDistance = Math.sqrt(dx * dx + dy * dy);
    }
  }

  handleTouchMove(e) {
    // Detectar swipe para trocar armas, etc
    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - this.touchStartX;
      const dy = e.touches[0].clientY - this.touchStartY;

      if (Math.abs(dx) > 50 && Math.abs(dy) < 50) {
        // Swipe horizontal
        if (dx > 0) {
          this.onSwipeRight();
        } else {
          this.onSwipeLeft();
        }
        this.touchStartX = e.touches[0].clientX;
      }
    }

    // Pinch para zoom (opcional)
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (this.touchStartDistance > 0) {
        const delta = distance - this.touchStartDistance;
        if (Math.abs(delta) > 30) {
          if (delta > 0) {
            this.onPinchOut();
          } else {
            this.onPinchIn();
          }
          this.touchStartDistance = distance;
        }
      }
    }
  }

  handleTouchEnd(e) {
    // Reset
  }

  onSwipeRight() {
    console.log('Swipe right detected');
    // Pode trocar arma/item anterior
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
  }

  onSwipeLeft() {
    console.log('Swipe left detected');
    // Pode trocar arma/item próxima
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e' }));
  }

  onPinchOut() {
    console.log('Pinch out - zoom out');
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '-' }));
  }

  onPinchIn() {
    console.log('Pinch in - zoom in');
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '+' }));
  }
}

/**
 * Simular movimento via Joystick Virtual no jogo
 */
class JoystickInputController {
  constructor(joystick, targetElement = window) {
    this.joystick = joystick;
    this.target = targetElement;
    this.animationId = null;
    this.keysPressed = {};
    
    this.startInputLoop();
  }

  startInputLoop() {
    const loop = () => {
      const input = this.joystick.getInput();
      
      // Atualizar estado de teclas baseado no joystick
      this.updateKeyState('w', input.y < -0.2);
      this.updateKeyState('a', input.x < -0.2);
      this.updateKeyState('s', input.y > 0.2);
      this.updateKeyState('d', input.x > 0.2);

      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
  }

  updateKeyState(key, isPressed) {
    const wasPressed = this.keysPressed[key] || false;
    
    if (isPressed && !wasPressed) {
      // Key just pressed
      this.dispatchKeyEvent('keydown', key);
      this.keysPressed[key] = true;
    } else if (!isPressed && wasPressed) {
      // Key just released
      this.dispatchKeyEvent('keyup', key);
      this.keysPressed[key] = false;
    }
  }

  dispatchKeyEvent(type, key) {
    const event = new KeyboardEvent(type, {
      key: key,
      code: key.toUpperCase(),
      bubbles: true,
    });
    this.target.dispatchEvent(event);
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    // Liberar todas as teclas
    Object.keys(this.keysPressed).forEach(key => {
      if (this.keysPressed[key]) {
        this.dispatchKeyEvent('keyup', key);
        this.keysPressed[key] = false;
      }
    });
  }
}

/**
 * Inicializar Controles Mobile quando o jogo começa
 */
function initializeMobileControls() {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;

  // Criar Joystick Virtual
  const joystickContainer = document.getElementById('virtualJoystick');
  if (joystickContainer) {
    const joystick = new VirtualJoystick('#virtualJoystick');
    
    // Conectar joystick aos eventos do jogo
    new JoystickInputController(joystick, document);
    
    console.log('Virtual Joystick initialized');
  }

  // Criar Botões de Ação
  const actionButtons = new MobileActionButtons();
  console.log('Mobile Action Buttons initialized');

  // Gerenciador de Gestos
  const gestureManager = new TouchGestureManager(canvas);
  console.log('Touch Gesture Manager initialized');
}

/**
 * Criar HUD do Jogo (Joystick + Botões)
 */
function createMobileGameHUD() {
  const gameHUD = document.createElement('div');
  gameHUD.id = 'gameHUD';

  // Joystick Virtual
  const joystick = document.createElement('div');
  joystick.id = 'virtualJoystick';
  const knob = document.createElement('div');
  knob.className = 'knob';
  joystick.appendChild(knob);

  // Botões de Ação
  const actionButtons = document.createElement('div');
  actionButtons.id = 'actionButtons';

  const actions = [
    { name: 'Pular', action: 'jump', key: 'Space' },
    { name: 'Atacar', action: 'attack', key: 'Click' },
    { name: 'Pegar', action: 'pickup', key: 'E' },
    { name: 'Soltar', action: 'drop', key: 'G' },
  ];

  actions.forEach(({ name, action, key }) => {
    const btn = document.createElement('button');
    btn.className = 'action-btn';
    btn.setAttribute('data-action', action);
    btn.textContent = `${name}\n(${key})`;
    actionButtons.appendChild(btn);
  });

  gameHUD.appendChild(joystick);
  gameHUD.appendChild(actionButtons);

  document.body.appendChild(gameHUD);
}

/**
 * Detectar se é Mobile e ajustar interface
 */
function detectAndInitMobile() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                   (window.innerWidth < 768 && window.matchMedia('(hover: none) and (pointer: coarse)').matches);

  if (isMobile) {
    console.log('📱 Mobile device detected - Loading mobile UI');
    
    // Ocultar menu após começar jogo
    document.addEventListener('game-started', () => {
      setTimeout(() => {
        createMobileGameHUD();
        initializeMobileControls();
      }, 500);
    });
  }
}

/**
 * Ajustar viewport e prevenir zoom pinch
 */
function setupMobileViewport() {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
    );
  }

  // Prevenir zoom ao duplo-tap
  document.addEventListener('touchend', (e) => {
    if (e.touches.length === 0 && 
        Date.now() - (window.lastTouchEnd || 0) < 300) {
      e.preventDefault();
    }
    window.lastTouchEnd = Date.now();
  }, false);
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupMobileViewport();
    detectAndInitMobile();
  });
} else {
  setupMobileViewport();
  detectAndInitMobile();
}

// Exportar para uso global
window.MobileControls = {
  VirtualJoystick,
  MobileActionButtons,
  TouchGestureManager,
  JoystickInputController,
  initializeMobileControls,
  createMobileGameHUD,
};
