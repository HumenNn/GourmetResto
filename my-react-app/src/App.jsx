import './App.css';

import {dishes, categories, restaurantStats, reviewsData, mockCartData} from './data/mockData';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import DishCard from './components/features/DishCard';
import Cart from './components/features/Cart';
import ReviewList from './components/features/ReviewList';
import CategoryMenu from './components/ui/CategoryMenu';

function App() {
  // ==========================================
  // ОБРАБОТЧИКИ СОБЫТИЙ (ЗАГЛУШКИ ПО ЗАДАНИЮ)
  // ==========================================
  const handleCategoryClick = (category) => {
    console.log(`[Событие]: Выбрана категория "${category}"`);
  };

  const handleAddToCart = (dishId) => {
    console.log(`[Событие]: Блюдо с ID ${dishId} отправлено в корзину`);
  };

  const handleViewDetails = (dishId) => {
    console.log(`[Событие]: Просмотр деталей блюда ID ${dishId}`);
  };

  const handleSearch = (text) => {
    console.log(`[Событие]: Поиск по строке: "${text}"`);
  };

  // Статическая категория для демонстрации (т.к. useState запрещен)
  const currentCategory = "Все";

  return (
    <div className="app-container">

      <Header title="FoodDelivery" onSearch={handleSearch} />


      <CategoryMenu 
        categories={categories} 
        activeCategory={currentCategory} 
        onSelect={handleCategoryClick} 
      />


      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        <main style={{ flex: '7' }}>
          <div className="menu-grid">
            {dishes.map((dish) => (
              <DishCard 
                key={dish.id} 
                dish={dish} 
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </main>
        <div style={{ flex: '3' }}>
          <Cart items={mockCartData} />
        </div>
      </div>
      <ReviewList reviews={reviewsData} />
      <Footer info={restaurantStats} />
    </div>
  );
}

export default App;