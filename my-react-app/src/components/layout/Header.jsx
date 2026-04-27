const Header = ({ title, onSearch }) => {
  return (
    <header className="header">
      <h1 style={{ margin: 0 }}> {title}</h1>
      <input 
        type="text" 
        placeholder="Поиск блюд..." 
        onChange={(e) => onSearch(e.target.value)}
      />
    </header>
  );
};

export default Header;