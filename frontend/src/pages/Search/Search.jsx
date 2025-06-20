import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../../components/FoodItem/FoodItem';
import styles from './Search.module.scss';

const Search = () => {
  const { food_list, isLoading } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const location = useLocation();
  const navigate = useNavigate();

  // Get search term from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [location.search]);

  // Filter and sort food items
  const filteredAndSortedFood = food_list
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const categories = ['All', ...new Set(food_list.map(item => item.category))];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('name');
    setPriceRange([0, 100]);
    navigate('/search');
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading food items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <h1>Search Food</h1>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchInput}>
            <input
              type="text"
              placeholder="Search for food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </div>
        </form>

        <div className={styles.filters}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'All' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          {(searchTerm || selectedCategory !== 'All' || sortBy !== 'name') && (
            <button onClick={clearFilters} className={styles.clearBtn}>
              Clear
            </button>
          )}
        </div>
      </div>

      <div className={styles.results}>
        {(searchTerm || selectedCategory !== 'All') && (
          <div className={styles.resultsHeader}>
            <p className={styles.resultsCount}>
              {filteredAndSortedFood.length} items found
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        )}

        <div className={styles.foodGrid}>
          {filteredAndSortedFood.length > 0 ? (
            filteredAndSortedFood.map((item, index) => (
              <FoodItem
                key={item._id || index}
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
                description={item.description}
              />
            ))
          ) : (
            <div className={styles.noResults}>
              <p>No items found. Try a different search term or category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
