import { render, screen } from '@testing-library/react';
import Footer from '../layout/Footer';

describe('Footer Component', () => {
  const mockStats = { 
    orders: 100, 
    rating: 4.8, 
    address: 'ул. Октябрьская', 
    deliveryTime: '30-40 мин' 
  };

  test('отображает базовую информацию футера', () => {
    render(<Footer info={mockStats} />);
    
    // Проверяем наличие рейтинга (он точно есть в выводе: 4.8)
    expect(screen.getByText(/4.8/)).toBeInTheDocument();
    
    // Проверяем наличие статического текста
    expect(screen.getByText(/Средний рейтинг заведения/i)).toBeInTheDocument();
    
    // Проверяем копирайт
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });
});