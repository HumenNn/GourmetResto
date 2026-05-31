import { render, screen } from '@testing-library/react';
import Header from '../layout/Header';

describe('Header Component', () => {
  test('отображает заголовок приложения', () => {
    render(<Header title="FoodDelivery" onSearch={jest.fn()} />);
    expect(screen.getByText(/FoodDelivery/i)).toBeInTheDocument();
  });
});