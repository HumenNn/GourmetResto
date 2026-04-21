// Импорт сервисов (fallback для совместимости)
let ApiService = null;
let LocalStorageService = null;
let SessionStorageService = null;
let DataParser = null;

// Асинхронная инициализация сервисов
async function initializeServices() {
  try {
    // Пытаемся загрузить сервисы
    if (typeof import !== 'undefined') {
      const apiModule = await import('./api/apiService.js');
      const storageModule = await import('./storage/localStorage.js');
      const sessionModule = await import('./storage/sessionStorage.js');
      const parserModule = await import('./utils/dataParser.js');

      ApiService = apiModule.default;
      LocalStorageService = storageModule.default;
      SessionStorageService = sessionModule.default;
      DataParser = parserModule.default;
    }

    console.log('Сервисы API успешно инициализированы');
  } catch (error) {
    console.error('Ошибка инициализации сервисов, работаем в режиме совместимости:', error);
    // Fallback: создаем простые заглушки
    createFallbackServices();
  }
}

// Создание fallback сервисов для совместимости
function createFallbackServices() {
  ApiService = {
    async getMenu() {
      // Заглушка для тестирования
      console.log('Используется fallback API');
      return [
        { id: 1, name: 'Test dish', category: 'starters', price: 100 },
        { id: 2, name: 'Test main', category: 'mains', price: 200 }
      ];
    }
  };

  LocalStorageService = {
    getMenuCache() { return null; },
    saveMenuCache() { }
  };

  SessionStorageService = {
    saveMenuFilters() { },
    getMenuFilters() { return null; }
  };

  DataParser = {
    parseMenuData(data) { return data; },
    groupMenuByCategory(data) {
      const groups = {};
      data.forEach(item => {
        if (!groups[item.category]) groups[item.category] = [];
        groups[item.category].push(item);
      });
      return groups;
    }
  };
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, starting initialization...');

  // Инициализация сервисов
  await initializeServices();

  // Инициализация общих компонентов
  initializeBurgerMenu();
  initializeTestimonialsSlider();

  // Инициализация компонентов в зависимости от страницы
  const currentPage = window.location.pathname;
  console.log('Current page:', currentPage);

  if (currentPage.includes('menu.html')) {
    console.log('Initializing menu page...');
    initializeMenuFilter();
    // Загружаем данные меню
    loadMenuDataSimple();
  } else if (currentPage.includes('booking.html')) {
    console.log('Initializing booking page...');
    initializeBookingForm();
  }
});

/* Бургер-меню */
function initializeBurgerMenu() {
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('header__burger--active');
      nav.classList.toggle('header__nav--active');
      burger.setAttribute('aria-expanded', nav.classList.contains('header__nav--active'));
    });

    nav.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        burger.classList.remove('header__burger--active');
        nav.classList.remove('header__nav--active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* Глобальные переменные для данных меню */
let currentMenuData = [];
let currentMenuFilter = 'all';

/* Фильтрация меню */
function initializeMenuFilter() {
  const filterButtons = document.querySelectorAll('.menu__filter-btn');

  console.log('Initializing menu filter, found buttons:', filterButtons.length);

  if (filterButtons.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        console.log('Filter button clicked:', button.getAttribute('data-category'));

        filterButtons.forEach((btn) => {
          btn.classList.remove('menu__filter-btn--active', 'active');
        });
        button.classList.add('menu__filter-btn--active', 'active');

        const category = button.getAttribute('data-category');
        currentMenuFilter = category;

        // Сохраняем состояние фильтров в SessionStorage
        if (SessionStorageService) {
          SessionStorageService.saveMenuFilters({ category: currentMenuFilter });
        }

        applyMenuFilter(category);
      });
    });
    console.log('Menu filter initialized successfully');
  } else {
    console.error('No filter buttons found!');
  }
}

