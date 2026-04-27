const CategoryMenu = ({ categories, activeCategory, onSelect }) => {
  return (
    <div className="category-menu">
      {categories.map((category, index) => (
        <button
          key={index}
          className={`category-btn ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryMenu;