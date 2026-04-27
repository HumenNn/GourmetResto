const Rating = ({ value }) => {
  // Рисуем звездочки на основе оценки (простая математика для лабы)
  const stars = '★'.repeat(Math.round(value)) + '☆'.repeat(5 - Math.round(value));
  return (
    <div style={{ color: '#ffc107', letterSpacing: '2px', fontSize: '1.2em' }}>
      {stars} <span style={{ color: '#666', fontSize: '0.8em', marginLeft: '5px' }}>{value}</span>
    </div>
  );
};

export default Rating;