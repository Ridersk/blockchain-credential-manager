const AVAILABLE_LOG_LEVELS = {
  debug: 0,
  warn: 1,
  error: 2
};

export const LOG_LEVEL =
  AVAILABLE_LOG_LEVELS[(process.env.LOG_LEVEL as keyof typeof AVAILABLE_LOG_LEVELS) || "debug"];

console.log("LOG_LEVEL:", LOG_LEVEL);

export default class Logger {
  static info(message?: any, ...optionalParams: any[]) {
    if (LOG_LEVEL <= AVAILABLE_LOG_LEVELS.debug) {
      console.log(message, ...optionalParams);
    }
  }

  static warn(message?: any, ...optionalParams: any[]) {
    if (LOG_LEVEL <= AVAILABLE_LOG_LEVELS.warn) {
      console.warn(message, ...optionalParams);
    }
  }

  static error(message?: any, ...optionalParams: any[]) {
    if (LOG_LEVEL <= AVAILABLE_LOG_LEVELS.error) {
      console.error(message, ...optionalParams);
    }
  }
}
