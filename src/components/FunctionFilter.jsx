import React, { useState, useEffect, useRef } from 'react';

const FunctionFilter = ({ selectedFunction, onFunctionChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const FUNCTIONS = ['Engineering', 'Product', 'MKT', 'BD', 'HR'];

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

    const handleSelect = (func) => {
        onFunctionChange(func === selectedFunction ? '' : func);
        setIsOpen(false);
    };

    return (
        <div className="tag-filter-container" ref={dropdownRef}>
            <div className="tag-dropdown-wrapper">
                <div
                    className={`tag-dropdown-trigger ${isOpen ? 'open' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ minWidth: '160px' }} // Match the previous select width
                >
                    <span>{selectedFunction || 'All Functions'}</span>
                    <svg className="icon-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>

                {isOpen && (
                    <div className="tag-popover" style={{ width: '100%' }}>
                        <div className="tag-list" style={{ maxHeight: 'auto', padding: '4px 0' }}>
                            <div
                                className="tag-option"
                                onClick={() => handleSelect('')}
                            >
                                <span className="tag-name" style={{ fontWeight: !selectedFunction ? 600 : 400 }}>All Functions</span>
                                {!selectedFunction && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                )}
                            </div>
                            {FUNCTIONS.map(func => (
                                <div
                                    key={func}
                                    className="tag-option"
                                    onClick={() => handleSelect(func)}
                                >
                                    <span className="tag-name" style={{ fontWeight: selectedFunction === func ? 600 : 400 }}>{func}</span>
                                    {selectedFunction === func && (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FunctionFilter;