/* Применение фильтра к меню */
function applyMenuFilter(category) {
  // Получаем актуальные элементы меню из DOM
  const menuCategories = document.querySelectorAll('.menu-category');

  console.log('Applying filter:', category, 'Found categories:', menuCategories.length);

  menuCategories.forEach((categoryEl) => {
    const itemCategory = categoryEl.getAttribute('data-category');
    console.log('Category element:', itemCategory, 'should show:', category === 'all' || itemCategory === category);

    if (category === 'all' || itemCategory === category) {
      categoryEl.classList.remove('hidden');
    } else {
      categoryEl.classList.add('hidden');
    }
  });
}

/* Валидация формы бронирования */
function validateField(field) {
  if (!field) return true;

  const fieldName = field.name;
  const errorElement = document.getElementById(`${fieldName}-error`);
  let isValid = true;
  let errorMessage = '';

  field.classList.remove('error', 'success');

  const isRequired = field.hasAttribute('required');
  const value = field.value.trim();

  if (isRequired && !value) {
    isValid = false;
    errorMessage = 'Это поле обязательно для заполнения';
  } else {
    switch (fieldName) {
      case 'name':
        if (value && value.length < 2) {
          isValid = false;
          errorMessage = 'Имя должно содержать минимум 2 символа';
        } else if (value && !/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value)) {
          isValid = false;
          errorMessage = 'Имя должно содержать только буквы';
        }
        break;

      case 'phone':
        if (value) {
          const phoneDigits = value.replace(/\D/g, '');
          if (phoneDigits.length !== 12 || !phoneDigits.startsWith('375')) {
            isValid = false;
            errorMessage = 'Введите корректный номер телефона';
          }
        }
        break;

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          isValid = false;
          errorMessage = 'Введите корректный email адрес';
        }
        break;

      case 'date':
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            isValid = false;
            errorMessage = 'Выберите дату не раньше сегодняшней';
          }
        }
        break;

      case 'time':
        if (value) {
          const [hours, minutes] = value.split(':').map(Number);
          const timeValue = hours * 60 + minutes;
          if (timeValue < 10 * 60 || timeValue > 23 * 60) {
            isValid = false;
            errorMessage = 'Выберите время с 10:00 до 23:00';
          }
        }
        break;

      case 'agreement':
        if (!field.checked) {
          isValid = false;
          errorMessage = 'Необходимо согласие на обработку данных';
        }
        break;
    }
  }

  if (!isValid) {
    field.classList.add('error');
    if (errorElement) errorElement.textContent = errorMessage;
  } else if (value || (fieldName === 'agreement' && field.checked)) {
    field.classList.add('success');
    if (errorElement) errorElement.textContent = '';
  }

  return isValid;
}

function initializeBookingForm() {
  console.log('Initializing booking form...');
  const bookingForm = document.getElementById('bookingForm');

  if (bookingForm) {
    console.log('Booking form found, setting up validation...');
    const dateInput = document.getElementById('date');
    if (dateInput) {
      dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    }

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.startsWith('375')) value = value.substring(3);
        if (value.length > 9) value = value.substring(0, 9);

        let formattedValue = '+375';
        if (value.length > 0) formattedValue += ' ' + value.substring(0, 2);
        if (value.length >= 3) formattedValue += ' ' + value.substring(2, 5);
        if (value.length >= 6) formattedValue += ' ' + value.substring(5, 7);
        if (value.length >= 8) formattedValue += ' ' + value.substring(7, 9);

        e.target.value = formattedValue;
      });
    }

    // Восстанавливаем сохраненные данные формы
    restoreFormData(bookingForm);

    const formInputs = bookingForm.querySelectorAll('.form-input');
    formInputs.forEach((input) => {
      input.addEventListener('blur', () => validateField(input));
      // Автосохранение данных формы
      input.addEventListener('input', () => saveFormDataDebounced(bookingForm));
    });

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;
      const fields = ['name', 'phone', 'email', 'date', 'time', 'guests', 'agreement'];

      fields.forEach((fieldName) => {
        const field = bookingForm.querySelector(`[name="${fieldName}"]`);
        if (field && !validateField(field)) isValid = false;
      });

      if (isValid) {
        await handleBookingSubmission(bookingForm);
      }
    });
  }
}

