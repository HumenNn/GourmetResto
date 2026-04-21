// Конфигурация API для GourmetResto
const API_CONFIG = {
  // Базовые URL для API (симуляция)
  BASE_URL: 'data/',

  // Эндпоинты
  ENDPOINTS: {
    MENU: 'menu.json',
    BOOKINGS: 'bookings.json',
  },

  // Настройки запросов
  REQUEST_CONFIG: {
    METHOD: 'GET',
    HEADERS: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    TIMEOUT: 5000, // 5 секунд таймаут
  },

  // Ключи для локального хранилища
  STORAGE_KEYS: {
    MENU_CACHE: 'gourmetresto_menu_cache',
    BOOKINGS_OFFLINE: 'gourmetresto_bookings_offline',
    LAST_SYNC: 'gourmetresto_last_sync',
    MENU_TIMESTAMP: 'gourmetresto_menu_timestamp',
  },

  // Настройки кэширования
  CACHE_CONFIG: {
    MENU_TTL: 24 * 60 * 60 * 1000, // 24 часа в миллисекундах
    SYNC_INTERVAL: 30 * 1000, // 30 секунд интервал синхронизации
  },

  // Сообщения об ошибках
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
    TIMEOUT_ERROR: 'Превышено время ожидания ответа от сервера.',
    PARSE_ERROR: 'Ошибка обработки данных от сервера.',
    OFFLINE_MODE: 'Работа в оффлайн режиме. Данные могут быть устаревшими.',
    SYNC_FAILED: 'Не удалось синхронизировать данные. Повторите попытку позже.',
  },
};

// Экспорт конфигурации
export default API_CONFIG;
