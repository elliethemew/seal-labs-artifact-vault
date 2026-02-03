
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
    <div className="app-container">
      <header className="app-header container">
        <div className="logo-section">
          <h1>Seal Labs Artifact Vault</h1>
          <p className="subtitle">Internal showcase of HTML artifacts & knowledge.</p>
        </div>
      </header>

      <main className="container">
        <div className="filters-bar">
          <div className="search-group">
            <input
              type="text"
              placeholder="Search artifacts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="select-group">
            <select
              value={selectedFunction}
              onChange={e => setSelectedFunction(e.target.value)}
              className="filter-select"
            >
              <option value="">All Functions</option>
              {FILTERS.function.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>

            <TagFilter
              allTags={allTags}
              artifacts={artifacts}
              selectedTags={selectedTags}
              onTagChange={setSelectedTags}
            />

            {(searchTerm || selectedFunction || selectedTags.length > 0) && (
              <button
                className="clear-btn"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFunction('');
                  setSelectedTags([]);
                }}
              >
                Clear
              </button>
            )}
          </div>
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
  );
}

export default App;
