LOG_TYPES = {
  NONE: 0,
  ERROR: 1,
  NORMAL: 2,
  DEBUG: 3,
  FFDEBUG: 4
};

let logType = LOG_TYPES.NORMAL;

const setLogType = (type) => {
  if (typeof type !== 'number') return;

  logType = type;
};

const logTime = () => {
  let nowDate = new Date();
  return nowDate.toLocaleDateString() + ' ' + nowDate.toLocaleTimeString([], { hour12: false });
};

const log = (...args) => {
  if (logType < LOG_TYPES.NORMAL) return;

  console.log(logTime(), ...args);
};

const error = (...args) => {
  if (logType < LOG_TYPES.ERROR) return;

  console.error(logTime(), ...args);
};

const debug = (...args) => {
  if (logType < LOG_TYPES.DEBUG) return;

  console.log(logTime(), ...args);
};

const ffdebug = (...args) => {
  if (logType < LOG_TYPES.FFDEBUG) return;

  console.log(logTime(), ...args);
};

module.exports = {
  LOG_TYPES,
  setLogType,

  log, error, debug, ffdebug
}
