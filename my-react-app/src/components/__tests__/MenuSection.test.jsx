import { render, screen } from '@testing-library/react';
import MenuSection from '../features/MenuSection';

describe('MenuSection Component', () => {
  const mockDishes = [
    { id: 1, name: 'Пицца', price: 600 },
    { id: 2, name: 'Борщ', price: 350 }
  ];

  test('отображает заголовок секции', () => {
    render(<MenuSection title="Наше Меню" dishes={mockDishes} onAddToCart={jest.fn()} />);
    expect(screen.getByText('Наше Меню')).toBeInTheDocument();
  });

  test('отрисовывает все переданные карточки блюд', () => {
    render(<MenuSection title="Меню" dishes={mockDishes} onAddToCart={jest.fn()} />);
    
    expect(screen.getByText('Пицца')).toBeInTheDocument();
    expect(screen.getByText('Борщ')).toBeInTheDocument();
  });
});