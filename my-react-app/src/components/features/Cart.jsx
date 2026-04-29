import CartItem from './CartItem';
import { calculateOrderTotal, calculateArrivalTime } from '../../utils/orderUtils';

const Cart = ({ items, onCheckout }) => { // Добавили onCheckout в пропсы
  const totalSum = calculateOrderTotal(items);
  const arrivalTime = calculateArrivalTime(40);

  return (
    <aside className="cart-aside">
      <h2>Корзина</h2>
      
      <div className="cart-items-list">
        {items.length > 0 ? (
          items.map(item => <CartItem key={item.id} item={item} />)
        ) : (
          <p className="empty-cart-text">Ваша корзина пуста</p>
        )}
      </div>

      {items.length > 0 && (
        <div className="cart-summary">
          <div style={{ 
            backgroundColor: '#fff9db', 
            padding: '10px', 
            borderRadius: '8px', 
            marginBottom: '15px',
            border: '1px solid #fcefb4'
          }}>
            🚚 Привезем к: <strong>{arrivalTime}</strong>
          </div>

          <div className="total-row">
            <span>Итого:</span>
            <span className="total-amount">{totalSum} Руб</span>
          </div>
          {/* Добавили onClick */}
          <button className="btn-checkout" onClick={onCheckout}>Оформить заказ</button>
        </div>
      )}
    </aside>
  );
};

export default Cart;