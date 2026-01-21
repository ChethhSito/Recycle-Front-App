import { useState, useEffect, useCallback } from 'react';
import { getInductionVideos, incrementVideoView } from './index';

export const useInduction = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper to generate thumbnail from YouTube URL
    const getThumbnail = (url) => {
        if (!url) return 'https://via.placeholder.com/640x360.png?text=No+Video';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : null;
        return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : 'https://via.placeholder.com/640x360.png?text=Invalid+URL';
    };

    const fetchVideos = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getInductionVideos();
            // Process videos to add auto-generated thumbnail
            const processedVideos = data.map(video => ({
                ...video,
                id: video._id, // Ensure id compatibility
                thumbnail: getThumbnail(video.videoUrl)
            }));
            setVideos(processedVideos);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const registerView = async (id) => {
        try {
            await incrementVideoView(id);
        } catch (err) {
            console.error('Failed to register view', err);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    return { videos, loading, error, refetch: fetchVideos, registerView };
};
