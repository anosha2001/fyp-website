'use client';

import Navbar from "@/components/ui/navbar";
import PageIllustration from "@/components/page-illustration";
import { useEffect, useState } from "react";

interface Alert {
  camera_id: string;
  timestamp: string;
  anomaly_type: string;
  frame_path: string;
}

export default function History() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cameraId, setCameraId] = useState<string>('');
  const [anomalyType, setAnomalyType] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>('');
  const [cameraOptions, setCameraOptions] = useState<string[]>([]);
const [anomalyOptions, setAnomalyOptions] = useState<string[]>([]);


const fetchAlerts = async () => {
  try {
    const params = new URLSearchParams();
    if (cameraId) params.append('camera_id', cameraId);
    if (anomalyType) params.append('anomaly_type', anomalyType);
    if (timestamp) params.append('timestamp', timestamp);

    const url = `http://localhost:8000/alerts?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Network error");

    const data: Alert[] = await response.json();
    setAlerts(data);

    // Extract unique camera IDs and anomaly types
    const cameras = Array.from(new Set(data.map(alert => alert.camera_id)));
const anomalies = Array.from(new Set(data.map(alert => alert.anomaly_type)));
    setCameraOptions(cameras);
    setAnomalyOptions(anomalies);

  } catch (err: any) {
    setError("Failed to load alerts");
    console.error(err);
  }
};


  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleFilter = () => {
    fetchAlerts();
  };

const formatImagePath = (framePath: string, timestamp: string): string => {
  // Convert timestamp to image filename
  const dateObj = new Date(timestamp);
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const hh = String(dateObj.getHours()).padStart(2, '0');
  const min = String(dateObj.getMinutes()).padStart(2, '0');
  const ss = String(dateObj.getSeconds()).padStart(2, '0');

  const filename = `${yyyy}${mm}${dd}_${hh}${min}${ss}.jpg`;

  // Extract the part of the path after 'images'
  const imagePathIndex = framePath.indexOf('images');
  const relativePath = framePath.slice(imagePathIndex).replace(/\\/g, '/');

  return `${relativePath}/${filename}`;
};


  return (
    <>
      <Navbar />
      <PageIllustration />

      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Surveillance History</h1>

        {/* Filter UI */}
        <div className="flex flex-wrap gap-4 mb-6">
            {/* Camera Dropdown */}
                  <select
                      value={cameraId}
                      onChange={(e) => setCameraId(e.target.value)}
                      className="bg-transparent border p-2 rounded w-full sm:w-auto"
                  >
                      <option value="">Select Camera ID</option>
                      {cameraOptions.map((id, index) => (
                          <option key={index} value={id}>{id}</option>
                      ))}
                  </select>

                  {/* Anomaly Type Dropdown */}
                  <select
                      value={anomalyType}
                      onChange={(e) => setAnomalyType(e.target.value)}
                      className="bg-transparent border p-2 rounded w-full sm:w-auto"
                  >
                      <option value="">Select Anomaly Type</option>
                      {anomalyOptions.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                      ))}
                  </select>
          <input
            type="date"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="bg-transparent border p-2 rounded w-full sm:w-auto"
          />
          <button
            onClick={handleFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Filter
          </button>
        </div>

        {/* Alerts List */}
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : alerts.length === 0 ? (
          <p className="text-gray-500">No alerts found.</p>
        ) : (
          <ul className="space-y-6">
            {alerts.map((alert, index) => (
              <li
                key={index}
                className="border p-4 rounded shadow-md dark:bg-gray-900"
              >
                <p><strong>Camera ID:</strong> {alert.camera_id}</p>
                <p><strong>Timestamp:</strong> {alert.timestamp}</p>
                <p><strong>Anomaly:</strong> {alert.anomaly_type}</p>
                    <img
                        src={`http://localhost:8000/${formatImagePath(alert.frame_path, alert.timestamp)}`}
                        alt="Alert Frame"
                        className="mt-2 w-full max-w-md rounded"
                    />

              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
