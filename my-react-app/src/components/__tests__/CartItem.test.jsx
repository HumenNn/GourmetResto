import { render, screen } from '@testing-library/react';
import CartItem from '../features/CartItem';

describe('CartItem Component', () => {
  const item = { name: 'Пицца', price: 600, quantity: 2 };

  test('отображает данные товара в корзине', () => {
    render(<CartItem item={item} />);
    expect(screen.getByText('Пицца')).toBeInTheDocument();
    expect(screen.getByText('600 Руб')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});