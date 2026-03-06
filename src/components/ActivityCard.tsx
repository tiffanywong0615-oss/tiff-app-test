import React from 'react';
import './ActivityCard.css';

const ActivityCard = ({ activity }) => {
    const { type, location, mapQuery } = activity;
    const [photoUrl, setPhotoUrl] = React.useState('');

    const fetchPhoto = async () => {
        if (mapQuery) {
            const wikiSummaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(mapQuery)}`;
            const response = await fetch(wikiSummaryUrl);
            const data = await response.json();

            if (data.thumbnail) {
                setPhotoUrl(data.thumbnail.source);
            } else {
                const wikiSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=${encodeURIComponent(mapQuery)}&origin=*`;
                const searchResponse = await fetch(wikiSearchUrl);
                const searchData = await searchResponse.json();
                if (searchData.query.search.length > 0) {
                    const title = searchData.query.search[0].title;
                    const fallbackUrl = `https://commons.wikimedia.org/w/api/rest_v1/feed/medium/image/${title}`;
                    const fallbackResponse = await fetch(fallbackUrl);
                    const fallbackData = await fallbackResponse.json();
                    if (fallbackData.items && fallbackData.items.length > 0) {
                        setPhotoUrl(fallbackData.items[0].mediaUrl);
                    }
                }
            }
        }
        // Fallback to Unsplash if no photos found
        if (!photoUrl) {
            setPhotoUrl(`https://source.unsplash.com/featured/?${type},${location}`);
        }
    };

    React.useEffect(() => {
        fetchPhoto();
    }, [mapQuery]);

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
