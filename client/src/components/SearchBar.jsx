import { useState } from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('all'); // all, org, repo
    const [language, setLanguage] = useState('');
    const [minStars, setMinStars] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            let query = searchQuery.trim();

            // Build proper query based on search type
            if (searchType === 'org') {
                // Search for repositories in the organization
                query = `org:${query}`;
            } else if (searchType === 'repo') {
                // Search for specific repository (expects format: owner/repo or just repo name)
                if (!query.includes('/')) {
                    // If no slash, search in repository names
                    query = `in:name ${query}`;
                } else {
                    // If has slash, search exact repo
                    query = `repo:${query}`;
                }
            }

            onSearch({
                query,
                language: language || undefined,
                minStars: minStars ? parseInt(minStars) : undefined
            });
        }
    };

    return (
        <div className="search-bar-container">
            <form onSubmit={handleSearch} className="search-form">
                <div className="search-main">
                    <div className="search-type-selector">
                        <button
                            type="button"
                            className={`type-btn ${searchType === 'all' ? 'active' : ''}`}
                            onClick={() => setSearchType('all')}
                        >
                            All
                        </button>
                        <button
                            type="button"
                            className={`type-btn ${searchType === 'org' ? 'active' : ''}`}
                            onClick={() => setSearchType('org')}
                        >
                            Organization
                        </button>
                        <button
                            type="button"
                            className={`type-btn ${searchType === 'repo' ? 'active' : ''}`}
                            onClick={() => setSearchType('repo')}
                        >
                            Repository
                        </button>
                    </div>

                    <input
                        type="text"
                        className="input search-input"
                        placeholder={
                            searchType === 'org'
                                ? 'Search by organization (e.g., facebook, microsoft)...'
                                : searchType === 'repo'
                                    ? 'Search by repository (e.g., facebook/react)...'
                                    : 'Search repositories...'
                        }
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="search-filters">
                    <input
                        type="text"
                        className="input filter-input"
                        placeholder="Language (e.g., JavaScript)"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    />
                    <input
                        type="number"
                        className="input filter-input"
                        placeholder="Min Stars"
                        value={minStars}
                        onChange={(e) => setMinStars(e.target.value)}
                        min="0"
                    />
                    <button type="submit" className="btn btn-primary search-submit-btn">
                        <Search size={18} />
                        Search
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SearchBar;
