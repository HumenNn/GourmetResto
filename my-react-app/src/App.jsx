import './App.css';
import { dishes, categories, restaurantStats, reviewsData, mockCartData } from './data/mockData';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Cart from './components/features/Cart';
import ReviewList from './components/features/ReviewList';
import CategoryMenu from './components/ui/CategoryMenu';
import MenuSection from './components/features/MenuSection';

function App() {

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


  const handleCheckout = () => {
    console.log("[Событие]: Оформление заказа нажато");
  };

  const currentCategory = "Все";

  return (
    <div className="app-container">
      <Header title="FoodDelivery" onSearch={handleSearch} />

      <CategoryMenu 
        categories={categories} 
        activeCategory={currentCategory} 
        onSelect={handleCategoryClick} 
      />

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', padding: '20px' }}>
        
        <main style={{ flex: '7' }}>
          <MenuSection 
            title={currentCategory === "Все" ? "Популярные блюда" : currentCategory} 
            dishes={dishes} 
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
          />
        </main>

        <aside style={{ flex: '3' }}>

          <Cart items={mockCartData} onCheckout={handleCheckout} />
        </aside>
        
      </div>
      
      <ReviewList reviews={reviewsData} />
      <Footer info={restaurantStats} />
    </div>
  );
}

export default App;