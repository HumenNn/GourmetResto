/* =====================================================
   GourmetResto - Основной JavaScript файл
   ===================================================== */

// =====================================================
// API КОНФИГУРАЦИЯ
// =====================================================
const API_CONFIG = {
  BASE_URL: 'data/',
  MENU_ENDPOINT: 'menu.json',
  BOOKINGS_ENDPOINT: 'bookings.json',
  CACHE_KEY: 'gourmetresto_menu_cache',
  CACHE_TIMESTAMP: 'gourmetresto_menu_timestamp',
  OFFLINE_BOOKINGS: 'gourmetresto_offline_bookings',
  CACHE_DURATION: 24 * 60 * 60 * 1000,
};

// =====================================================
// API ФУНКЦИИ
// =====================================================
async function fetchMenuFromAPI() {
  const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.MENU_ENDPOINT);
  if (!response.ok) throw new Error('HTTP error: ' + response.status);
  const data = await response.json();
  return data.menu || [];
}

async function loadMenuWithCache() {
  const cached = localStorage.getItem(API_CONFIG.CACHE_KEY);
  const timestamp = localStorage.getItem(API_CONFIG.CACHE_TIMESTAMP);
  const now = Date.now();

  if (cached && timestamp && now - parseInt(timestamp) < API_CONFIG.CACHE_DURATION) {
    return JSON.parse(cached);
  }

  try {
    const menu = await fetchMenuFromAPI();
    localStorage.setItem(API_CONFIG.CACHE_KEY, JSON.stringify(menu));
    localStorage.setItem(API_CONFIG.CACHE_TIMESTAMP, now.toString());
    return menu;
  } catch (e) {
    if (cached) return JSON.parse(cached);
    throw e;
  }
}

function saveOfflineBooking(booking) {
  const bookings = getOfflineBookings();
  bookings.push({ ...booking, offline: true, createdAt: Date.now() });
  localStorage.setItem(API_CONFIG.OFFLINE_BOOKINGS, JSON.stringify(bookings));
}

function getOfflineBookings() {
  const data = localStorage.getItem(API_CONFIG.OFFLINE_BOOKINGS);
  return data ? JSON.parse(data) : [];
}

function clearOfflineBookings() {
  localStorage.removeItem(API_CONFIG.OFFLINE_BOOKINGS);
}

function showLoadingState() {
  const menu = document.querySelector('.menu');
  if (!menu) return;
  const loader = document.createElement('div');
  loader.id = 'menu-loader';
  loader.innerHTML = '<p>Загрузка меню...</p>';
  menu.insertBefore(loader, menu.firstChild);
}

function hideLoadingState() {
  const loader = document.getElementById('menu-loader');
  if (loader) loader.remove();
}

function showErrorState(msg) {
  const menu = document.querySelector('.menu');
  if (!menu) return;
  const error = document.createElement('div');
  error.innerHTML = `<p style="color:red">Ошибка: ${msg}</p>`;
  menu.insertBefore(error, menu.firstChild);
  setTimeout(() => error.remove(), 5000);
}

