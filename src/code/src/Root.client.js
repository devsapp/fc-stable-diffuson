

import { useState, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useServerResponse } from './Cache.client';
import { LocationContext } from './LocationContext.client';
import PreLoad from './PreLoad';
export default function Root({ initialCache }) {
  return (
    <Suspense fallback={null}>
      <ErrorBoundary FallbackComponent={Error}>
        <ContentWrapper />
      </ErrorBoundary>
    </Suspense>
  );
}
function ContentWrapper() {
  return <Suspense fallback={<PreLoad />}>
    <Content />
  </Suspense>
}
function Content() {
  const [location, setLocation] = useState({
    selectedId: null,
    isEditing: false,
    searchText: '',
  });
  const response = useServerResponse(location);
  return (
    <LocationContext.Provider value={[location, setLocation]}>
      {response.readRoot()}
    </LocationContext.Provider>
  );
}

function Error({ error }) {
  return (
    <div>
      <h1>Application Error</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
    </div>
  );
}
