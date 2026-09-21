type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

const formatLog = (level: LogLevel, message: string, data?: unknown): LogEntry => ({
  timestamp: new Date().toISOString(),
  level,
  message,
  data,
});

const colorMap: Record<LogLevel, string> = {
  info: '\x1b[36m',    // Cyan
  warn: '\x1b[33m',    // Yellow
  error: '\x1b[31m',   // Red
  debug: '\x1b[90m',   // Gray
};

const reset = '\x1b[0m';

const log = (level: LogLevel, message: string, data?: unknown): void => {
  const entry = formatLog(level, message, data);
  const color = colorMap[level];
  const prefix = `${color}[${entry.timestamp}] [${level.toUpperCase()}]${reset}`;

  if (process.env.NODE_ENV === 'production') {
    // JSON format for production log aggregators
    console.log(JSON.stringify(entry));
  } else {
    if (data !== undefined) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }
};

export const logger = {
  info: (message: string, data?: unknown) => log('info', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  error: (message: string, data?: unknown) => log('error', message, data),
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      log('debug', message, data);
    }
  },
};
