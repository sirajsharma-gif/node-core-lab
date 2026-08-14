class AppError extends Error {
  constructor(message, options = {}) {
    super(message, { cause: options.cuase });
    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();
  }
}

class ValidationError extends AppError {
  constructor(message, { field, value, ...options } = {}) {
    super(message, options);
    this.field = field;
    this.value = value;
    this.retryable = false;
  }
}

class NetworkError extends AppError {
  constructor(message, { status, url, ...options } = {}) {
    super(message, options);
    this.status = status;
    this.url = url;
    this.retryable = status >= 500;
  }
}

class TimeoutError extends AppError {
  constructor(message, { ms, ...options } = {}) {
    super(message, options);
    this.ms = ms;
    this.retryable = true;
  }
}

class ConfigError extends AppError {
  constructor(message, { key, ...options } = {}) {
    super(message, options);
    this.key = key;
    this.retryable = false;
  }
}

const failedApi = (ms) =>
  new Promise((_, reject) => setTimeout(() => reject("Api failed"), ms));

async function loadApiData() {
  try {
    await failedApi(100);
  } catch (err) {
    throw new AppError(`Failed to data`, { cause: err });
  }
}

await loadApiData();