/* Восстановление данных формы */
function restoreFormData(form) {
  if (!SessionStorageService) return;

  const savedData = SessionStorageService.getFormData();
  if (savedData) {
    Object.keys(savedData).forEach((key) => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input && input.type !== 'checkbox') {
        input.value = savedData[key];
      } else if (input && input.type === 'checkbox') {
        input.checked = savedData[key];
      }
    });
    console.log('Данные формы восстановлены');
  }
}

/* Debounced сохранение данных формы */
let saveFormTimeout;
function saveFormDataDebounced(form) {
  clearTimeout(saveFormTimeout);
  saveFormTimeout = setTimeout(() => {
    if (SessionStorageService) {
      const formData = new FormData(form);
      const data = {};
      for (let [key, value] of formData.entries()) {
        if (key === 'agreement') {
          data[key] = form.querySelector(`[name="${key}"]`).checked;
        } else {
          data[key] = value;
        }
      }
      SessionStorageService.saveFormData(data);
    }
  }, 1000); // Сохраняем через 1 секунду после последнего ввода
}

/* Обработка отправки бронирования */
async function handleBookingSubmission(form) {
  const formData = new FormData(form);
  const bookingData = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    date: formData.get('date'),
    time: formData.get('time'),
    guests: parseInt(formData.get('guests')),
    notes: formData.get('notes') || '',
  };

  // Дополнительная валидация через DataParser
  if (DataParser) {
    const validation = DataParser.validateBookingData(bookingData);
    if (!validation.isValid) {
      console.error('Ошибка валидации:', validation.errors);
      // Показываем первую ошибку
      const firstError = Object.values(validation.errors)[0];
      showBookingError(firstError);
      return;
    }
  }

  try {
    showBookingLoading(true);

    // Пытаемся отправить через API
    let result;
    if (ApiService && navigator.onLine) {
      result = await ApiService.createBooking(bookingData);
      console.log('Бронирование создано через API:', result);

      // Сохраняем время последней синхронизации
      if (LocalStorageService) {
        LocalStorageService.saveLastSyncTime();
      }
    } else {
      // Оффлайн режим - сохраняем локально
      if (LocalStorageService) {
        LocalStorageService.addOfflineBooking(bookingData);
        result = { ...bookingData, offline: true, id: Date.now() };
        console.log('Бронирование сохранено оффлайн:', result);
        showOfflineBookingMessage();
      } else {
        throw new Error('Невозможно сохранить бронирование');
      }
    }

    showBookingSuccess(result);

    // Очищаем форму и сохраненные данные
    form.reset();
    const formInputs = form.querySelectorAll('.form-input');
    formInputs.forEach((input) => input.classList.remove('success'));

    if (SessionStorageService) {
      SessionStorageService.saveFormData({});
    }
  } catch (error) {
    console.error('Ошибка создания бронирования:', error);
    showBookingError(error.message);
  } finally {
    showBookingLoading(false);
  }
}

/* Инициализация оффлайн-бронирования */
async function initializeOfflineBooking() {
  // Синхронизируем оффлайн бронирования при появлении сети
  if (navigator.onLine && LocalStorageService) {
    await syncOfflineBookings();
  }

  // Слушаем изменения состояния сети
  window.addEventListener('online', async () => {
    console.log('Сеть восстановлена, синхронизируем бронирования');
    if (LocalStorageService) {
      await syncOfflineBookings();
    }
  });

  window.addEventListener('offline', () => {
    console.log('Сеть потеряна, переходим в оффлайн режим');
    showOfflineIndicator();
  });
}

/* Синхронизация оффлайн бронирований */
async function syncOfflineBookings() {
  if (!LocalStorageService || !ApiService) return;

  const offlineBookings = LocalStorageService.getOfflineBookings();
  if (offlineBookings.length === 0) return;

  console.log(`Синхронизируем ${offlineBookings.length} оффлайн бронирований`);

  const syncedBookings = [];
  const failedBookings = [];

  for (const booking of offlineBookings) {
    try {
      // Удаляем флаг offline перед отправкой
      const { offline, createdAt, ...apiBooking } = booking;
      const result = await ApiService.createBooking(apiBooking);
      syncedBookings.push(result);
      console.log('Бронирование синхронизировано:', result);
    } catch (error) {
      console.error('Ошибка синхронизации бронирования:', error);
      failedBookings.push(booking);
    }
  }

  // Обновляем список оффлайн бронирований
  if (failedBookings.length > 0) {
    LocalStorageService.saveOfflineBookings(failedBookings);
    showSyncErrorMessage(failedBookings.length);
  } else {
    LocalStorageService.clearOfflineBookings();
    showSyncSuccessMessage(syncedBookings.length);
  }

  // Обновляем время синхронизации
  LocalStorageService.saveLastSyncTime();
}

