
import React, { useEffect } from 'react';

const PreviewModal = ({ artifact, onClose }) => {
    const [copyFeedback, setCopyFeedback] = React.useState('');

    useEffect(() => {
        // Lock body scroll when modal is open
        document.body.style.overflow = 'hidden';

        // Focus modal for accessibility (simple version)
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) modalContent.focus();

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleCopyLink = () => {
        const fullUrl = `${window.location.origin}${artifact.path}`;
        navigator.clipboard.writeText(fullUrl).then(() => {
            setCopyFeedback('Copied!');
            setTimeout(() => setCopyFeedback(''), 2000);
        });
    };

    if (!artifact) return null;

    return (
        <div className="modal-overlay" onClick={onClose} aria-modal="true" role="dialog">
            <div
                className="modal-content"
                onClick={e => e.stopPropagation()}
                tabIndex="-1" // Allow focus
            >
                <div className="modal-sidebar">
                    <div className="sidebar-header">
                        <h2 className="text-h2" style={{ flex: 1, marginRight: '16px' }}>{artifact.title}</h2>
                        <button className="close-btn" onClick={onClose} aria-label="Close">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div className="sidebar-tags">
                        {artifact.tags.map(tag => (
                            <span key={tag} className="tag text-caption">{tag}</span>
                        ))}
                    </div>

                    <div className="sidebar-desc">
                        <p className="text-body text-muted">{artifact.description}</p>
                    </div>

                    <div className="sidebar-meta">
                        <div className="meta-item">
                            <label className="text-caption font-bold">Function</label>
                            <span className={`badge badge-${artifact.function.toLowerCase()}`}>{artifact.function}</span>
                        </div>
                        <div className="meta-item">
                            <label className="text-caption font-bold">Author</label>
                            <span className="text-body">{artifact.author}</span>
                        </div>
                        <div className="meta-item">
                            <label className="text-caption font-bold">Date</label>
                            <span className="text-body tabular-nums">{artifact.createdAt}</span>
                        </div>
                        <div className="meta-item">
                            <label className="text-caption font-bold">Source</label>
                            <span className="text-body capital">{artifact.source}</span>
                        </div>
                    </div>

                    <div className="sidebar-actions mt-auto gap-2 flex flex-col">
                        <a
                            href={artifact.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary w-full"
                        >
                            Open in New Tab
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                        <button
                            className="btn btn-secondary w-full"
                            onClick={handleCopyLink}
                        >
                            {copyFeedback ? (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#10B981' }}>
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                    Copy Link
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="preview-container">
                    <iframe
                        src={artifact.path}
                        title={artifact.title}
                        sandbox="allow-scripts allow-same-origin"
                        className="preview-frame"
                    />
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;
