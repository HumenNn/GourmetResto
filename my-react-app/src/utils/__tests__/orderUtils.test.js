import { calculateOrderTotal, calculateArrivalTime } from '../orderUtils';

describe('Order Utilities', () => {
  describe('calculateOrderTotal', () => {
    test('верно рассчитывает общую сумму заказа', () => {
      const items = [
        { price: 500, quantity: 2 }, 
        { price: 100, quantity: 1 }
      ];
      expect(calculateOrderTotal(items)).toBe(1100);
    });

    test('возвращает 0 для пустой корзины', () => {
      expect(calculateOrderTotal([])).toBe(0);
    });
  });

  describe('calculateArrivalTime', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      // Устанавливаем 15:00 27 апреля 2026
      jest.setSystemTime(new Date(2026, 3, 27, 15, 0));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('должен корректно рассчитывать время через 40 минут', () => {
      // 15:00 + 40 мин = 15:40
      expect(calculateArrivalTime(40)).toBe('15:40');
    });

    test('должен корректно переходить на новый час', () => {
      // 15:00 + 70 мин = 16:10
      expect(calculateArrivalTime(70)).toBe('16:10');
    });
  });
});