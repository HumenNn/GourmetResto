import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../features/Cart';

describe('Cart Component', () => {
  const mockItems = [
    { id: 1, name: 'Тестовое блюдо', price: 100, quantity: 2 }
  ];

  test('отрисовывает корзину с товарами', () => {
    render(<Cart items={mockItems} onCheckout={jest.fn()} />);
    expect(screen.getByText('Корзина')).toBeInTheDocument();
    expect(screen.getByText('Тестовое блюдо')).toBeInTheDocument();
  });

  test('вызывает handleCheckout при клике на кнопку', () => {
    const mockHandler = jest.fn();
    render(<Cart items={mockItems} onCheckout={mockHandler} />);
    
    const button = screen.getByRole('button', { name: /Оформить заказ/i });
    fireEvent.click(button);
    
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});