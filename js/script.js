/* Бургер-меню */
const burger = document.querySelector('.header__burger');
const nav = document.querySelector('.header__nav');

if (burger && nav) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('header__burger--active');
        nav.classList.toggle('header__nav--active');
        
        const isActive = nav.classList.contains('header__nav--active');
        burger.setAttribute('aria-expanded', isActive);
    });

    // Закрытие при клике на ссылку
    nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('header__burger--active');
            nav.classList.remove('header__nav--active');
            burger.setAttribute('aria-expanded', 'false');
        });
    });
}
