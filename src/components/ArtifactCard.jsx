
import React from 'react';

const ArtifactCard = ({ artifact, onClick }) => {
    return (
        <div
            className="artifact-card"
            onClick={() => onClick(artifact)}
        >
            <div className="card-header">
                <h3 className="card-title">{artifact.title}</h3>
                <span className={`badge badge-${artifact.function.toLowerCase()}`}>
                    {artifact.function}
                </span>
            </div>

            <p className="card-desc text-muted">{artifact.description}</p>

            <div className="card-footer">
                <div className="tags-row">
                    {artifact.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                    {artifact.tags.length > 3 && <span className="tag">+{artifact.tags.length - 3}</span>}
                </div>
                <div className="meta-row text-muted">
                    <span>{artifact.source}</span>
                    <span>•</span>
                    <span>{artifact.createdAt}</span>
                </div>
            </div>
        </div>
    );
};

export default ArtifactCard;
