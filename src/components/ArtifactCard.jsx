
import React from 'react';

const ArtifactCard = ({ artifact, onClick }) => {
    return (
        <div
            className="artifact-card"
            onClick={() => onClick(artifact)}
        >
            <div className="card-header">
                <div>
                    <h3 className="card-title text-h2 line-clamp-2">{artifact.title}</h3>
                </div>
                <span className={`badge badge-${artifact.function.toLowerCase()}`}>
                    {artifact.function}
                </span>
            </div>

            <p className="card-desc text-body text-muted line-clamp-3">{artifact.description}</p>

            <div className="card-footer">
                <div className="tags-row">
                    {artifact.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="tag text-caption">{tag}</span>
                    ))}
                    {artifact.tags.length > 3 && <span className="tag text-caption tabular-nums">+{artifact.tags.length - 3}</span>}
                </div>
                <div className="meta-row text-caption">
                    <span className="meta-source font-mono">{artifact.source}</span>
                    <span className="meta-separator">·</span>
                    <span className="meta-date tabular-nums">{artifact.createdAt}</span>
                </div>
            </div>
        </div>
    );
};

export default ArtifactCard;
