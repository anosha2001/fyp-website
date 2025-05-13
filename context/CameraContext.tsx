// context/CameraContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export type Camera = { id: number; status: 'Active' | 'Inactive' | 'Alert'; feed: string };

interface CameraContextType {
  cameras: Camera[];
  addCamera: (camera: Omit<Camera, 'id'>) => void;
  removeCamera: (id: number) => void;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider = ({ children }: { children: React.ReactNode }) => {
  const [cameras, setCameras] = useState<Camera[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cameras');
    if (saved) setCameras(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cameras', JSON.stringify(cameras));
  }, [cameras]);

  const addCamera = (camera: Omit<Camera, 'id'>) => {
    const newCamera = { id: Date.now(), ...camera };
    setCameras((prev) => [...prev, newCamera]);
  };

  const removeCamera = (id: number) => {
    setCameras((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CameraContext.Provider value={{ cameras, addCamera, removeCamera }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) throw new Error("useCameraContext must be used within CameraProvider");
  return context;
};
