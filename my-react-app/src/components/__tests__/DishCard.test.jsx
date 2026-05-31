import { render, screen, fireEvent } from '@testing-library/react';
import DishCard from '../features/DishCard';

describe('DishCard Component', () => {
  const mockDish = { id: 1, name: 'Борщ', price: 300 };
  const mockOnAddToCart = jest.fn();

  test('отображает название и цену блюда', () => {
    render(<DishCard dish={mockDish} onAddToCart={mockOnAddToCart} />);
    expect(screen.getByText('Борщ')).toBeInTheDocument();
    expect(screen.getByText('300 Руб')).toBeInTheDocument();
  });

  test('вызывает функцию добавления при клике', () => {
    render(<DishCard dish={mockDish} onAddToCart={mockOnAddToCart} />);
    fireEvent.click(screen.getByText('Купить'));
    expect(mockOnAddToCart).toHaveBeenCalledWith(mockDish.id);
  });
});