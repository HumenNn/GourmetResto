/* Бургер-меню */
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

/* Фильтрация меню */
const filterButtons = document.querySelectorAll('.menu__filter-btn');
const menuCategories = document.querySelectorAll('.menu-category');

if (filterButtons.length > 0) {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => {
        btn.classList.remove('menu__filter-btn--active', 'active');
      });
      button.classList.add('menu__filter-btn--active', 'active');

      const category = button.getAttribute('data-category');

      menuCategories.forEach((categoryEl) => {
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

/* Валидация формы бронирования */
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
  const dateInput = document.getElementById('date');
  if (dateInput) {
    dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
  }

  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');

      if (value.startsWith('375')) value = value.substring(3);
      if (value.startsWith('7') || value.startsWith('8')) value = value.substring(1);
      if (value.length > 9) value = value.substring(0, 9);

      let formattedValue = '+375';
      if (value.length > 0) formattedValue += ' ' + value.substring(0, 2);
      if (value.length >= 3) formattedValue += ' ' + value.substring(2, 5);
      if (value.length >= 6) formattedValue += ' ' + value.substring(5, 7);
      if (value.length >= 8) formattedValue += ' ' + value.substring(7, 9);

      e.target.value = formattedValue;
    });
  }

  const formInputs = bookingForm.querySelectorAll('.form-input');
  formInputs.forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
  });

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const fields = ['name', 'phone', 'email', 'date', 'time', 'guests', 'agreement'];

    fields.forEach((fieldName) => {
      const field = bookingForm.querySelector(`[name="${fieldName}"]`);
      if (field && !validateField(field)) isValid = false;
    });

    if (isValid) {
      const successMessage = document.getElementById('form-success');
      if (successMessage) {
        successMessage.textContent =
          'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.';
        successMessage.classList.add('show');
      }

      bookingForm.reset();
      formInputs.forEach((input) => input.classList.remove('success'));

      setTimeout(() => {
        if (successMessage) successMessage.classList.remove('show');
      }, 5000);
    }
  });
}

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

/* Слайдер отзывов */
const testimonialsSlider = document.querySelector('.testimonials__slider');

if (testimonialsSlider) {
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
