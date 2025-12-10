/**
 * Sistema de Códigos de Resgate (Codes/Coupons)
 */

const REDEMPTION_CODES = {
  '1204201114': {
    name: 'Developer Access',
    description: 'Desbloqueia menu de desenvolvedor',
    reward: {
      isDeveloper: true,
      bonus: 0
    },
    maxUses: 1,
    timesUsed: 0
  },
  'WELCOME100': {
    name: 'Welcome Bonus',
    description: 'Ganhe 100 gemas de boas-vindas',
    reward: {
      gems: 100
    },
    maxUses: null, // unlimited
    timesUsed: 0
  },
  'LEVEL10': {
    name: 'Level 10 Bonus',
    description: 'Ganhe 50 gemas quando atingir nível 10',
    reward: {
      gems: 50,
      minLevel: 10
    },
    maxUses: null,
    timesUsed: 0
  }
};

/**
 * Verifica e aplica código de resgate
 */
function redeemCode(username, code, userObj) {
  const codeData = REDEMPTION_CODES[code.toUpperCase()];
  
  if (!codeData) {
    return {
      success: false,
      message: 'Código inválido.'
    };
  }
  
  // Verifica se já foi resgatado
  if (userObj.redeemedCodes && userObj.redeemedCodes.includes(code.toUpperCase())) {
    return {
      success: false,
      message: 'Você já resgatou este código.'
    };
  }
  
  // Verifica limit de usos
  if (codeData.maxUses && codeData.timesUsed >= codeData.maxUses) {
    return {
      success: false,
      message: 'Código expirado.'
    };
  }
  
  // Aplicar recompensa
  if (codeData.reward.gems) {
    userObj.gems = (userObj.gems || 0) + codeData.reward.gems;
  }
  
  if (codeData.reward.isDeveloper) {
    userObj.isDeveloper = true;
  }
  
  // Registrar resgate
  if (!userObj.redeemedCodes) userObj.redeemedCodes = [];
  userObj.redeemedCodes.push(code.toUpperCase());
  codeData.timesUsed++;
  
  return {
    success: true,
    message: `Código resgatado! ${codeData.description}`,
    reward: codeData.reward
  };
}

/**
 * Adiciona novo código
 */
function addRedemptionCode(code, name, description, reward, maxUses = null) {
  REDEMPTION_CODES[code.toUpperCase()] = {
    name,
    description,
    reward,
    maxUses,
    timesUsed: 0
  };
}

module.exports = {
  REDEMPTION_CODES,
  redeemCode,
  addRedemptionCode
};
