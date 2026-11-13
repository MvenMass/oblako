import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Стиль-гайд доступен только в режиме разработки и не попадает в продакшен-сборку
const Kit = import.meta.env.DEV ? lazy(() => import('@/pages/Kit/Kit')) : null;

function Home() {
  return <main id="main" />;
}

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          {Kit && <Route path="/kit" element={<Kit />} />}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
