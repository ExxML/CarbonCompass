/**
 * Helper utilities for rendering direction steps
 */

/**
 * Get turn icon from instruction text
 * @param {string} instruction - Instruction text
 * @returns {string} Emoji icon
 */
export const getTurnIcon = (instruction) => {
  const lower = instruction.toLowerCase();
  if (lower.includes('left')) return '⬅️';
  if (lower.includes('right')) return '➡️';
  if (lower.includes('straight')) return '⬆️';
  if (lower.includes('u-turn')) return '🔄';
  if (lower.includes('merge')) return '↗️';
  if (lower.includes('exit')) return '🛣️';
  return '🚗';
};

/**
 * Extract highway information from instruction
 * @param {string} instruction - Instruction text
 * @returns {string|null} Highway info or null
 */
export const getHighwayInfo = (instruction) => {
  if (instruction.toLowerCase().includes('hwy') || instruction.toLowerCase().includes('highway')) {
    const match = instruction.match(/Hwy\s+(\d+)|Highway\s+(\d+)/i);
    return match ? `Highway ${match[1] || match[2]}` : 'Highway';
  }
  return null;
};

/**
 * Get walking context from instruction
 * @param {string} instruction - Instruction text
 * @returns {object} Context info with icon, type, color
 */
export const getWalkingContext = (instruction) => {
  const lower = instruction.toLowerCase();
  if (lower.includes('sidewalk')) return { icon: '🚶', type: 'Sidewalk', color: '#7c3aed' };
  if (lower.includes('crosswalk') || lower.includes('cross'))
    return { icon: '🚸', type: 'Crosswalk', color: '#f59e0b' };
  if (lower.includes('stairs') || lower.includes('steps'))
    return { icon: '🪜', type: 'Stairs', color: '#ef4444' };
  if (lower.includes('path') || lower.includes('trail'))
    return { icon: '🌳', type: 'Path', color: '#059669' };
  if (lower.includes('park')) return { icon: '🏞️', type: 'Park', color: '#10b981' };
  return { icon: '🚶', type: 'Walking', color: '#7c3aed' };
};

/**
 * Get biking context from instruction
 * @param {string} instruction - Instruction text
 * @returns {object} Context info with icon, type, color
 */
export const getBikeContext = (instruction) => {
  const lower = instruction.toLowerCase();
  if (lower.includes('bike lane') || lower.includes('cycle'))
    return { icon: '🚴', type: 'Bike Lane', color: '#10b981' };
  if (lower.includes('path') || lower.includes('trail'))
    return { icon: '🌳', type: 'Bike Path', color: '#059669' };
  if (lower.includes('road') && !lower.includes('bike'))
    return { icon: '🚗', type: 'Shared Road', color: '#f59e0b' };
  if (lower.includes('sidewalk')) return { icon: '🛣️', type: 'Sidewalk', color: '#6b7280' };
  return { icon: '🚴', type: 'Bike Route', color: '#16a34a' };
};

/**
 * Strip HTML tags from instruction text
 * @param {string} text - HTML text
 * @returns {string} Plain text
 */
export const stripHtml = (text) => {
  return text?.replace(/<[^>]*>/g, '') || '';
};
