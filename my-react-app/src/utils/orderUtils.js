// 1. Простое форматирование минут (для Unit-теста)
export const formatMinutes = (minutes) => {
  return `${minutes} мин`;
};

// 2. Красивый расчет времени привоза (текущее время + 40 минут)
export const calculateArrivalTime = (minutesToAdd) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutesToAdd);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// 3. Подсчет суммы заказа
export const calculateOrderTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};