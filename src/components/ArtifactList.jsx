
import React from 'react';
import ArtifactCard from './ArtifactCard';

const ArtifactList = ({ artifacts, onArtifactClick }) => {
    if (artifacts.length === 0) {
        return (
            <div className="empty-state">
                <p>No artifacts found matching your filters.</p>
            </div>
        );
    }

    return (
        <div className="artifact-grid">
            {artifacts.map(artifact => (
                <ArtifactCard
                    key={artifact.id}
                    artifact={artifact}
                    onClick={onArtifactClick}
                />
            ))}
        </div>
    );
};

export default ArtifactList;
