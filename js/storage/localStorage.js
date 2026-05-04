import API_CONFIG from '../api/config.js';

class LocalStorageService {

  static setItem(key, data) {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      console.log(`Данные сохранены в LocalStorage по ключу: ${key}`);
      return true;
    } catch (error) {
      console.error(`Ошибка сохранения в LocalStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Получает данные из LocalStorage
   * @param {string} key - Ключ
   * @returns {any|null} Данные или null если не найдены
   */
  static getItem(key) {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return null;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error(`Ошибка чтения из LocalStorage (${key}):`, error);
      return null;
    }
  }

  /**
   * Удаляет данные из LocalStorage
   * @param {string} key - Ключ
   * @returns {boolean} Успешность удаления
   */
  static removeItem(key) {
    try {
      localStorage.removeItem(key);
      console.log(`Данные удалены из LocalStorage по ключу: ${key}`);
      return true;
    } catch (error) {
      console.error(`Ошибка удаления из LocalStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Очищает все данные LocalStorage для приложения
   * @returns {boolean} Успешность очистки
   */
  static clear() {
    try {
      localStorage.clear();
      console.log('LocalStorage очищен');
      return true;
    } catch (error) {
      console.error('Ошибка очистки LocalStorage:', error);
      return false;
    }
  }

  /**
   * Сохраняет меню в кэш с временной меткой
   * @param {Array} menu - Данные меню
   * @returns {boolean} Успешность сохранения
   */
  static saveMenuCache(menu) {
    const cacheData = {
      data: menu,
      timestamp: Date.now(),
    };
    return this.setItem(API_CONFIG.STORAGE_KEYS.MENU_CACHE, cacheData);
  }

  /**
   * Получает меню из кэша
   * @returns {Array|null} Данные меню или null если кэш устарел/пустой
   */
  static getMenuCache() {
    const cacheData = this.getItem(API_CONFIG.STORAGE_KEYS.MENU_CACHE);

    if (!cacheData) {
      console.log('Кэш меню пустой');
      return null;
    }

    const now = Date.now();
    const cacheAge = now - cacheData.timestamp;

    if (cacheAge > API_CONFIG.CACHE_CONFIG.MENU_TTL) {
      console.log('Кэш меню устарел, удаляем');
      this.removeItem(API_CONFIG.STORAGE_KEYS.MENU_CACHE);
      return null;
    }

    console.log('Получены данные меню из кэша');
    return cacheData.data;
  }

  /**
   * Сохраняет оффлайн бронирования
   * @param {Array} bookings - Массив бронирований
   * @returns {boolean} Успешность сохранения
   */
  static saveOfflineBookings(bookings) {
    return this.setItem(API_CONFIG.STORAGE_KEYS.BOOKINGS_OFFLINE, bookings);
  }

  /**
   * Получает оффлайн бронирования
   * @returns {Array} Массив бронирований
   */
  static getOfflineBookings() {
    return this.getItem(API_CONFIG.STORAGE_KEYS.BOOKINGS_OFFLINE) || [];
  }

  /**
   * Добавляет бронирование в оффлайн очередь
   * @param {Object} booking - Данные бронирования
   * @returns {boolean} Успешность добавления
   */
  static addOfflineBooking(booking) {
    const bookings = this.getOfflineBookings();
    bookings.push({
      ...booking,
      offline: true,
      createdAt: Date.now(),
    });
    return this.saveOfflineBookings(bookings);
  }

  /**
   * Очищает оффлайн бронирования после синхронизации
   * @returns {boolean} Успешность очистки
   */
  static clearOfflineBookings() {
    return this.removeItem(API_CONFIG.STORAGE_KEYS.BOOKINGS_OFFLINE);
  }

  /**
   * Сохраняет время последней синхронизации
   * @param {number} timestamp - Время синхронизации
   * @returns {boolean} Успешность сохранения
   */
  static saveLastSyncTime(timestamp = Date.now()) {
    return this.setItem(API_CONFIG.STORAGE_KEYS.LAST_SYNC, timestamp);
  }

  /**
   * Получает время последней синхронизации
   * @returns {number|null} Время синхронизации или null
   */
  static getLastSyncTime() {
    return this.getItem(API_CONFIG.STORAGE_KEYS.LAST_SYNC);
  }

  /**
   * Проверяет доступность LocalStorage
   * @returns {boolean} Доступность LocalStorage
   */
  static isAvailable() {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn('LocalStorage недоступен:', error);
      return false;
    }
  }
}

// Экспорт сервиса
export default LocalStorageService;
