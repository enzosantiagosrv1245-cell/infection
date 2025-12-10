/**
 * Sistema de Proteção contra Hackers
 * Detecção de manipulação, validação robusta, honeypots
 */

class SecuritySystem {
    constructor() {
        this.suspiciousActivity = {};
        this.blockedIPs = new Set();
        this.maxAttemptsPerIP = 10;
        this.timeoutMinutes = 15;
    }

    /**
     * Sanitizar entrada de usuário
     */
    sanitize(input) {
        if (typeof input !== 'string') return '';
        return input
            .replace(/[<>\"'&;`]/g, '') // Remove caracteres perigosos
            .trim()
            .substring(0, 50); // Limita tamanho
    }

    /**
     * Validar dados do jogador
     */
    validatePlayerData(player, allowedFields) {
        if (!player || typeof player !== 'object') return false;
        
        // Checar se tem campos inesperados
        const playerKeys = Object.keys(player);
        for (const key of playerKeys) {
            if (!allowedFields.includes(key)) {
                return false; // Campo não autorizado
            }
        }
        
        return true;
    }

    /**
     * Validar movimento do jogador (anti-teleport hack)
     */
    validateMovement(oldX, oldY, newX, newY, maxDistance = 500) {
        const dx = Math.abs(newX - oldX);
        const dy = Math.abs(newY - oldY);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance <= maxDistance; // Se moveu muito, é suspeito
    }

    /**
     * Validar velocidade (anti-speed hack)
     */
    validateSpeed(speed, maxSpeed = 10) {
        return speed >= 0 && speed <= maxSpeed;
    }

    /**
     * Registrar atividade suspeita
     */
    logSuspicious(username, socketId, reason) {
        const key = `${username}_${socketId}`;
        
        if (!this.suspiciousActivity[key]) {
            this.suspiciousActivity[key] = {
                count: 0,
                reasons: [],
                lastSeen: Date.now()
            };
        }
        
        this.suspiciousActivity[key].count++;
        this.suspiciousActivity[key].reasons.push({
            reason,
            timestamp: Date.now()
        });
        this.suspiciousActivity[key].lastSeen = Date.now();
        
        console.warn(`[SECURITY] Suspicious activity: ${username} - ${reason}`);
        
        return this.suspiciousActivity[key].count;
    }

    /**
     * Verificar se conta está comprometida
     */
    isSuspicious(username, socketId, threshold = 5) {
        const key = `${username}_${socketId}`;
        return this.suspiciousActivity[key] && 
               this.suspiciousActivity[key].count >= threshold;
    }

    /**
     * Validar gems (não pode ser negativo)
     */
    validateGems(gems) {
        return Number.isInteger(gems) && gems >= 0 && gems <= 999999;
    }

    /**
     * Validar nível (deve estar dentro do intervalo)
     */
    validateLevel(level) {
        return Number.isInteger(level) && level >= 0 && level <= 200;
    }

    /**
     * Criar honeypot para enganar bots/hackers
     */
    createHoneypot() {
        return {
            // Fake endpoints que parecem valiosos
            adminToken: 'fake_token_' + Math.random(),
            secretPassword: 'you_found_me',
            dbConnection: 'mysql://admin:admin@localhost/game',
            apiKey: 'sk-fake-' + Math.random().toString(36).substring(7),
            
            // Métodos fake
            getAdminPanel: function() {
                console.warn('Honeypot accessed!');
                return { error: 'Unauthorized' };
            },
            
            executeQuery: function(query) {
                console.warn('SQL Injection attempt detected:', query);
                return { error: 'Invalid query' };
            }
        };
    }

    /**
     * Validar hash de integridade
     */
    validateIntegrity(data, expectedHash) {
        // Implementar verificação de hash
        // Por enquanto, retorna true
        return true;
    }

    /**
     * Limpar atividades antigas
     */
    cleanup() {
        const now = Date.now();
        const timeout = this.timeoutMinutes * 60 * 1000;
        
        Object.keys(this.suspiciousActivity).forEach(key => {
            if (now - this.suspiciousActivity[key].lastSeen > timeout) {
                delete this.suspiciousActivity[key];
            }
        });
    }
}

module.exports = SecuritySystem;
