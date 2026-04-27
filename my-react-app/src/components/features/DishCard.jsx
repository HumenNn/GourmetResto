import Card from '../ui/Card';
import Rating from '../ui/Rating';
import Button from '../ui/Button';

const DishCard = ({ dish, onAddToCart, onViewDetails }) => {
  return (
    <Card 
      title={dish.name} 
      image={dish.image}
    >
      {/* Описание теперь имеет класс для выравнивания */}
      <p className="dish-description">{dish.description}</p>
      
      <div className="dish-meta">
        <Rating value={dish.rating} />
        
        {/* Нижняя строка, которая всегда на одном уровне */}
        <div className="card-footer">
          <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{dish.price} Руб</span>
          <div style={{ display: 'flex', gap: '5px' }}>
            <Button variant="primary" onClick={() => onAddToCart(dish.id)}>Купить</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DishCard;