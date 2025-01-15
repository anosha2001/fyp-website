import React from 'react';

type CameraStatus = 'Active' | 'Inactive' | 'Alert';

type ScreensProps = {
    cameras: { id: number; status: CameraStatus; feed: string }[];
};

export default function Screens({ cameras }: ScreensProps) {
    const gridSize = Math.ceil(Math.sqrt(cameras.length)); // Dynamic grid size calculation

    return (
        <section
        className={`grid gap-6 mx-auto py-12 my-8`}
        style={{
            width: '80%',
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
    >
            {cameras.map((camera) => (
                <div
                    key={camera.id}
                    className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                >
                    {/* Camera feed */}
                    <div className="h-40 overflow-hidden">
                        <img
                            src={camera.feed}
                            alt={`Camera ${camera.id}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Camera label and status */}
                    <div className="flex justify-between items-center p-4 text-white text-sm">
                        <span className="font-semibold">Camera {camera.id}</span>
                        <span
                            className={`font-semibold ${
                                camera.status === 'Active'
                                    ? 'text-green-400'
                                    : camera.status === 'Inactive'
                                    ? 'text-red-400'
                                    : 'text-yellow-400'
                            }`}
                        >
                            {camera.status}
                        </span>
                    </div>
                </div>
            ))}
        </section>
    );
}
