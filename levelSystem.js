/**
 * Sistema de Nível e XP - Estilo EvoWorld.io
 * XP = Gemas ganhas no jogo
 * Dificuldade exponencial para subir de nível
 */

// Cores por nível (estilo EvoWorld)
const LEVEL_COLORS = {
  // 0-5: Cinzento
  0: '#CCCCCC',
  1: '#CCCCCC',
  2: '#CCCCCC',
  3: '#CCCCCC',
  4: '#CCCCCC',
  5: '#CCCCCC',
  
  // 6-10: Verde claro
  6: '#66FF66',
  7: '#66FF66',
  8: '#66FF66',
  9: '#66FF66',
  10: '#66FF66',
  
  // 11-15: Verde
  11: '#00FF00',
  12: '#00FF00',
  13: '#00FF00',
  14: '#00FF00',
  15: '#00FF00',
  
  // 16-20: Azul claro
  16: '#66FFFF',
  17: '#66FFFF',
  18: '#66FFFF',
  19: '#66FFFF',
  20: '#66FFFF',
  
  // 21-25: Azul
  21: '#0066FF',
  22: '#0066FF',
  23: '#0066FF',
  24: '#0066FF',
  25: '#0066FF',
  
  // 26-30: Roxo
  26: '#9933FF',
  27: '#9933FF',
  28: '#9933FF',
  29: '#9933FF',
  30: '#9933FF',
  
  // 31-40: Rosa
  31: '#FF66FF',
  32: '#FF66FF',
  33: '#FF66FF',
  34: '#FF66FF',
  35: '#FF66FF',
  36: '#FF66FF',
  37: '#FF66FF',
  38: '#FF66FF',
  39: '#FF66FF',
  40: '#FF66FF',
  
  // 41-50: Vermelho
  41: '#FF3333',
  42: '#FF3333',
  43: '#FF3333',
  44: '#FF3333',
  45: '#FF3333',
  46: '#FF3333',
  47: '#FF3333',
  48: '#FF3333',
  49: '#FF3333',
  50: '#FF3333',
  
  // 50+: Branco piscante (será tratado especialmente)
  pulsing: '#FFFFFF'
};

// Skins por nível (cor da blusa)
const SKIN_COLORS_BY_LEVEL = {
  human: {
    0: '#FFD700',    // Ouro
    10: '#FF6B6B',   // Vermelho
    20: '#4ECDC4',   // Azul-verde
    30: '#95E1D3',   // Verde mint
    40: '#F38181',   // Rosa
    50: '#AA96DA'    // Roxo
  },
  zombie: {
    0: '#339933',    // Verde escuro
    10: '#669900',   // Verde amarelo
    20: '#CCFF00',   // Amarelo
    30: '#FF6600',   // Laranja
    40: '#FF0000',   // Vermelho
    50: '#660066'    // Roxo escuro
  }
};

/**
 * Calcula o XP necessário para atingir um nível
 * Usa progressão exponencial: base * (nível ^ expoente)
 */
function calculateXPForLevel(level) {
  const base = 100;
  const exponent = 1.5;
  return Math.floor(base * Math.pow(level, exponent));
}

/**
 * Calcula o nível atual baseado no XP total
 */
function calculateLevelFromXP(totalXP) {
  let level = 0;
  let accumulatedXP = 0;
  
  while (accumulatedXP + calculateXPForLevel(level + 1) <= totalXP) {
    accumulatedXP += calculateXPForLevel(level + 1);
    level++;
  }
  
  return level;
}

/**
 * Calcula o XP necessário para próximo nível
 */
function getXPProgressToNextLevel(totalXP) {
  const currentLevel = calculateLevelFromXP(totalXP);
  const currentLevelStartXP = getTotalXPForLevel(currentLevel);
  const nextLevelStartXP = getTotalXPForLevel(currentLevel + 1);
  
  const currentProgress = totalXP - currentLevelStartXP;
  const neededForNext = nextLevelStartXP - currentLevelStartXP;
  
  return {
    current: currentProgress,
    needed: neededForNext,
    percentage: Math.min(100, Math.round((currentProgress / neededForNext) * 100))
  };
}

/**
 * Calcula o XP total acumulado até um nível específico
 */
function getTotalXPForLevel(level) {
  let total = 0;
  for (let i = 1; i <= level; i++) {
    total += calculateXPForLevel(i);
  }
  return total;
}

/**
 * Retorna a cor do nível
 */
function getLevelColor(level) {
  if (level >= 50) {
    return LEVEL_COLORS.pulsing;
  }
  return LEVEL_COLORS[level] || '#FFFFFF';
}

/**
 * Retorna a cor da skin baseada no nível
 */
function getSkinColor(level, role = 'human') {
  const skinMap = SKIN_COLORS_BY_LEVEL[role];
  
  // Encontra a cor mais próxima do nível
  const availableLevels = Object.keys(skinMap).map(Number).sort((a, b) => b - a);
  for (const lvl of availableLevels) {
    if (level >= lvl) {
      return skinMap[lvl];
    }
  }
  
  return skinMap[0];
}

/**
 * Calcula bônus de gemas baseado no nível
 * +1% a cada 5 níveis
 */
function getGemBonusMultiplier(level) {
  return 1 + (Math.floor(level / 5) * 0.01);
}

/**
 * Inicializa um novo usuário com nível 0
 */
function initializeUserLevel(userObj) {
  if (!userObj.level) {
    userObj.level = 0;
    userObj.totalXP = 0;
    userObj.redeemedCodes = [];
  }
  return userObj;
}

/**
 * Adiciona XP a um usuário
 */
function addXPToUser(userObj, xpAmount) {
  const oldLevel = userObj.level;
  userObj.totalXP = (userObj.totalXP || 0) + xpAmount;
  userObj.level = calculateLevelFromXP(userObj.totalXP);
  
  return {
    leveledUp: userObj.level > oldLevel,
    oldLevel,
    newLevel: userObj.level,
    totalXP: userObj.totalXP
  };
}

module.exports = {
  LEVEL_COLORS,
  SKIN_COLORS_BY_LEVEL,
  calculateXPForLevel,
  calculateLevelFromXP,
  getXPProgressToNextLevel,
  getTotalXPForLevel,
  getLevelColor,
  getSkinColor,
  getGemBonusMultiplier,
  initializeUserLevel,
  addXPToUser
};
