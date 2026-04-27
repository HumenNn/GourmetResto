import Rating from '../ui/Rating';

const Footer = ({ info }) => {
  return (
    <footer className="footer">
      <h2>О ресторане "{info.name}"</h2>
      <p style={{ margin: '10px 0' }}>📍 {info.address} | 🚚 Доставка: {info.deliveryTime}</p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
        <span>Средний рейтинг заведения:</span>
        <Rating value={info.rating} />
      </div>
      <p style={{ marginTop: '20px', fontSize: '0.8em' }}>© 2026 Все права защищены</p>
    </footer>
  );
};

export default Footer;