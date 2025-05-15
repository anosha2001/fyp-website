import React, { useEffect, useState } from "react";

interface Alert {
  camera_id: string;
  timestamp: string;
  anomaly_type: string;
  frame_path: string;
}

const AlertsList: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("http://localhost:8000/alerts");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data: Alert[] = await response.json();
        setAlerts(data);
      } catch (err: any) {
        console.error("Error fetching alerts:", err);
        setError("Failed to load alerts");
      }
    };

    fetchAlerts();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Surveillance Alerts</h2>
      {alerts.length === 0 ? (
        <p>No alerts found.</p>
      ) : (
        <ul>
          {alerts.map((alert, index) => (
            <li key={index}>
              <p><strong>Camera ID:</strong> {alert.camera_id}</p>
              <p><strong>Timestamp:</strong> {alert.timestamp}</p>
              <p><strong>Anomaly:</strong> {alert.anomaly_type}</p>
              <img
                src={`http://localhost:8000/${alert.frame_path}`}
                alt="Alert Frame"
                width="300"
              />
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlertsList;