/* Отображение состояний бронирования */
function showBookingLoading(show) {
  const submitBtn = document.querySelector('#bookingForm button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = show;
    submitBtn.textContent = show ? 'Отправка...' : 'Забронировать стол';
  }
}

function showBookingSuccess(booking) {
  const successMessage = document.getElementById('form-success');
  if (successMessage) {
    const message = booking.offline
      ? 'Бронирование сохранено локально и будет отправлено при восстановлении связи.'
      : 'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.';
    successMessage.textContent = message;
    successMessage.classList.add('show');
  }

  setTimeout(() => {
    if (successMessage) successMessage.classList.remove('show');
  }, 5000);
}

function showBookingError(message) {
  const errorMessage = document.getElementById('form-error') || createErrorElement();
  errorMessage.textContent = message;
  errorMessage.classList.add('show');

  setTimeout(() => {
    errorMessage.classList.remove('show');
  }, 5000);
}

function createErrorElement() {
  const errorDiv = document.createElement('div');
  errorDiv.id = 'form-error';
  errorDiv.className = 'form-message form-message--error';
  const form = document.getElementById('bookingForm');
  if (form) {
    form.appendChild(errorDiv);
  }
  return errorDiv;
}

function showOfflineBookingMessage() {
  const message = document.createElement('div');
  message.className = 'offline-booking-message';
  message.innerHTML = `
    <div class="offline-banner">
      <p>💾 Бронирование сохранено локально. Данные будут синхронизированы при восстановлении связи.</p>
    </div>
  `;

  const form = document.getElementById('bookingForm');
  if (form) {
    form.insertBefore(message, form.firstChild);
    setTimeout(() => {
      if (message.parentNode) message.remove();
    }, 3000);
  }
}

function showOfflineIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'offline-indicator';
  indicator.className = 'offline-indicator';
  indicator.innerHTML = '<p>🔴 Оффлайн режим</p>';

  document.body.insertBefore(indicator, document.body.firstChild);
}

function hideOfflineIndicator() {
  const indicator = document.getElementById('offline-indicator');
  if (indicator) indicator.remove();
}

function showSyncSuccessMessage(count) {
  const message = document.createElement('div');
  message.className = 'sync-success-message';
  message.innerHTML = `
    <div class="sync-banner success">
      <p>✅ Синхронизировано ${count} бронирований</p>
    </div>
  `;

  document.body.insertBefore(message, document.body.firstChild);
  setTimeout(() => {
    if (message.parentNode) message.remove();
  }, 3000);
}

function showSyncErrorMessage(count) {
  const message = document.createElement('div');
  message.className = 'sync-error-message';
  message.innerHTML = `
    <div class="sync-banner error">
      <p>⚠️ Не удалось синхронизировать ${count} бронирований</p>
    </div>
  `;

  document.body.insertBefore(message, document.body.firstChild);
  setTimeout(() => {
    if (message.parentNode) message.remove();
  }, 5000);
}



/* Глобальные переменные для данных меню */
let currentMenuData = [];
let currentMenuFilter = 'all';

/* Загрузка данных для текущей страницы */
async function loadPageData() {
  const currentPage = window.location.pathname;

  if (currentPage.includes('menu.html')) {
    await loadMenuData();
    // Инициализируем фильтр ПОСЛЕ загрузки данных
    initializeMenuFilter();
  } else if (currentPage.includes('booking.html')) {
    initializeBookingForm();
    await initializeOfflineBooking();
  }
}

