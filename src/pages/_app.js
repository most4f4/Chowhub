// src/pages/_app.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../layotus/Footer";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Handle initial page load
    const handleComplete = () => {
      setLoading(false);
      setIsInitialLoad(false);
    };

    const handleStart = () => {
      setLoading(true);
    };

    // For route changes
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    // For initial load
    if (router.isReady) {
      setIsInitialLoad(false);
    }

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  // Show loading for both initial load and route changes
  if (loading || isInitialLoad) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#121212",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <div style={{ textAlign: "center", color: "#FFF" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid #333",
              borderTop: "3px solid #4CAF50",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p>Loading ChowHub...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
      <Component {...pageProps} />
      <ToastContainer position="top-center" autoClose={3000} />
      <Footer />
    </div>
  );
}
