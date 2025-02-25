import React, { useState, useEffect, useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import './App.css';

function App() {
  const [selectedLetter, setSelectedLetter] = useState('');
  const [users, setUsers] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Fetch the count of users for a specific letter
  const fetchCount = async (letter) => {
    try {
      const res = await fetch(`http://localhost:3001/api/count/${letter}`);
      if (!res.ok) throw new Error('Failed to fetch count');
      const data = await res.json();
      setCount(data.count);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch count. Please try again.');
    }
  };

  // Fetch users for a specific letter and cursor
  const fetchUsers = async (letter, cursor) => {
    try {
      setLoading(true);
      const url = new URL('http://localhost:3001/api/users');
      url.searchParams.append('startsWith', letter);
      if (cursor) url.searchParams.append('cursor', cursor);

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();

      setUsers((prev) => [...prev, ...data.users]);
      setCursor(data.cursor);
    } catch (error) {
      console.error(error);
      alert(`Failed to fetch users for letter ${letter}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Handle letter click
  const handleLetterClick = useCallback(async (letter) => {
    setSelectedLetter(letter);
    setUsers([]);
    setCursor(null);
    setSearchQuery('');
    await fetchCount(letter);
    await fetchUsers(letter);
  }, []);

  // Load more users when scrolling
  const loadMore = () => {
    if (cursor && !loading) {
      fetchUsers(selectedLetter, cursor);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Virtualized list row component
  const Row = useCallback(({ index, style }) => (
    <div style={style} className="list-item">
      {index < filteredUsers.length ? filteredUsers[index] : 'Loading...'}
    </div>
  ), [filteredUsers]);

  return (
    <div className="App">
      {/* Alphabet menu */}
      <div className="menu">
        {Array.from({ length: 26 }, (_, i) => {
          const letter = String.fromCharCode(65 + i);
          return (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              className={selectedLetter === letter ? 'active' : ''}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Search input */}
      {selectedLetter && (
        <>
          <input
            type="text"
            placeholder="Search names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />

          {/* Virtualized list */}
          <div className="virtualized-list">
            <FixedSizeList
              height={480}
              itemCount={filteredUsers.length}
              itemSize={35}
              width="100%"
              onItemsRendered={({ visibleStopIndex }) => {
                if (visibleStopIndex >= filteredUsers.length - 10 && !loading) {
                  loadMore();
                }
              }}
            >
              {Row}
            </FixedSizeList>
          </div>

          {/* Loading indicator */}
          {loading && <div className="loading">Loading...</div>}
        </>
      )}
    </div>
  );
}

export default App;