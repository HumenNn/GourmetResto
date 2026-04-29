import { render, screen, fireEvent } from '@testing-library/react';
import CategoryMenu from '../ui/CategoryMenu';

describe('CategoryMenu Component', () => {
  const categories = ['Все', 'Пицца', 'Суши'];

  test('отрисовывает все категории', () => {
    render(<CategoryMenu categories={categories} activeCategory="Все" onSelect={jest.fn()} />);
    expect(screen.getByText('Пицца')).toBeInTheDocument();
    expect(screen.getByText('Суши')).toBeInTheDocument();
  });

  test('вызывает onSelect при клике на категорию', () => {
    const onSelectMock = jest.fn();
    render(<CategoryMenu categories={categories} activeCategory="Все" onSelect={onSelectMock} />);
    
    fireEvent.click(screen.getByText('Пицца'));
    expect(onSelectMock).toHaveBeenCalledWith('Пицца');
  });
});