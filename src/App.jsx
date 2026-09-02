import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import UpdatePage from "./pages/UpdatePage";

const PostDetailPage = lazy(() => import("./pages/PostDetailPage"));

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route
          path="/posts/:id"
          element={
            <Suspense
              fallback={
                <main className="app">
                  <p>Loading post...</p>
                </main>
              }
            >
              <PostDetailPage />
            </Suspense>
          }
        />
        <Route path="/posts/:id/update" element={<UpdatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
