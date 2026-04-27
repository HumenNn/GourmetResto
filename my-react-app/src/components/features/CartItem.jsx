const CartItem = ({ item }) => {
  const handleIncrease = () => console.log(`Добавить еще 1: ${item.name}`);
  const handleDecrease = () => console.log(`Убрать 1: ${item.name}`);
  const handleRemove = () => console.log(`Удалить полностью: ${item.name}`);

  return (
    <div className="cart-item">
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0, color: '#000', fontSize: '0.95rem' }}>{item.name}</h4>
        <small style={{ color: '#636e72', fontWeight: '600' }}>
          {item.price} ₽
        </small>
      </div>

      <div className="cart-controls">
        <button className="btn-control" onClick={handleDecrease}>−</button>
        <span className="cart-quantity">{item.quantity}</span>
        <button className="btn-control" onClick={handleIncrease}>+</button>
        <button className="btn-remove" title="Удалить" onClick={handleRemove}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default CartItem;