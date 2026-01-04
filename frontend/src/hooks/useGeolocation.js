import { useState, useEffect } from 'react';

export default function useGeolocation(options = {}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const successHandler = (e) => {
      setLoading(false);
      setPosition(e.coords);
      setError(null);
    };

    const errorHandler = (e) => {
      setError(e);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      options
    );

    const watcher = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      options
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [options]);

  return { loading, error, position };
}
