// import { useState, useCallback } from 'react';
// import styles from './SearchBar.module.css';
//
// export default function SearchBar() {
//     const [query, setQuery] = useState('');
//     const [suggestions, setSuggestions] = useState([]);
//
//     const debouncedFetch = useCallback(
//         debounce(async (value) => {
//             if (value.length < 2) {
//                 setSuggestions([]);
//                 return;
//             }
//
//             try {
//                 const response = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
//                 const data = await response.json();
//                 setSuggestions(data);
//             } catch (error) {
//                 console.error('Erreur lors de la recherche:', error);
//             }
//         }, 300),
//         []
//     );
//
//     const handleInputChange = (e) => {
//         const value = e.target.value;
//         setQuery(value);
//         debouncedFetch(value);
//     };
//
//     const handleSuggestionClick = (suggestion) => {
//         setQuery(suggestion.display_name);
//         setSuggestions([]);
//     };
//
//     return (
//         <div className={styles.searchContainer}>
//             <input
//                 type="text"
//                 value={query}
//                 onChange={handleInputChange}
//                 placeholder="Rechercher un lieu..."
//                 className={styles.searchInput}
//             />
//             {suggestions.length > 0 && (
//                 <ul className={styles.suggestionsList}>
//                     {suggestions.map((suggestion, index) => (
//                         <li
//                             key={index}
//                             onClick={() => handleSuggestionClick(suggestion)}
//                             className={styles.suggestionItem}
//                         >
//                             {suggestion.display_name}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// }
//
// function debounce(func, wait) {
//     let timeout;
//     return function executedFunction(...args) {
//         const later = () => {
//             clearTimeout(timeout);
//             func(...args);
//         };
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//     };
// }

import { useState, useCallback } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const debouncedFetch = useCallback(
        debounce(async (value) => {
            if (value.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`
                );
                const data = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error('Erreur lors de la recherche:', error);
                setSuggestions([]);
            }
        }, 300),
        []
    );

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedFetch(value);
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.display_name);
        setSuggestions([]);
    };

    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Rechercher un lieu..."
                className={styles.searchInput}
            />
            {suggestions.length > 0 && (
                <ul className={styles.suggestionsList}>
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={styles.suggestionItem}
                        >
                            {suggestion.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}