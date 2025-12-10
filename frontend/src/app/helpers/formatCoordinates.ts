export  function formatCoordinates(coords: { latitude: string; longitude: string }): string {
    const { latitude, longitude } = coords;
    return 'SRID=4326;POINT (' + longitude + ' ' + latitude + ')';
}