/* Простая загрузка данных меню для тестирования */
async function loadMenuDataSimple() {
  console.log('Loading menu data...');

  try {
    // Загружаем данные из JSON файла
    const response = await fetch('data/menu.json');
    if (!response.ok) {
      throw new Error('Failed to load menu data');
    }

    const data = await response.json();
    console.log('Menu data loaded:', data);

    // Отображаем данные
    displayMenuDataSimple(data.menu);
  } catch (error) {
    console.error('Error loading menu:', error);
    // Fallback: показываем сообщение об ошибке
    const menuContainer = document.querySelector('.menu');
    if (menuContainer) {
      menuContainer.innerHTML += '<p style="color: red;">Ошибка загрузки меню</p>';
    }
  }
}

/* Упрощенное отображение данных меню */
function displayMenuDataSimple(menuData) {
  if (!Array.isArray(menuData)) {
    console.error('Invalid menu data format');
    return;
  }

  console.log('Displaying menu data...');

  // Группируем по категориям
  const groupedMenu = {};
  menuData.forEach(item => {
    if (!groupedMenu[item.category]) {
      groupedMenu[item.category] = [];
    }
    groupedMenu[item.category].push(item);
  });

  // Очищаем существующие категории
  const menuContainer = document.querySelector('.menu');
  const existingCategories = menuContainer.querySelectorAll('.menu-category');
  existingCategories.forEach(category => category.remove());

  // Создаем категории
  Object.keys(groupedMenu).forEach(category => {
    const categoryElement = document.createElement('article');
    categoryElement.className = 'menu-category';
    categoryElement.setAttribute('data-category', category);

    const categoryTitle = document.createElement('h2');
    categoryTitle.className = 'menu-category__title';
    categoryTitle.textContent = getCategoryDisplayName(category);
    categoryElement.appendChild(categoryTitle);

    const categoryList = document.createElement('div');
    categoryList.className = 'menu-category__list';

    groupedMenu[category].forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.className = 'menu-item';
      menuItem.innerHTML = `
        <figure class="menu-item__figure">
          <img src="${item.image}" alt="${item.name}" class="menu-item__image" />
          <figcaption class="menu-item__caption">${item.name}</figcaption>
        </figure>
        <div class="menu-item__info">
          <h3 class="menu-item__name">${item.name}</h3>
          <p class="menu-item__description">${item.description}</p>
          <div class="menu-item__price">
            <span class="menu-item__price-value">${item.price}</span>
            <span class="menu-item__price-currency">${item.currency}</span>
          </div>
          <p class="menu-item__rating">${item.rating} Rating</p>
        </div>
      `;
      categoryList.appendChild(menuItem);
    });

    categoryElement.appendChild(categoryList);
    menuContainer.appendChild(categoryElement);
  });

  console.log('Menu displayed successfully');
}

/* Асинхронная загрузка данных меню */
async function loadMenuData() {
  const menuContainer = document.querySelector('.menu');
  if (!menuContainer) return;

  try {
    showLoadingState(menuContainer);

    // Сначала пытаемся загрузить из кэша
    let menuData = null;
    if (LocalStorageService) {
      menuData = LocalStorageService.getMenuCache();
      if (menuData) {
        console.log('Загружено меню из кэша');
        displayMenuData(menuData);
        hideLoadingState(menuContainer);

        // Параллельно обновляем кэш в фоне
        updateMenuCacheInBackground();
        return;
      }
    }

    // Если кэша нет, загружаем из API
    if (ApiService) {
      menuData = await ApiService.getMenu();
      displayMenuData(menuData);
      hideLoadingState(menuContainer);

      // Сохраняем в кэш
      if (LocalStorageService) {
        LocalStorageService.saveMenuCache(menuData);
      }
    } else {
      throw new Error('Сервисы API недоступны');
    }
  } catch (error) {
    console.error('Ошибка загрузки меню:', error);
    showErrorState(menuContainer, error.message);
    hideLoadingState(menuContainer);

    // Пытаемся загрузить из кэша при ошибке
    if (LocalStorageService) {
      const cachedData = LocalStorageService.getMenuCache();
      if (cachedData) {
        console.log('Загружено меню из кэша (fallback)');
        displayMenuData(cachedData);
        showOfflineMessage();
      }
    }
  }
}

