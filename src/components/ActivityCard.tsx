import React from 'react';
import './ActivityCard.css';

const ActivityCard = ({ activity }) => {
    const { type, location, mapQuery } = activity;
    const [photoUrl, setPhotoUrl] = React.useState('');

    const fetchPhoto = React.useCallback(async () => {
        const picsumUrl = `https://picsum.photos/seed/${encodeURIComponent(type + location)}/400/300`;
        let resolvedUrl = '';

        try {
            if (mapQuery) {
                const wikiSummaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(mapQuery)}`;
                const response = await fetch(wikiSummaryUrl);
                const data = await response.json();

                if (data.thumbnail) {
                    resolvedUrl = data.thumbnail.source;
                } else {
                    const wikiSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=${encodeURIComponent(mapQuery)}&origin=*`;
                    const searchResponse = await fetch(wikiSearchUrl);
                    const searchData = await searchResponse.json();
                    if (searchData.query?.search?.length > 0) {
                        const title = searchData.query.search[0].title;
                        const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&format=json&srsearch=${encodeURIComponent(title)}&origin=*`;
                        const commonsResponse = await fetch(commonsUrl);
                        const commonsData = await commonsResponse.json();
                        if (commonsData.query?.search?.length > 0) {
                            const fileTitle = commonsData.query.search[0].title;
                            resolvedUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileTitle)}?width=400`;
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Photo fetch failed:', error);
            resolvedUrl = '';
        }

        // Fallback to picsum.photos if no photo was resolved
        if (!resolvedUrl) {
            resolvedUrl = picsumUrl;
        }

        setPhotoUrl(resolvedUrl);
    }, [type, location, mapQuery]);

    React.useEffect(() => {
        fetchPhoto();
    }, [fetchPhoto]);

    return (
        <div className="activity-card">
            <div className="photo-section">
                {photoUrl ? <img src={photoUrl} alt={type} /> : <div className="skeleton-placeholder">Loading...</div>}
            </div>
            <div className="activity-details">
                <h2>{type}</h2>
                <p>{location}</p>
            </div>
        </div>
    );
};

export default ActivityCard;
