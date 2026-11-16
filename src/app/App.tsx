import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';

const Home = lazy(() => import('@/pages/Home/Home'));
const Destinations = lazy(() => import('@/pages/Destinations/Destinations'));
const City = lazy(() => import('@/pages/City/City'));
const Quiz = lazy(() => import('@/pages/Quiz/Quiz'));
const RoutePage = lazy(() => import('@/pages/Route/Route'));
const Budget = lazy(() => import('@/pages/Budget/Budget'));
const Board = lazy(() => import('@/pages/Board/Board'));
const Booking = lazy(() => import('@/pages/Booking/Booking'));
const Packing = lazy(() => import('@/pages/Packing/Packing'));
const Journal = lazy(() => import('@/pages/Journal/Journal'));
const Profile = lazy(() => import('@/pages/Profile/Profile'));
const About = lazy(() => import('@/pages/About/About'));
const Trip = lazy(() => import('@/pages/Trip/Trip'));
const NotFound = lazy(() => import('@/pages/NotFound/NotFound'));

// Стиль-гайд доступен только в режиме разработки и не попадает в продакшен-сборку
const Kit = import.meta.env.DEV ? lazy(() => import('@/pages/Kit/Kit')) : null;

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="city/:id" element={<City />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="route" element={<RoutePage />} />
        <Route path="budget" element={<Budget />} />
        <Route path="board" element={<Board />} />
        <Route path="booking" element={<Booking />} />
        <Route path="packing" element={<Packing />} />
        <Route path="journal" element={<Journal />} />
        <Route path="profile" element={<Profile />} />
        <Route path="about" element={<About />} />
        <Route path="trip" element={<Trip />} />
        {Kit && <Route path="kit" element={<Kit />} />}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