// =====================================================
// ВАЛИДАЦИЯ ФОРМЫ
// =====================================================
function validateField(field) {
  if (!field) {
    console.error('validateField called with null/undefined field');
    return true;
  }

  const fieldName = field.name;
  const errorElement = document.getElementById(fieldName + '-error');
  let isValid = true;
  let errorMessage = '';

  console.log(`=== VALIDATING FIELD: ${fieldName} ===`);
  console.log('Field value:', field.value);
  console.log('Field required:', field.hasAttribute('required'));

  field.classList.remove('error', 'success');

  const isRequired = field.hasAttribute('required');
  const value = field.value.trim();

  if (isRequired && !value) {
    isValid = false;
    errorMessage = 'Это поле обязательно';
    console.error(`ERROR: Field "${fieldName}" is required but empty`);
  } else {
    switch (fieldName) {
      case 'name':
        console.log('Validating name:', value);
        if (value && value.length < 2) {
          isValid = false;
          errorMessage = 'Минимум 2 символа';
          console.error(`ERROR: Name too short: ${value.length} chars`);
        } else if (value && !/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value)) {
          isValid = false;
          errorMessage = 'Имя должно содержать только буквы';
          console.error(`ERROR: Name contains invalid characters`);
        }
        break;
      case 'phone':
        console.log('Validating phone:', value);
        if (value) {
          const digits = value.replace(/\D/g, '');
          console.log('Phone digits:', digits, 'Length:', digits.length);
          if (digits.length !== 12 || !digits.startsWith('375')) {
            isValid = false;
            errorMessage = 'Введите корректный номер';
            console.error(`ERROR: Invalid phone: ${digits}`);
          }
        }
        break;
      case 'email':
        console.log('Validating email:', value);
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          isValid = false;
          errorMessage = 'Введите корректный email';
          console.error(`ERROR: Invalid email: ${value}`);
        }
        break;
      case 'date':
        console.log('Validating date:', value);
        if (value && new Date(value) < new Date().setHours(0,0,0,0)) {
          isValid = false;
          errorMessage = 'Дата не раньше сегодня';
          console.error(`ERROR: Date is in the past: ${value}`);
        }
        break;
      case 'time':
        console.log('Validating time:', value);
        if (value) {
          const [h, m] = value.split(':').map(Number);
          console.log('Time hours:', h, 'minutes:', m);
          if (h * 60 + m < 600 || h * 60 + m > 1380) {
            isValid = false;
            errorMessage = 'Время с 10:00 до 23:00';
            console.error(`ERROR: Time out of range: ${h}:${m}`);
          }
        }
        break;
      case 'agreement':
        console.log('Validating agreement:', field.checked);
        if (!field.checked) {
          isValid = false;
          errorMessage = 'Необходимо согласие';
          console.error(`ERROR: Agreement not checked`);
        }
        break;
    }
  }

  if (!isValid) {
    field.classList.add('error');
    if (errorElement) errorElement.textContent = errorMessage;
    console.error(`❌ VALIDATION FAILED for "${fieldName}": ${errorMessage}`);
  } else {
    field.classList.add('success');
    if (errorElement) errorElement.textContent = '';
    console.log(`✓ VALIDATION PASSED for "${fieldName}"`);
  }

  console.log(`=== END VALIDATION: ${fieldName}, isValid: ${isValid} ===\n`);
  return isValid;
}
        break;
      case 'phone':
        if (value) {
          const digits = value.replace(/\D/g, '');
          if (digits.length !== 12 || !digits.startsWith('375')) {
            isValid = false;
            errorMessage = 'Введите корректный номер';
          }
        }
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          isValid = false;
          errorMessage = 'Введите корректный email';
        }
        break;
      case 'date':
        if (value && new Date(value) < new Date().setHours(0, 0, 0, 0)) {
          isValid = false;
          errorMessage = 'Дата не раньше сегодня';
        }
        break;
      case 'time':
        if (value) {
          const [h, m] = value.split(':').map(Number);
          if (h * 60 + m < 600 || h * 60 + m > 1380) {
            isValid = false;
            errorMessage = 'Время с 10:00 до 23:00';
          }
        }
        break;
      case 'agreement':
        if (!field.checked) {
          isValid = false;
          errorMessage = 'Необходимо согласие';
        }
        break;
    }
  }

  if (!isValid) {
    field.classList.add('error');
    if (errorElement) errorElement.textContent = errorMessage;
    // ВЫВОД ОШИБКИ В КОНСОЛЬ БРАУЗЕРА
    console.error(`Ошибка валидации поля "${fieldName}": ${errorMessage}`);
    console.error('Поле:', field);
  } else if (value || (fieldName === 'agreement' && field.checked)) {
    field.classList.add('success');
    if (errorElement) errorElement.textContent = '';
    console.log(`Поле "${fieldName}" успешно проверено`);
  }

  return isValid;
}

