import CartItem from './CartItem';

const Cart = ({ items }) => {
  // Считаем сумму прямо здесь
  const totalSum = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <aside className="cart-aside">
      <h2>Корзина</h2>
      
      <div className="cart-items-list">
        {items.length > 0 ? (
          items.map(item => (
            <CartItem key={item.id} item={item} />
          ))
        ) : (
          <p className="empty-cart-text">Ваша корзина пуста</p>
        )}
      </div>

      {items.length > 0 && (
        <div className="cart-summary">
          <div className="total-row">
            <span>Итого:</span>
            <span className="total-amount">{totalSum} ₽</span>
          </div>
          <button className="btn-checkout" onClick={() => console.log('Оформление заказа...')}>
            Оформить заказ
          </button>
        </div>
      )}
    </aside>
  );
};

export default Cart;