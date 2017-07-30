// Generate a unique id (unique within the entire client session).
// Useful for temporary DOM ids.
export const uniqueId = (function() {
  let idCounter = 0;
  return function(prefix = 'uid') {
    return `card_${prefix}_${++idCounter}`;
  };
}());