// =====================================================
// ОСНОВНОЙ КОД - выполняется после загрузки DOM
// =====================================================
document.addEventListener('DOMContentLoaded', function () {
  // БУРГЕР-МЕНЮ
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('header__burger--active');
      nav.classList.toggle('header__nav--active');
    });
  }

  // ФИЛЬТР МЕНЮ
  const filterButtons = document.querySelectorAll('.menu__filter-btn');
  const menuCategories = document.querySelectorAll('.menu-category');

  if (filterButtons.length > 0) {
    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        filterButtons.forEach(function (btn) {
          btn.classList.remove('menu__filter-btn--active', 'active');
        });
        button.classList.add('menu__filter-btn--active', 'active');

        const category = button.getAttribute('data-category');
        menuCategories.forEach(function (categoryEl) {
          const itemCategory = categoryEl.getAttribute('data-category');
          if (category === 'all' || itemCategory === category) {
            categoryEl.classList.remove('hidden');
          } else {
            categoryEl.classList.add('hidden');
          }
        });
      });
    });
  }

  // ВАЛИДАЦИЯ ФОРМЫ БРОНИРОВАНИЯ
  const bookingForm = document.getElementById('bookingForm');
  console.log('Booking form found:', !!bookingForm);

  if (bookingForm) {
    console.log('Setting up booking form validation...');

    const dateInput = document.getElementById('date');
    if (dateInput) {
      dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
      console.log('Date input initialized');
    }

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function (e) {
        let val = e.target.value.replace(/\D/g, '');
        if (val.startsWith('375')) val = val.substring(3);
        if (val.length > 9) val = val.substring(0, 9);
        let formatted = '+375';
        if (val.length > 0) formatted += ' ' + val.substring(0, 2);
        if (val.length >= 3) formatted += ' ' + val.substring(2, 5);
        if (val.length >= 6) formatted += ' ' + val.substring(5, 7);
        if (val.length >= 8) formatted += ' ' + val.substring(7, 9);
        e.target.value = formatted;
      });
      console.log('Phone input listener added');
    }

    const formInputs = bookingForm.querySelectorAll('.form-input');
    console.log('Form inputs found:', formInputs.length);

    formInputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        console.log('Blur event on field:', input.name);
        validateField(input);
      });
    });
    console.log('Blur listeners added to form inputs');

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('=== FORM SUBMIT ===');

      let isValid = true;
      var fields = ['name', 'phone', 'email', 'date', 'time', 'guests', 'agreement'];
      console.log('Validating fields:', fields);

      fields.forEach(function (fieldName) {
        var field = bookingForm.querySelector('[name="' + fieldName + '"]');
        console.log('Checking field:', fieldName, 'Found:', !!field);

        if (field) {
          var fieldValid = validateField(field);
          console.log('Field', fieldName, 'valid:', fieldValid);
          if (!fieldValid) {
            isValid = false;
            console.error('VALIDATION FAILED for field:', fieldName);
          }
        } else {
          console.error('Field not found:', fieldName);
        }
      });

      console.log('Overall form valid:', isValid);

      if (isValid) {
        console.log('Form is valid! Showing success message...');
        var success = document.getElementById('form-success');
        if (success) {
          success.textContent = 'Ваша заявка успешно отправлена!';
          success.classList.add('show');
        }

        bookingForm.reset();
        formInputs.forEach(function (input) {
          input.classList.remove('success');
        });

        setTimeout(function () {
          if (success) success.classList.remove('show');
        }, 5000);
      } else {
        console.error('FORM VALIDATION FAILED! Check errors above.');
      }
    });

    console.log('Submit listener added to booking form');
  }

  // СЛАЙДЕР ОТЗЫВОВ
  var testimonialsSlider = document.querySelector('.testimonials__slider');
  if (testimonialsSlider) {
    var slides = testimonialsSlider.querySelectorAll('.testimonials__slide');
    var dots = document.querySelectorAll('.testimonials__dot');
    var prevBtn = document.querySelector('.testimonials__nav-btn--prev');
    var nextBtn = document.querySelector('.testimonials__nav-btn--next');

    var currentSlide = 0;
    var totalSlides = slides.length;

    function showSlide(index) {
      slides.forEach(function (slide) {
        slide.classList.remove('testimonials__slide--active');
      });
      dots.forEach(function (dot) {
        dot.classList.remove('testimonials__dot--active');
      });
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

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    var autoSlide = setInterval(nextSlide, 5000);

    testimonialsSlider.addEventListener('mouseenter', function () {
      clearInterval(autoSlide);
    });
    testimonialsSlider.addEventListener('mouseleave', function () {
      autoSlide = setInterval(nextSlide, 5000);
    });
  }

  // ЗАГРУЗКА МЕНЮ ПРИ НАЛИЧИИ
  if (window.location.pathname.indexOf('menu.html') !== -1) {
    loadMenuWithCache()['catch'](function (e) {
      showErrorState(e.message);
    });
  }
});

// Обработчики онлайн/офлайн
window.addEventListener('online', function () {
  var bookings = getOfflineBookings();
  if (bookings.length > 0) {
    console.log('Синхронизация бронирований:', bookings.length);
    clearOfflineBookings();
  }
});

window.addEventListener('offline', function () {
  console.log('Офлайн режим');
});
