/**
 * Sistema de Missões Diárias e Semanais
 * Gera automaticamente e recompensa com gemas/XP
 */

const DAILY_MISSIONS = [
    {
        id: 'survive_5min',
        name: 'Sobreviva 5 minutos',
        description: 'Dure 5 minutos em uma rodada',
        reward: 50,
        progress: 0,
        maxProgress: 5 * 60 * 1000, // 5 minutos em ms
        type: 'human'
    },
    {
        id: 'earn_100gems',
        name: 'Ganhe 100 gemas',
        description: 'Acumule 100 gemas em uma rodada',
        reward: 30,
        progress: 0,
        maxProgress: 100,
        type: 'both'
    },
    {
        id: 'kill_5zombies',
        name: 'Mate 5 zumbis',
        description: 'Elimine 5 zumbis',
        reward: 75,
        progress: 0,
        maxProgress: 5,
        type: 'human'
    },
    {
        id: 'infect_5humans',
        name: 'Infecte 5 humanos',
        description: 'Converta 5 humanos em zumbis',
        reward: 75,
        progress: 0,
        maxProgress: 5,
        type: 'zombie'
    }
];

const WEEKLY_MISSIONS = [
    {
        id: 'level_up',
        name: 'Suba de Nível',
        description: 'Chegue ao nível 5',
        reward: 500,
        progress: 0,
        maxProgress: 5,
        type: 'both'
    },
    {
        id: 'total_gems_1000',
        name: 'Ganhe 1000 gemas',
        description: 'Acumule 1000 gemas ao longo da semana',
        reward: 200,
        progress: 0,
        maxProgress: 1000,
        type: 'both'
    },
    {
        id: 'win_5rounds',
        name: 'Ganhe 5 rodadas',
        description: 'Vença 5 rodadas',
        reward: 300,
        progress: 0,
        maxProgress: 5,
        type: 'both'
    }
];

class MissionSystem {
    constructor() {
        this.playerMissions = {};
        this.missionResets = {
            daily: Date.now() + 24 * 60 * 60 * 1000,
            weekly: Date.now() + 7 * 24 * 60 * 60 * 1000
        };
    }

    /**
     * Inicializar missões para um novo jogador
     */
    initializePlayerMissions(username) {
        this.playerMissions[username] = {
            daily: JSON.parse(JSON.stringify(DAILY_MISSIONS)),
            weekly: JSON.parse(JSON.stringify(WEEKLY_MISSIONS))
        };
    }

    /**
     * Atualizar progresso de uma missão
     */
    updateMissionProgress(username, missionId, progressAmount = 1) {
        if (!this.playerMissions[username]) {
            this.initializePlayerMissions(username);
        }

        // Procurar em daily
        let mission = this.playerMissions[username].daily.find(m => m.id === missionId);
        if (mission && mission.progress < mission.maxProgress) {
            mission.progress = Math.min(mission.progress + progressAmount, mission.maxProgress);
            return mission;
        }

        // Procurar em weekly
        mission = this.playerMissions[username].weekly.find(m => m.id === missionId);
        if (mission && mission.progress < mission.maxProgress) {
            mission.progress = Math.min(mission.progress + progressAmount, mission.maxProgress);
            return mission;
        }

        return null;
    }

    /**
     * Completar uma missão e retornar a recompensa
     */
    completeMission(username, missionId) {
        if (!this.playerMissions[username]) {
            this.initializePlayerMissions(username);
        }

        let missions = this.playerMissions[username].daily;
        let mission = missions.find(m => m.id === missionId);
        let isDaily = true;

        if (!mission) {
            missions = this.playerMissions[username].weekly;
            mission = missions.find(m => m.id === missionId);
            isDaily = false;
        }

        if (mission && mission.progress >= mission.maxProgress && !mission.completed) {
            mission.completed = true;
            mission.completedAt = Date.now();
            return {
                success: true,
                reward: mission.reward,
                isDaily,
                missionId
            };
        }

        return {
            success: false,
            reason: 'Mission not completed or already claimed'
        };
    }

    /**
     * Resetar missões diárias
     */
    resetDailyMissions() {
        Object.keys(this.playerMissions).forEach(username => {
            this.playerMissions[username].daily = JSON.parse(JSON.stringify(DAILY_MISSIONS));
        });
        this.missionResets.daily = Date.now() + 24 * 60 * 60 * 1000;
        console.log('[MISSIONS] Daily missions reset');
    }

    /**
     * Resetar missões semanais
     */
    resetWeeklyMissions() {
        Object.keys(this.playerMissions).forEach(username => {
            this.playerMissions[username].weekly = JSON.parse(JSON.stringify(WEEKLY_MISSIONS));
        });
        this.missionResets.weekly = Date.now() + 7 * 24 * 60 * 60 * 1000;
        console.log('[MISSIONS] Weekly missions reset');
    }

    /**
     * Obter todas as missões de um jogador
     */
    getPlayerMissions(username) {
        if (!this.playerMissions[username]) {
            this.initializePlayerMissions(username);
        }
        return this.playerMissions[username];
    }

    /**
     * Verificar e resetar se necessário
     */
    checkAndReset() {
        const now = Date.now();
        if (now >= this.missionResets.daily) {
            this.resetDailyMissions();
        }
        if (now >= this.missionResets.weekly) {
            this.resetWeeklyMissions();
        }
    }
}

module.exports = {
    MissionSystem,
    DAILY_MISSIONS,
    WEEKLY_MISSIONS
};
