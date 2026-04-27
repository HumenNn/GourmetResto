import Rating from '../ui/Rating';

const ReviewList = ({ reviews }) => {
  return (
    <div className="reviews-section">
      <h2 style={{ marginBottom: '20px' }}>Отзывы клиентов</h2>
      {reviews.map(review => (
        <div key={review.id} className="review-card">
          <img src={review.avatar} alt={review.author} className="review-avatar" />
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4 style={{ margin: 0 }}>{review.author}</h4>
              <small style={{ color: '#999' }}>{review.date}</small>
            </div>
            <Rating value={review.rating} />
            <p style={{ marginTop: '8px', fontStyle: 'italic' }}>"{review.text}"</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;