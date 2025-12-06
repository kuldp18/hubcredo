/**
 * Parse duration string to milliseconds
 * @param {string} duration - Duration string (e.g., '15m', '1d', '7d')
 * @returns {number} Duration in milliseconds
 */
export const parseDuration = (duration) => {
  if (!duration) return 0;
  
  // If it's already a number, return it
  if (typeof duration === 'number') return duration;
  
  const unit = duration.slice(-1);
  const value = parseInt(duration.slice(0, -1));
  
  if (isNaN(value)) return 0;
  
  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      // Assume milliseconds if no unit or unknown unit (though sticking to the specific known ones is safer)
      return value;
  }
};
