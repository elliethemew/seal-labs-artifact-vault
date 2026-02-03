
import React, { useState, useMemo, useEffect, useRef } from 'react';

const TagFilter = ({ allTags, artifacts, selectedTags, onTagChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAll, setShowAll] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Compute tag counts
    const tagCounts = useMemo(() => {
        const counts = {};
        artifacts.forEach(item => {
            item.tags.forEach(tag => {
                counts[tag] = (counts[tag] || 0) + 1;
            });
        });
        return counts;
    }, [artifacts]);

    // Sort tags by count desc, then alpha
    const sortedTags = useMemo(() => {
        return [...allTags].sort((a, b) => {
            const countDiff = (tagCounts[b] || 0) - (tagCounts[a] || 0);
            if (countDiff !== 0) return countDiff;
            return a.localeCompare(b);
        });
    }, [allTags, tagCounts]);

    const filteredTags = useMemo(() => {
        return sortedTags.filter(tag =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sortedTags, searchTerm]);

    const visibleTags = showAll || searchTerm ? filteredTags : filteredTags.slice(0, 6);

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            onTagChange(selectedTags.filter(t => t !== tag));
        } else {
            onTagChange([...selectedTags, tag]);
        }
    };

    const removeTag = (tag) => {
        onTagChange(selectedTags.filter(t => t !== tag));
    };

    return (
        <div className="tag-filter-container" ref={dropdownRef}>
            {/* Chips Area outside */}
            {selectedTags.length > 0 && (
                <div className="active-chips">
                    <span className="chips-label">Selected:</span>
                    {selectedTags.map(tag => (
                        <button key={tag} className="tag-chip" onClick={() => removeTag(tag)}>
                            {tag} <span className="chip-x">×</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Trigger */}
            <div className="tag-dropdown-wrapper">
                <div
                    className={`tag-dropdown-trigger ${isOpen ? 'open' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>{selectedTags.length > 0 ? `${selectedTags.length} tags selected` : 'Filter by Tags'}</span>
                    <span className="arrow">▼</span>
                </div>

                {/* Popover */}
                {isOpen && (
                    <div className="tag-popover">
                        <input
                            type="text"
                            className="tag-search-input"
                            placeholder="Search tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />

                        <div className="tag-list">
                            {visibleTags.map(tag => (
                                <label key={tag} className="tag-option">
                                    <input
                                        type="checkbox"
                                        checked={selectedTags.includes(tag)}
                                        onChange={() => toggleTag(tag)}
                                    />
                                    <span className="tag-name">{tag}</span>
                                    <span className="tag-count">({tagCounts[tag] || 0})</span>
                                </label>
                            ))}
                            {visibleTags.length === 0 && (
                                <div className="no-tags">No tags found</div>
                            )}
                        </div>

                        {!showAll && !searchTerm && filteredTags.length > 6 && (
                            <button
                                className="show-more-btn"
                                onClick={() => setShowAll(true)}
                            >
                                Show all {filteredTags.length} tags
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TagFilter;
