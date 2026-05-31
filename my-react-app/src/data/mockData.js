import imgSaladHalumi from '../assets/images/salad.jpg';
import imgBruschetta from '../assets/images/butery.jpg';
import imgTartar from '../assets/images/food.jpg';

import imgCarbonara from '../assets/images/pasta.jpg';
import imgSalmonSteak from '../assets/images/salmon_steak.jpg';
import imgRisottoMushroom from '../assets/images/risotto-mushroom.jpg';

import imgTiramisu from '../assets/images/tiramisu.jpg';
import imgCheesecake from '../assets/images/cheesecake.jpg';
import imgCremeBrulee from '../assets/images/creme-brulee.webp';

import avatarUser1 from '../assets/images/user1.jpg';
import avatarUser2 from '../assets/images/user2.jpg';


export const categories = ["Все", "Закуски", "Основные блюда", "Десерты"];

export const dishes = [

  {
    id: 1,
    name: "Салат с бататом и халуми",
    description: "Салат из шпината, жареный батат и жареный халуми с грецкими орехами",
    price: 450,
    category: "Закуски",
    rating: 4.0,
    image: imgSaladHalumi
  },
  {
    id: 2,
    name: "Брускетта с томатами",
    description: "Поджаренный хлеб с томатами и базиликом",
    price: 320,
    category: "Закуски",
    rating: 4.5,
    image: imgBruschetta
  },
  {
    id: 3,
    name: "Тартар из говядины",
    description: "Классический тартар с каперсами и перепелиным яйцом",
    price: 580,
    category: "Закуски",
    rating: 4.8,
    image: imgTartar
  },

  {
    id: 4,
    name: "Паста карбонара",
    description: "Классическая итальянская паста с беконом и сливочным соусом",
    price: 680,
    category: "Основные блюда",
    rating: 4.7,
    image: imgCarbonara
  },
  {
    id: 5,
    name: "Стейк из лосося",
    description: "Лосось на гриле с овощами и лимонным соусом",
    price: 800,
    category: "Основные блюда",
    rating: 4.9,
    image: imgSalmonSteak
  },
  {
    id: 6,
    name: "Ризотто с грибами",
    description: "Итальянское ризотто с лесными грибами и пармезаном",
    price: 720,
    category: "Основные блюда",
    rating: 4.6,
    image: imgRisottoMushroom
  },

  {
    id: 7,
    name: "Тирамису",
    description: "Классический итальянский десерт с маскарпоне",
    price: 420,
    category: "Десерты",
    rating: 4.8,
    image: imgTiramisu
  },
  {
    id: 8,
    name: "Русский Чизкейк",
    description: "Классический чизкейк с клубничным соусом",
    price: 480,
    category: "Десерты",
    rating: 4.9,
    image: imgCheesecake
  },
  {
    id: 9,
    name: "Крем-брюле",
    description: "Французский десерт с карамельной корочкой",
    price: 390,
    category: "Десерты",
    rating: 4.7,
    image: imgCremeBrulee
  }
];

export const restaurantStats = {
  name: "FoodDelivery",
  address: "ул. Академическая, 12",
  deliveryTime: "35-50 мин",
  rating: 4.8
};

export const reviewsData = [
  {
    id: 101,
    author: "Дмитрий Нагиев",
    date: "20 апреля 2026",
    text: "Блюда действительно великолепны. Стейк из лосося и было просто потрясающим. Я обязательно зайду сюда ещё не раз",
    rating: 5,
    avatar: avatarUser1
  },
  {
    id: 102,
    author: "Ренат Агзамов",
    date: "24 апреля 2026",
    text: "Попробовал этот ваш Русский Чизкейк. Он так хорош что ему даже хруст не нужен.",
    rating: 5,
    avatar: avatarUser2
  }
];


export const mockCartData = [
  {
    id: 101,
    dishId: 4,
    name: "Паста карбонара",
    price: 680,
    quantity: 2,
    image: imgCarbonara
  },
  {
    id: 102,
    dishId: 1,
    name: "Салат с бататом и халуми",
    price: 450,
    quantity: 1,
    image: imgSaladHalumi
  },
  {
    id: 103,
    dishId: 7,
    name: "Тирамису",
    price: 420,
    quantity: 1,
    image: imgTiramisu
  }
];