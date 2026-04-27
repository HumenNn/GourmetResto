const Card = ({ title, image, children }) => {
  return (
    <div className="card">
      <img src={image} alt={title} className="card-image" />
      <div className="card-content">
        <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default Card;