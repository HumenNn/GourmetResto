/**
 * Утилиты для обработки и парсинга данных
 */
class DataParser {
  /**
   * Парсит данные меню из API формата
   * @param {Array} menuData - Необработанные данные меню
   * @returns {Array} Обработанные данные меню
   */
  static parseMenuData(menuData) {
    if (!Array.isArray(menuData)) {
      console.warn('Некорректный формат данных меню');
      return [];
    }

    return menuData.map((item) => ({
      id: item.id,
      name: item.name || 'Без названия',
      description: item.description || 'Описание отсутствует',
      price: Number(item.price) || 0,
      currency: item.currency || 'руб.',
      rating: Number(item.rating) || 0,
      category: item.category || 'other',
      image: item.image || 'images/food.jpg',
      available: Boolean(item.available !== false), // По умолчанию true
      tags: Array.isArray(item.tags) ? item.tags : [],
    }));
  }

  /**
   * Парсит данные бронирований
   * @param {Array} bookingsData - Необработанные данные бронирований
   * @returns {Array} Обработанные данные бронирований
   */
  static parseBookingsData(bookingsData) {
    if (!Array.isArray(bookingsData)) {
      console.warn('Некорректный формат данных бронирований');
      return [];
    }

    return bookingsData.map((booking) => ({
      id: booking.id,
      name: booking.name || 'Не указано',
      phone: booking.phone || '',
      email: booking.email || '',
      date: booking.date || '',
      time: booking.time || '',
      guests: Number(booking.guests) || 1,
      status: booking.status || 'pending',
      timestamp: booking.timestamp || new Date().toISOString(),
      notes: booking.notes || '',
    }));
  }

  /**
   * Фильтрует меню по категории
   * @param {Array} menu - Данные меню
   * @param {string} category - Категория для фильтрации ('all' для всех)
   * @returns {Array} Отфильтрованные данные меню
   */
  static filterMenuByCategory(menu, category) {
    if (category === 'all' || !category) {
      return menu;
    }

    return menu.filter((item) => item.category === category);
  }

  /**
   * Сортирует меню по цене
   * @param {Array} menu - Данные меню
   * @param {string} sortBy - Критерий сортировки ('price-asc', 'price-desc', 'rating-desc')
   * @returns {Array} Отсортированные данные меню
   */
  static sortMenu(menu, sortBy = 'price-asc') {
    const sortedMenu = [...menu];

    switch (sortBy) {
      case 'price-asc':
        return sortedMenu.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sortedMenu.sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return sortedMenu.sort((a, b) => b.rating - a.rating);
      case 'name':
        return sortedMenu.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sortedMenu;
    }
  }

  /**
   * Ищет блюда по названию или описанию
   * @param {Array} menu - Данные меню
   * @param {string} query - Поисковый запрос
   * @returns {Array} Найденные блюда
   */
  static searchMenu(menu, query) {
    if (!query || query.trim() === '') {
      return menu;
    }

    const searchTerm = query.toLowerCase().trim();

    return menu.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Группирует меню по категориям
   * @param {Array} menu - Данные меню
   * @returns {Object} Меню сгруппированное по категориям
   */
  static groupMenuByCategory(menu) {
    return menu.reduce((groups, item) => {
      const category = item.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {});
  }

  /**
   * Валидирует данные бронирования
   * @param {Object} bookingData - Данные бронирования
   * @returns {Object} Результат валидации {isValid: boolean, errors: Object}
   */
  static validateBookingData(bookingData) {
    const errors = {};

    // Валидация имени
    if (!bookingData.name || bookingData.name.trim().length < 2) {
      errors.name = 'Имя должно содержать минимум 2 символа';
    }

    // Валидация телефона
    const phoneRegex = /^\+375\s\d{2}\s\d{3}-\d{2}-\d{2}$/;
    if (!bookingData.phone || !phoneRegex.test(bookingData.phone)) {
      errors.phone = 'Введите корректный номер телефона';
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!bookingData.email || !emailRegex.test(bookingData.email)) {
      errors.email = 'Введите корректный email';
    }

    // Валидация даты
    if (!bookingData.date) {
      errors.date = 'Выберите дату';
    } else {
      const selectedDate = new Date(bookingData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.date = 'Дата не может быть в прошлом';
      }
    }

    // Валидация времени
    if (!bookingData.time) {
      errors.time = 'Выберите время';
    } else {
      const [hours, minutes] = bookingData.time.split(':').map(Number);
      const timeValue = hours * 60 + minutes;
      if (timeValue < 10 * 60 || timeValue > 23 * 60) {
        errors.time = 'Время должно быть с 10:00 до 23:00';
      }
    }

    // Валидация количества гостей
    const guests = Number(bookingData.guests);
    if (!guests || guests < 1 || guests > 20) {
      errors.guests = 'Количество гостей должно быть от 1 до 20';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Форматирует цену для отображения
   * @param {number} price - Цена
   * @param {string} currency - Валюта
   * @returns {string} Форматированная цена
   */
  static formatPrice(price, currency = 'руб.') {
    return `${price} ${currency}`;
  }

  /**
   * Форматирует рейтинг для отображения
   * @param {number} rating - Рейтинг
   * @returns {string} Форматированный рейтинг
   */
  static formatRating(rating) {
    return `${rating.toFixed(1)} Rating`;
  }

  /**
   * Форматирует дату для отображения
   * @param {string} dateString - Дата в формате YYYY-MM-DD
   * @returns {string} Форматированная дата
   */
  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Форматирует время для отображения
   * @param {string} timeString - Время в формате HH:MM
   * @returns {string} Форматированное время
   */
  static formatTime(timeString) {
    return timeString;
  }
}

// Экспорт утилит
export default DataParser;
