import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import LandingPage from "./pages/landingPage";
import HomePage from "./pages/homePage";
import MoviePage from "./pages/movieDetailsPage";
import FavouriteMoviesPage from "./pages/favouriteMoviesPage";
import MovieReviewPage from "./pages/movieReviewPage";
import UpcomingMoviesPage from "./pages/upcomingMoviesPage";
import AddMovieReviewPage from "./pages/addMovieReviewPage";
import PopularActorsPage from "./pages/popularActorsPage";
import ActorDetailsPage from "./pages/actorDetailsPage";
import FavouriteActorsPage from "./pages/favouriteActorsPage";
import AddActorReviewPage from "./pages/addActorReviewPage";
import SignUpPage from "./pages/signUpPage";
import LoginPage from "./pages/loginPage";
import DashboardPage from "./pages/dashboardPage";
import PlaylistsPage from "./pages/playlistsPage";
import PlaylistDetailsPage from "./pages/playlistDetailsPage";

import SiteHeader from "./components/siteHeader";
import SiteFooter from "./components/siteFooter";
import ProtectedRoute from "./components/protectedRoute";

import MoviesContextProvider from "./contexts/moviesContext";
import ActorsContextProvider from "./contexts/actorsContext";
import AuthContextProvider from "./contexts/authContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 360000,
      refetchInterval: 360000,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthContextProvider>
          <ActorsContextProvider>
            <MoviesContextProvider>
              <div
                style={{
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <SiteHeader />

                <main style={{ flexGrow: 1 }}>
                  <Routes>
                    <Route
                      path="/signup"
                      element={<SignUpPage />}
                    />

                    <Route
                      path="/login"
                      element={<LoginPage />}
                    />

                    <Route
                      path="/movies"
                      element={<HomePage />}
                    />

                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/movies/playlists"
                      element={
                        <ProtectedRoute>
                          <PlaylistsPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/movies/playlists/:id"
                      element={
                        <ProtectedRoute>
                          <PlaylistDetailsPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/movies/upcoming"
                      element={<UpcomingMoviesPage />}
                    />

                    <Route
                      path="/movies/favourites"
                      element={
                        <ProtectedRoute>
                          <FavouriteMoviesPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/movies/:id"
                      element={<MoviePage />}
                    />

                    <Route
                      path="/reviews/form"
                      element={<AddMovieReviewPage />}
                    />

                    <Route
                      path="/reviews/:id"
                      element={<MovieReviewPage />}
                    />

                    <Route
                      path="/actors"
                      element={<PopularActorsPage />}
                    />

                    <Route
                      path="/actors/favourites"
                      element={
                        <ProtectedRoute>
                          <FavouriteActorsPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/actors/reviews/form"
                      element={<AddActorReviewPage />}
                    />

                    <Route
                      path="/actors/:id"
                      element={<ActorDetailsPage />}
                    />

                    <Route
                      path="/"
                      element={<LandingPage />}
                    />

                    <Route
                      path="*"
                      element={<Navigate to="/" />}
                    />
                  </Routes>
                </main>

                <SiteFooter />
              </div>
            </MoviesContextProvider>
          </ActorsContextProvider>
        </AuthContextProvider>
      </BrowserRouter>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);