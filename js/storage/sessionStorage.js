/**
 * Сервис для работы с SessionStorage
 * Реализует хранение временных данных бронирования
 */
class SessionStorageService {
  /**
   * Сохраняет данные в SessionStorage
   * @param {string} key - Ключ
   * @param {any} data - Данные для сохранения
   * @returns {boolean} Успешность сохранения
   */
  static setItem(key, data) {
    try {
      const serializedData = JSON.stringify(data);
      sessionStorage.setItem(key, serializedData);
      console.log(`Данные сохранены в SessionStorage по ключу: ${key}`);
      return true;
    } catch (error) {
      console.error(`Ошибка сохранения в SessionStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Получает данные из SessionStorage
   * @param {string} key - Ключ
   * @returns {any|null} Данные или null если не найдены
   */
  static getItem(key) {
    try {
      const serializedData = sessionStorage.getItem(key);
      if (serializedData === null) {
        return null;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error(`Ошибка чтения из SessionStorage (${key}):`, error);
      return null;
    }
  }

  /**
   * Удаляет данные из SessionStorage
   * @param {string} key - Ключ
   * @returns {boolean} Успешность удаления
   */
  static removeItem(key) {
    try {
      sessionStorage.removeItem(key);
      console.log(`Данные удалены из SessionStorage по ключу: ${key}`);
      return true;
    } catch (error) {
      console.error(`Ошибка удаления из SessionStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Очищает все данные SessionStorage
   * @returns {boolean} Успешность очистки
   */
  static clear() {
    try {
      sessionStorage.clear();
      console.log('SessionStorage очищен');
      return true;
    } catch (error) {
      console.error('Ошибка очистки SessionStorage:', error);
      return false;
    }
  }

  // Специфические методы для бронирования

  /**
   * Сохраняет черновик бронирования
   * @param {Object} bookingDraft - Черновик бронирования
   * @returns {boolean} Успешность сохранения
   */
  static saveBookingDraft(bookingDraft) {
    return this.setItem('gourmetresto_booking_draft', bookingDraft);
  }

  /**
   * Получает черновик бронирования
   * @returns {Object|null} Черновик бронирования
   */
  static getBookingDraft() {
    return this.getItem('gourmetresto_booking_draft');
  }

  /**
   * Удаляет черновик бронирования
   * @returns {boolean} Успешность удаления
   */
  static removeBookingDraft() {
    return this.removeItem('gourmetresto_booking_draft');
  }

  /**
   * Сохраняет временные данные формы
   * @param {Object} formData - Данные формы
   * @returns {boolean} Успешность сохранения
   */
  static saveFormData(formData) {
    return this.setItem('gourmetresto_form_data', formData);
  }

  /**
   * Получает временные данные формы
   * @returns {Object|null} Данные формы
   */
  static getFormData() {
    return this.getItem('gourmetresto_form_data');
  }

  /**
   * Сохраняет состояние фильтров меню
   * @param {Object} filters - Состояние фильтров
   * @returns {boolean} Успешность сохранения
   */
  static saveMenuFilters(filters) {
    return this.setItem('gourmetresto_menu_filters', filters);
  }

  /**
   * Получает состояние фильтров меню
   * @returns {Object|null} Состояние фильтров
   */
  static getMenuFilters() {
    return this.getItem('gourmetresto_menu_filters');
  }

  /**
   * Проверяет доступность SessionStorage
   * @returns {boolean} Доступность SessionStorage
   */
  static isAvailable() {
    try {
      const testKey = '__sessionStorage_test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn('SessionStorage недоступен:', error);
      return false;
    }
  }
}

// Экспорт сервиса
export default SessionStorageService;
