
import React, { useState, useEffect, useMemo } from 'react';
import ArtifactList from './components/ArtifactList';
import PreviewModal from './components/PreviewModal';
import TagFilter from './components/TagFilter';

const FILTERS = {
  function: ['Engineering', 'Product', 'MKT', 'BD', 'HR'],
  source: ['claude', 'gemini', 'manual'] // Optional based on data
};

function App() {
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('');
  const [selectedTags, setSelectedTags] = useState([]); // Array now
  const [selectedArtifact, setSelectedArtifact] = useState(null);

  useEffect(() => {
    fetch('/catalog.json')
      .then(res => res.json())
      .then(data => {
        setArtifacts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load catalog:', err);
        setLoading(false);
      });
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set();
    artifacts.forEach(a => a.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [artifacts]);

  const filteredArtifacts = useMemo(() => {
    return artifacts.filter(artifact => {
      const matchesSearch =
        artifact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artifact.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFunction = selectedFunction ? artifact.function === selectedFunction : true;

      // Check if artifact has ALL selected tags (AND logic)
      const matchesTags = selectedTags.length === 0 || selectedTags.every(t => artifact.tags.includes(t));

      return matchesSearch && matchesFunction && matchesTags;
    });
  }, [artifacts, searchTerm, selectedFunction, selectedTags]);

  return (
    <>
      {/* Background Layers - Fixed & Behind */}
      <div className="bg-layer" aria-hidden="true" />
      <div className="bg-vignette" aria-hidden="true" />

      {/* Main App Content - Relative & Above */}
      <div id="app" style={{ position: 'relative', zIndex: 0 }}>
        <div className="app-container">
          <header className="app-header container">
            <div className="logo-section">
              <h1>Seal Labs Artifact Vault</h1>
              <p className="subtitle">Internal showcase of HTML artifacts & knowledge.</p>
            </div>
          </header>

          <main className="container">
            <div className="filters-section sticky-filters">
              <div className="filters-bar">
                <div className="search-group relative">
                  <svg className="icon-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search artifacts..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                    style={{ paddingLeft: '36px' }}
                  />
                </div>

                <div className="relative" style={{ display: 'flex', alignItems: 'center' }}>
                  <select
                    value={selectedFunction}
                    onChange={e => setSelectedFunction(e.target.value)}
                    className="filter-select"
                    style={{ appearance: 'none', paddingRight: '32px' }}
                  >
                    <option value="">All Functions</option>
                    {FILTERS.function.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <svg className="icon-chevron absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>

                <TagFilter
                  allTags={allTags}
                  artifacts={artifacts}
                  selectedTags={selectedTags}
                  onTagChange={setSelectedTags}
                />

                <div className="results-count text-caption tabular-nums" style={{ marginLeft: 'auto', color: 'var(--color-text-caption)' }}>
                  {loading ? '...' : `${filteredArtifacts.length} result${filteredArtifacts.length !== 1 ? 's' : ''}`}
                </div>
              </div>

              {/* Active Filters Row */}
              {(selectedTags.length > 0 || selectedFunction || searchTerm) && (
                <div className="active-filters-row">
                  {selectedTags.map(tag => (
                    <button
                      key={tag}
                      className="tag-chip active-filter-chip"
                      onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                    >
                      {tag}
                      <svg className="icon-x ml-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  ))}

                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedFunction('');
                      setSelectedTags([]);
                    }}
                  >
                    <svg className="icon-reset" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" />
                      <path d="M3 3v9h9" />
                    </svg>
                    Reset filters
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="loading">Loading catalog...</div>
            ) : (
              <ArtifactList
                artifacts={filteredArtifacts}
                onArtifactClick={setSelectedArtifact}
              />
            )}
          </main>

          <PreviewModal
            artifact={selectedArtifact}
            onClose={() => setSelectedArtifact(null)}
          />
        </div>
      </div>
    </>
  );
}

export default App;
