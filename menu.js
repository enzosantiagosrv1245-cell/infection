// Simple Menu System
document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    
    // Elementos
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    const loginCloseBtn = document.getElementById('loginCloseBtn');
    const registerSubmitBtn = document.getElementById('registerSubmitBtn');
    const registerCloseBtn = document.getElementById('registerCloseBtn');
    
    const authSection = document.getElementById('authSection');
    const playSection = document.getElementById('playSection');
    const playGameBtn = document.getElementById('playGameBtn');
    const playerName = document.getElementById('playerName');
    const playerLevel = document.getElementById('playerLevel');
    
    const mainMenuOverlay = document.getElementById('mainMenuOverlay');
    const gameCanvas = document.getElementById('gameCanvas');
    const chatInput = document.getElementById('chatInput');
    
    let currentUser = null;
    
    // Abrir modal de login
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
    }
    
    // Fechar modal de login
    if (loginCloseBtn) {
        loginCloseBtn.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });
    }
    
    // Abrir modal de registro
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            registerModal.classList.add('active');
        });
    }
    
    // Fechar modal de registro
    if (registerCloseBtn) {
        registerCloseBtn.addEventListener('click', () => {
            registerModal.classList.remove('active');
        });
    }
    
    // Fechar modal ao clicar fora
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }
    
    if (registerModal) {
        registerModal.addEventListener('click', (e) => {
            if (e.target === registerModal) {
                registerModal.classList.remove('active');
            }
        });
    }
    
    // Login
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', () => {
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!username || !password) {
                alert('Preencha todos os campos');
                return;
            }
            
            socket.emit('login', { username, password });
        });
    }
    
    // Register
    if (registerSubmitBtn) {
        registerSubmitBtn.addEventListener('click', () => {
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            
            if (!username || !password) {
                alert('Preencha todos os campos');
                return;
            }
            
            socket.emit('register', { username, password });
        });
    }
    
    // Jogar
    if (playGameBtn) {
        playGameBtn.addEventListener('click', () => {
            startGame();
        });
    }
    
    // Socket events
    socket.on('loginResult', (data) => {
        if (data.success) {
            currentUser = data.userData;
            showPlaySection();
            loginModal.classList.remove('active');
            document.getElementById('loginUsername').value = '';
            document.getElementById('loginPassword').value = '';
        } else {
            alert('Erro: ' + data.message);
        }
    });
    
    socket.on('registerResult', (data) => {
        if (data.success) {
            alert('Conta criada com sucesso! Agora faça login.');
            registerModal.classList.remove('active');
            document.getElementById('registerUsername').value = '';
            document.getElementById('registerPassword').value = '';
        } else {
            alert('Erro: ' + data.message);
        }
    });
    
    // Mostrar seção de jogar
    function showPlaySection() {
        authSection.classList.add('hidden-element');
        playSection.classList.remove('hidden-element');
        
        if (currentUser) {
            playerName.textContent = currentUser.username;
            playerLevel.textContent = `Nível: ${currentUser.level || 0}`;
        }
    }
    
    // Iniciar jogo
    function startGame() {
        mainMenuOverlay.style.display = 'none';
        gameCanvas.classList.remove('hidden-element');
        chatInput.classList.remove('hidden-element');
        
        // Trigger game start
        socket.emit('playerReady');
    }
});