/* Фоновая синхронизация кэша меню */
async function updateMenuCacheInBackground() {
  try {
    if (ApiService && LocalStorageService) {
      const freshData = await ApiService.getMenu();
      LocalStorageService.saveMenuCache(freshData);
      console.log('Кэш меню обновлен в фоне');
    }
  } catch (error) {
    console.warn('Не удалось обновить кэш в фоне:', error.message);
  }
}

/* Отображение данных меню */
function displayMenuData(menuData) {
  if (!Array.isArray(menuData)) {
    console.error('Некорректный формат данных меню');
    return;
  }

  // Парсим данные
  if (DataParser) {
    currentMenuData = DataParser.parseMenuData(menuData);
  } else {
    currentMenuData = menuData;
  }

  // Группируем по категориям
  const groupedMenu = DataParser ? DataParser.groupMenuByCategory(currentMenuData) : {};

  // Очищаем существующие категории
  const menuContainer = document.querySelector('.menu');
  const existingCategories = menuContainer.querySelectorAll('.menu-category');
  existingCategories.forEach((category) => category.remove());

  // Создаем категории и добавляем блюда
  Object.keys(groupedMenu).forEach((category) => {
    const categoryElement = createMenuCategory(category, groupedMenu[category]);
    menuContainer.appendChild(categoryElement);
  });

  // Восстанавливаем состояние фильтров
  if (SessionStorageService) {
    const savedFilters = SessionStorageService.getMenuFilters();
    if (savedFilters && savedFilters.category) {
      currentMenuFilter = savedFilters.category;
      // Применяем фильтр напрямую
      applyMenuFilter(currentMenuFilter);
      // Обновляем активную кнопку фильтра
      const filterButton = document.querySelector(`[data-category="${currentMenuFilter}"]`);
      if (filterButton) {
        document.querySelectorAll('.menu__filter-btn').forEach((btn) => {
          btn.classList.remove('menu__filter-btn--active', 'active');
        });
        filterButton.classList.add('menu__filter-btn--active', 'active');
      }
    }
  }

  console.log(`Отображено ${currentMenuData.length} блюд меню`);
}

/* Создание элемента категории меню */
function createMenuCategory(category, items) {
  const categoryElement = document.createElement('article');
  categoryElement.className = 'menu-category';
  categoryElement.setAttribute('data-category', category);

  const categoryTitle = document.createElement('h2');
  categoryTitle.className = 'menu-category__title';
  categoryTitle.textContent = getCategoryDisplayName(category);
  categoryElement.appendChild(categoryTitle);

  const categoryList = document.createElement('div');
  categoryList.className = 'menu-category__list';

  items.forEach((item) => {
    const menuItem = createMenuItem(item);
    categoryList.appendChild(menuItem);
  });

  categoryElement.appendChild(categoryList);
  return categoryElement;
}

