// VIP Founder & Family Access Configuration
// Secret Passcode: 88888888 (Eight times 8)

export const VIP_CONFIG = {
  SECRET_CODE: '88888888',
  DESCRIPTION: 'Founder & Family secret passcode to bypass paywall and provision free projects',
  AUTHORIZED_OWNER: 'Sameer Sharma',
  LOCAL_STORAGE_KEY: 'answerindex_vip_unlocked',
  DEFAULT_VIP_TIER: 'enterprise'
};

export function verifyVipCode(inputCode) {
  if (!inputCode) return false;
  return inputCode.toString().trim() === VIP_CONFIG.SECRET_CODE;
}
