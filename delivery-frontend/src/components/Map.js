import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

function Map({ center, zoom, markers = [] }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Loaded from .env
      version: 'weekly',
    });

    loader.load().then(() => {
      if (mapRef.current && window.google) {
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
        });

        markers.forEach(({ position, title, icon }) => {
          new window.google.maps.Marker({
            position,
            map,
            title,
            icon,
          });
        });
      }
    });
  }, [center, zoom, markers]);

  return <div ref={mapRef} className="h-96 w-full" />;
}

export default Map;
