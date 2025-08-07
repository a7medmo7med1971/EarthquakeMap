import React, { useEffect } from 'react';
import './App.css';
import MapLayer from './Compontes/Map/MapLayer';
import Navbar from './Compontes/Map/layout/Navbar';
import { Offline, Online } from 'react-detect-offline';
import Swal from 'sweetalert2';

function App() {

  useEffect(() => {
    const handleOffline = () => {
      Swal.fire({
        title: "No Internet Connection",
        text: "You are currently offline. Please check your network.",
        icon: "warning",
        confirmButtonText: "OK"
      });
    };

    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      <Online>
        <Navbar />
        <MapLayer />
      </Online>

      <Offline>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h2>You are offline</h2>
        </div>
      </Offline>
    </>
  );
}

export default App;
