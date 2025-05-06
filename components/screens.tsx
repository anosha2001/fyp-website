// import React from 'react';

// type CameraStatus = 'Active' | 'Inactive' | 'Alert';

// type ScreensProps = {
//     cameras: { id: number; status: CameraStatus; feed: string }[];
// };

// export default function Screens({ cameras }: ScreensProps) {
//     const gridSize = Math.ceil(Math.sqrt(cameras.length)); // Dynamic grid size calculation

//     return (
//         <section
//         className={`grid gap-6 mx-auto py-12 my-8`}
//         style={{
//             width: '80%',
//             gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
//         }}
//     >
//             {cameras.map((camera) => (
//                 <div
//                     key={camera.id}
//                     className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
//                 >
//                     {/* Camera feed */}
//                     <div className="h-40 overflow-hidden">
//                         <img
//                             src={camera.feed}
//                             alt={`Camera ${camera.id}`}
//                             className="w-full h-full object-cover"
//                         />
//                     </div>
//                     {/* Camera label and status */}
//                     <div className="flex justify-between items-center p-4 text-white text-sm">
//                         <span className="font-semibold">Camera {camera.id}</span>
//                         <span
//                             className={`font-semibold ${
//                                 camera.status === 'Active'
//                                     ? 'text-green-400'
//                                     : camera.status === 'Inactive'
//                                     ? 'text-red-400'
//                                     : 'text-yellow-400'
//                             }`}
//                         >
//                             {camera.status}
//                         </span>
//                     </div>
//                 </div>
//             ))}
//         </section>
//     );
// }


'use client';

import React, { useEffect, useRef,useState } from 'react';

type CameraStatus = 'Active' | 'Inactive' | 'Alert';

type ScreensProps = {
  cameras: { id: number; status: CameraStatus; feed: string }[];
};

export default function Screens({ cameras }: ScreensProps) {
  // const wsRef = useRef<WebSocket | null>(null);
  // const [alerts, setAlerts] = useState<{ id: string; message: string }[]>([]);
  // const [predictions, setPredictions] = useState<{ [key: string]: string }>({}); // Store predictions by camera ID

  // useEffect(() => {
  //   // Initialize WebSocket
  //   wsRef.current = new WebSocket("ws://127.0.0.1:8000/ws");

  //   wsRef.current.onopen = () => alert("WebSocket connected.");
  //   wsRef.current.onerror = (error) => console.error("WebSocket error:", error);
  //   wsRef.current.onclose = () => alert("WebSocket disconnected.");

  //   // Listen for messages from the backend (alerts or predictions)
  //   wsRef.current.onmessage = (event) => {
  //     const message = JSON.parse(event.data);
  //     if (message.alert) {
  //       setAlerts((prev) => [...prev, { id: message.camera_id, message: message.alert }]); // Append new alert
  //     } else if (message.predicted_label) {
  //       setPredictions((prev) => ({
  //         ...prev,
  //         [message.camera_id]: message.predicted_label, // Store prediction per camera
  //       }));
  //     }
  //   };

  //   // Start sending frames (simulating periodic frame sends) every 0.3 seconds for the first active camera
  //   const interval = setInterval(() => captureFrame(), 100); // 0.3s interval for frame capture

  //   return () => {
  //     clearInterval(interval);
  //     wsRef.current?.close();
  //   };
  // }, []);

  // const captureFrame = () => {
  //   const ws = wsRef.current;
  
  //   if (ws && ws.readyState === WebSocket.OPEN) {
  //     console.log("Sending camera feed via WebSocket...");
  
  //     // Dynamically get the first active camera feed elements
  //     const activeCamera = cameras.find(camera => camera.status === 'Active');
  //     if (!activeCamera) {
  //       console.error("No active camera found.");
  //       return;
  //     }
  
  //     // Check if the camera feed image is available
  //     const imgElement = document.getElementById(`camera-feed-${activeCamera.id}`) as HTMLImageElement;
  //     if (!imgElement) {
  //       console.error("Image element not found.");
  //       return;
  //     }
  
  //     // Ensure CORS is set correctly for the image element
  //     imgElement.crossOrigin = 'Anonymous'; // Enable CORS if not already set
  
  //     // Create a canvas to draw the current video frame
  //     const canvas = document.createElement("canvas");
  //     const context = canvas.getContext("2d");
  //     if (!context) {
  //       console.error("Failed to get canvas context.");
  //       return;
  //     }
  
  //     // Set canvas size to match the image size
  //     canvas.width = imgElement.width;
  //     canvas.height = imgElement.height;
  
  //     // Draw the image onto the canvas
  //     context.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
  
  //     ws.send(JSON.stringify({ camera_id: activeCamera.id }));
  //     // Convert canvas image to Blob (binary data)
  //     canvas.toBlob((blob) => {
  //       if (blob) {
  //         const reader = new FileReader();
  //         reader.onloadend = () => {
  //           const arrayBuffer = reader.result;
  //           if (arrayBuffer !== null) {  // Ensure it's not null before sending
  //             ws.send(arrayBuffer); // Send binary frame data via WebSocket
  //           } else {
  //             console.error("Failed to read Blob as ArrayBuffer.");
  //           }
  //         };
  //         reader.readAsArrayBuffer(blob); // Convert Blob to ArrayBuffer
  //       } else {
  //         console.error("Failed to convert canvas to Blob.");
  //       }
  //     });
  //   } else {
  //     console.error("WebSocket is not open.");
  //   }
  // };

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
  

  const gridSize = Math.ceil(Math.sqrt(cameras.length)); // Dynamic grid size calculation

  return (
    <div className="flex flex-col items-center">
    <section
      className={`grid gap-6 mx-auto py-12 my-8`}
      style={{
        width: '80%',
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
      }}
    >
      {cameras.map((camera) => (
        // <div key={camera.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        //   {/* Camera feed */}
        //   <div className="h-40 overflow-hidden">
        //     {camera.status === 'Active' ? (
        //       <img
        //         id={`camera-feed-${camera.id}`} // Give each image a unique id
        //         src={camera.feed}
        //         alt={`Camera ${camera.id}`}
        //         className="w-full h-full object-cover"
        //       />
              
        //     ) : (
        //       <img
        //         src={camera.feed}
        //         alt={`Camera ${camera.id}`}
        //         className="w-full h-full object-cover"
        //       />
        //     )}
        //   </div>
        //   {/* Camera label and status */}
        //   <div className="flex justify-between items-center p-4 text-white text-sm">
        //     <span className="font-semibold">Camera {camera.id}</span>
        //     <span
        //       className={`font-semibold ${
        //         camera.status === 'Active'
        //           ? 'text-green-400'
        //           : camera.status === 'Inactive'
        //           ? 'text-red-400'
        //           : 'text-yellow-400'
        //       }`}
        //     >
        //       {camera.status}
        //     </span>
        //   </div>
        // </div>
        <div key={camera.id} className={`rounded-xl p-4 shadow-lg border-2 ${camera.status === 'Alert' ? 'border-red-500' : 'border-gray-300'}`}>
          <h3 className="text-xl font-bold mb-2">Camera {camera.id}</h3>
          <img
            id={`camera-feed-${camera.id}`}
            src={camera.feed}
            alt={`Camera ${camera.id}`}
            crossOrigin="anonymous"
            className="rounded w-full object-cover h-48"
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
