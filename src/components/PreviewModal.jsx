
import React, { useEffect } from 'react';

const PreviewModal = ({ artifact, onClose }) => {
    useEffect(() => {
        // Lock body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!artifact) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-sidebar">
                    <div className="sidebar-header">
                        <button className="close-btn" onClick={onClose}>&times;</button>
                        <h2>{artifact.title}</h2>
                    </div>

                    <div className="sidebar-meta">
                        <div className="meta-item">
                            <label>Function</label>
                            <span className={`badge badge-${artifact.function.toLowerCase()}`}>{artifact.function}</span>
                        </div>
                        <div className="meta-item">
                            <label>Author</label>
                            <span>{artifact.author}</span>
                        </div>
                        <div className="meta-item">
                            <label>Date</label>
                            <span>{artifact.createdAt}</span>
                        </div>
                        <div className="meta-item">
                            <label>Source</label>
                            <span style={{ textTransform: 'capitalize' }}>{artifact.source}</span>
                        </div>
                    </div>

                    <div className="sidebar-desc">
                        <p>{artifact.description}</p>
                    </div>

                    <div className="sidebar-tags">
                        {artifact.tags.map(tag => (
                            <span key={tag} className="tag">{tag}</span>
                        ))}
                    </div>

                    <div className="sidebar-actions">
                        <a
                            href={artifact.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            Open in New Tab
                        </a>
                    </div>
                </div>

                <div className="preview-container">
                    <iframe
                        src={artifact.path}
                        title={artifact.title}
                        sandbox="allow-scripts"
                        className="preview-frame"
                    />
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;
