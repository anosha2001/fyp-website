'use client';

import React, { useEffect, useRef,useState } from 'react';

type CameraStatus = 'Active' | 'Inactive' | 'Alert';

type ScreensProps = {
  cameras: { id: number; status: CameraStatus; feed: string }[];
};

export default function Screens({ cameras }: ScreensProps) {

  const wsRefs = useRef<{ [key: number]: WebSocket }>({});
  const [alerts, setAlerts] = useState<{ id: number; message: string; timestamp: string }[]>([]);
  const [predictions, setPredictions] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const activeCameras = cameras.filter((camera) => camera.status === "Active");

    activeCameras.forEach((camera) => {
      const ws = new WebSocket("ws://127.0.0.1:8000/ws");
      wsRefs.current[camera.id] = ws;

      ws.onopen = () => {
        console.log(`WebSocket connected for camera ${camera.id}`);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.alert) {
          setAlerts((prev) => [...prev, { id: camera.id, message: message.alert, timestamp:message.timestamp }]);
        } else if (message.predicted_label) {
          setPredictions((prev) => ({
            ...prev,
            [camera.id]: message.predicted_label,
          }));
        }
      };

      ws.onerror = (error) => console.error(`WebSocket error for camera ${camera.id}:`, error);
      ws.onclose = () => console.log(`WebSocket disconnected for camera ${camera.id}`);
    });

    // Start sending frames per active camera
    const intervals = activeCameras.map((camera) => {
      return setInterval(() => sendFrame(camera.id), 100); // ~10 FPS per camera
    });

    return () => {
      activeCameras.forEach((camera) => {
        wsRefs.current[camera.id]?.close();
      });
      intervals.forEach(clearInterval);
    };
  }, [cameras]);

  const sendFrame = (cameraId: number) => {
    const ws = wsRefs.current[cameraId];
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const imgElement = document.getElementById(`camera-feed-${cameraId}`) as HTMLImageElement;
    if (!imgElement) return;

    imgElement.crossOrigin = "Anonymous";
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    context.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

    // Send camera ID
    ws.send(JSON.stringify({ camera_id: cameraId }));

    // Send frame
    canvas.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            ws.send(reader.result);
          }
        };
        reader.readAsArrayBuffer(blob);
      }
    });
  };
  

  const gridSize = Math.ceil(Math.sqrt(cameras.length)); // Ensures square-ish layout

  return (
    <div className="flex flex-col items-center">
      <section
        className="grid gap-6 mx-auto py-12 my-8"
        style={{
          width: '80%',
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
      >
      {cameras.map((camera) => (
        <div key={camera.id} 
        className={`rounded-xl p-4 shadow-lg border-2`}>
          <h3 className="text-base font-bold mb-2">Camera {camera.id}</h3>
          <img
            id={`camera-feed-${camera.id}`}
            src={camera.feed}
            alt={`Camera ${camera.id}`}
            crossOrigin="anonymous"
            className="rounded aspect-square"
          />
          <p className="text-sm text-gray-600">Status: <span className="font-semibold">{camera.status}</span></p>
          {predictions[camera.id] && (
            <p className="text-sm">Prediction: <span className="font-medium">{predictions[camera.id]}</span></p>
          )}
          {/* Scrollable alerts list */}
          <div className="mt-2 max-h-24 overflow-y-auto">
            {alerts
              .filter((alert) => alert.id === camera.id)
              .map((alert, idx) => (
                <div key={idx} className="text-red-600 font-semibold text-sm mb-1">
                  {alert.message}
                  <br />
                  <span className="text-xs text-gray-500">Time: {alert.timestamp}</span>
                </div>
              ))}
          </div>
</div>
      ))}
    </section>

    {/* Alerts Section */}
<div className="w-full max-w-3xl mt-8 p-4 rounded-lg shadow-lg bg-[#1a1d29] text-white">
  <h2 className="text-xl font-bold text-red-500 text-center">Alerts</h2>
  <div className="mt-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
    {alerts.length === 0 ? (
      <p className="text-gray-400 text-center">No alerts detected</p>
    ) : (
      <ul className="space-y-2">
        {alerts.map((alert, index) => (
          <li key={index} className="p-3 rounded-md shadow-sm bg-[#2b2f3a]">
            <span className="font-semibold text-yellow-400">Camera {alert.id}:</span> 
            <span className="ml-2 text-gray-300">{alert.message}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>

  </div>
  );
}
