import { useEffect, useRef } from 'react';

function Map({ center, zoom, markers, polylinePath }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps API not loaded');
      return;
    }

    // Initialize map
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeId: 'roadmap',
    });

    // Add markers
    markers.forEach((marker) => {
      new window.google.maps.Marker({
        position: marker.position,
        map: mapInstanceRef.current,
        title: marker.title,
        icon: marker.icon,
      });
    });

    // Draw polyline if provided
    if (polylinePath && polylinePath.length > 0) {
      const polyline = new window.google.maps.Polyline({
        path: polylinePath,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      polyline.setMap(mapInstanceRef.current);
    }

    return () => {
      // Cleanup if needed
    };
  }, [center, zoom, markers, polylinePath]);

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />;
}

export default Map;