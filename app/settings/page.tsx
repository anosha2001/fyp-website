// app/settings/page.tsx
'use client';

import Navbar from "@/components/ui/navbar";
import PageIllustration from "@/components/page-illustration";
import { useCameraContext } from "@/context/CameraContext";
import { useState } from "react";

export default function Settings() {
  const { addCamera, cameras, removeCamera } = useCameraContext();
  const [feed, setFeed] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive' | 'Alert'>('Inactive');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feed) return;
    addCamera({ feed, status: 'Active' });
    setFeed('');
    // setStatus('Inactive');
  };

  return (
    <>
    <Navbar/>
    <PageIllustration/>
    <div className="p-6 max-w-xl mx-auto h-[90vh] flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Add Camera</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={feed}
          onChange={(e) => setFeed(e.target.value)}
          placeholder="Camera feed URL"
          className="w-full p-2 border rounded bg-transparent"
        />
        {/* <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="w-full p-2 border rounded bg-transparent"
        >
          <option value="Active" className="bg-transparent">Active</option>
          <option value="Inactive" className="bg-transparent">Inactive</option>
          <option value="Alert" className="bg-transparent">Alert</option>
        </select> */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </form>

      <h3 className="text-xl font-semibold mt-8">Current Cameras</h3>
      <ul className="mt-4 space-y-2 max-h-96 overflow-y-auto pr-2">
        {cameras.map((camera) => (
          <li key={camera.id} className="border p-2 rounded flex justify-between items-center">
            <div>
              <p><strong>ID:</strong> {camera.id}</p>
              <p><strong>Status:</strong> {camera.status}</p>
              <p><strong>Feed:</strong> {camera.feed}</p>
            </div>
            <button
              onClick={() => removeCamera(camera.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}