/* Создание элемента блюда меню */
function createMenuItem(item) {
  const menuItem = document.createElement('div');
  menuItem.className = 'menu-item';
  menuItem.setAttribute('itemscope', '');
  menuItem.setAttribute('itemtype', 'https://schema.org/Product');

  const figure = document.createElement('figure');
  figure.className = 'menu-item__figure';

  const img = document.createElement('img');
  img.src = item.image;
  img.alt = item.name;
  img.className = 'menu-item__image';
  img.setAttribute('itemprop', 'image');

  const figcaption = document.createElement('figcaption');
  figcaption.className = 'menu-item__caption';
  figcaption.textContent = item.name;

  figure.appendChild(img);
  figure.appendChild(figcaption);

  const info = document.createElement('div');
  info.className = 'menu-item__info';

  const name = document.createElement('h3');
  name.className = 'menu-item__name';
  name.setAttribute('itemprop', 'name');
  name.textContent = item.name;

  const description = document.createElement('p');
  description.className = 'menu-item__description';
  description.setAttribute('itemprop', 'description');
  description.textContent = item.description;

  const price = document.createElement('div');
  price.className = 'menu-item__price';
  price.setAttribute('itemprop', 'offers');
  price.setAttribute('itemscope', '');
  price.setAttribute('itemtype', 'https://schema.org/Offer');

  const priceValue = document.createElement('span');
  priceValue.className = 'menu-item__price-value';
  priceValue.setAttribute('itemprop', 'price');
  priceValue.textContent = item.price;

  const priceCurrency = document.createElement('span');
  priceCurrency.className = 'menu-item__price-currency';
  priceCurrency.setAttribute('itemprop', 'priceCurrency');
  priceCurrency.textContent = item.currency;

  price.appendChild(priceValue);
  price.appendChild(priceCurrency);

  const rating = document.createElement('p');
  rating.className = 'menu-item__rating';
  rating.textContent = DataParser ? DataParser.formatRating(item.rating) : `${item.rating} Rating`;

  info.appendChild(name);
  info.appendChild(description);
  info.appendChild(price);
  info.appendChild(rating);

  menuItem.appendChild(figure);
  menuItem.appendChild(info);

  return menuItem;
}

/* Получение отображаемого названия категории */
function getCategoryDisplayName(category) {
  const categoryNames = {
    starters: 'Закуски',
    mains: 'Основные блюда',
    desserts: 'Десерты',
  };
  return categoryNames[category] || category;
}

/* Показ состояния загрузки */
function showLoadingState(container) {
  const loading = document.createElement('div');
  loading.className = 'menu-loading';
  loading.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>Загрузка меню...</p>
    </div>
  `;
  container.appendChild(loading);
}

/* Скрытие состояния загрузки */
function hideLoadingState(container) {
  const loading = container.querySelector('.menu-loading');
  if (loading) {
    loading.remove();
  }
}

/* Показ состояния ошибки */
function showErrorState(container, errorMessage) {
  const error = document.createElement('div');
  error.className = 'menu-error';
  error.innerHTML = `
    <div class="error-message">
      <h3>Ошибка загрузки меню</h3>
      <p>${errorMessage}</p>
      <button class="retry-btn" onclick="location.reload()">Повторить</button>
    </div>
  `;
  container.appendChild(error);
}

/* Показ сообщения об оффлайн режиме */
function showOfflineMessage() {
  const message = document.createElement('div');
  message.className = 'offline-message';
  message.innerHTML = `
    <div class="offline-banner">
      <p>⚠️ Работа в оффлайн режиме. Данные могут быть устаревшими.</p>
    </div>
  `;

  const menuContainer = document.querySelector('.menu');
  menuContainer.insertBefore(message, menuContainer.firstChild);

  // Автоматически скрываем через 5 секунд
  setTimeout(() => {
    if (message.parentNode) {
      message.remove();
    }
  }, 5000);
}

/* Слайдер отзывов */
function initializeTestimonialsSlider() {
  console.log('Initializing testimonials slider...');
  const testimonialsSlider = document.querySelector('.testimonials__slider');

  if (testimonialsSlider) {
    console.log('Testimonials slider found, setting up...');
    const slides = document.querySelectorAll('.testimonials__slide');
    const dots = document.querySelectorAll('.testimonials__dot');
    const prevBtn = document.querySelector('.testimonials__nav-btn--prev');
    const nextBtn = document.querySelector('.testimonials__nav-btn--next');

    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
      slides.forEach((slide) => slide.classList.remove('testimonials__slide--active'));
      dots.forEach((dot) => dot.classList.remove('testimonials__dot--active'));
      slides[index].classList.add('testimonials__slide--active');
      dots[index].classList.add('testimonials__dot--active');
      currentSlide = index;
    }

    function nextSlide() {
      showSlide((currentSlide + 1) % totalSlides);
    }

    function prevSlide() {
      showSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => showSlide(index));
    });

    let autoSlideInterval = setInterval(nextSlide, 5000);

    testimonialsSlider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    testimonialsSlider.addEventListener('mouseleave', () => {
      autoSlideInterval = setInterval(nextSlide, 5000);
    });
  }
}
