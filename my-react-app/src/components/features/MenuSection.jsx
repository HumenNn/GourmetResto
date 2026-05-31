import DishCard from './DishCard';

const MenuSection = ({ title, dishes, onAddToCart, onViewDetails }) => {
  return (
    <section className="menu-section">
      <h2 style={{ marginBottom: '20px' }}>{title}</h2>
      <div className="menu-grid"> 
        {dishes.map((dish) => (
          <DishCard 
            key={dish.id} 
            dish={dish} 
            onAddToCart={onAddToCart}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </section>
  );
};

export default MenuSection;