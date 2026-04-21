import API_CONFIG from './config.js';

/**
 * Сервис для работы с API GourmetResto
 * Реализует асинхронные запросы с обработкой ошибок
 */
class ApiService {
  /**
   * Выполняет GET запрос к API
   * @param {string} endpoint - Эндпоинт API
   * @param {Object} options - Дополнительные опции запроса
   * @returns {Promise<Object>} Ответ от API
   */
  static async get(endpoint, options = {}) {
    try {
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;
      const config = {
        method: API_CONFIG.REQUEST_CONFIG.METHOD,
        headers: API_CONFIG.REQUEST_CONFIG.HEADERS,
        ...options,
      };

      console.log(`Отправка запроса к: ${url}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ошибка: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Получены данные от ${endpoint}:`, data);

      return data;
    } catch (error) {
      console.error(`Ошибка при запросе к ${endpoint}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Получает меню ресторана
   * @returns {Promise<Array>} Массив блюд меню
   */
  static async getMenu() {
    try {
      const data = await this.get(API_CONFIG.ENDPOINTS.MENU);
      return data.menu || [];
    } catch (error) {
      console.error('Ошибка получения меню:', error);
      throw error;
    }
  }

  /**
   * Получает бронирования
   * @returns {Promise<Array>} Массив бронирований
   */
  static async getBookings() {
    try {
      const data = await this.get(API_CONFIG.ENDPOINTS.BOOKINGS);
      return data.bookings || [];
    } catch (error) {
      console.error('Ошибка получения бронирований:', error);
      throw error;
    }
  }

  /**
   * Симулирует создание бронирования
   * @param {Object} bookingData - Данные бронирования
   * @returns {Promise<Object>} Созданное бронирование
   */
  static async createBooking(bookingData) {
    try {
      // Симуляция задержки API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Создаем новое бронирование
      const newBooking = {
        id: Date.now(), // Простая генерация ID
        ...bookingData,
        status: 'pending',
        timestamp: new Date().toISOString(),
      };

      console.log('Создано новое бронирование:', newBooking);
      return newBooking;
    } catch (error) {
      console.error('Ошибка создания бронирования:', error);
      throw error;
    }
  }

  /**
   * Обрабатывает ошибки запросов
   * @param {Error} error - Ошибка
   * @returns {Error} Обработанная ошибка
   */
  static handleError(error) {
    if (error.name === 'AbortError') {
      return new Error(API_CONFIG.ERROR_MESSAGES.TIMEOUT_ERROR);
    }

    if (!navigator.onLine) {
      return new Error(API_CONFIG.ERROR_MESSAGES.NETWORK_ERROR);
    }

    if (error.message.includes('HTTP ошибка')) {
      return error;
    }

    if (error.message.includes('JSON')) {
      return new Error(API_CONFIG.ERROR_MESSAGES.PARSE_ERROR);
    }

    return new Error(error.message || 'Неизвестная ошибка API');
  }

  /**
   * Проверяет доступность API
   * @returns {Promise<boolean>} Доступность API
   */
  static async isApiAvailable() {
    try {
      await this.get(API_CONFIG.ENDPOINTS.MENU);
      return true;
    } catch (error) {
      console.warn('API недоступен:', error.message);
      return false;
    }
  }
}

// Экспорт сервиса
export default ApiService;
