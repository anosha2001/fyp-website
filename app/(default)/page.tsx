'use client';

// export const metadata = {
//   title: "Home - Open PRO",
//   description: "Page description",
// };

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/hero-home";
import Workflows from "@/components/workflows";
import Features from "@/components/features";
import Testimonials from "@/components/testimonials";
import Cta from "@/components/cta";
import Screens from "@/components/screens";
import { useCameraContext } from "@/context/CameraContext";
import Navbar from "@/components/ui/navbar";

export default function Home() {
//   const cameras: { id: number; status: 'Active' | 'Inactive' | 'Alert'; feed: string }[] = [
//     { id: 1, status: 'Active', feed: 'http://192.168.38.24:8080/video' },
//     { id: 2, status: 'Active', feed: 'http://192.168.38.179:8080/video' },
//     { id: 3, status: 'Inactive', feed: 'https://via.placeholder.com/300x150' },
//     { id: 4, status: 'Inactive', feed: 'https://via.placeholder.com/300x150' },
//     { id: 5, status: 'Inactive', feed: 'https://via.placeholder.com/300x150' },
//     { id: 6, status: 'Inactive', feed: 'https://via.placeholder.com/300x150' },
// ];
  const { cameras } = useCameraContext();

  return (
    <>
      <Navbar/>
      <PageIllustration />
      <Screens cameras={cameras} />
      {/* <Hero /> */}
      {/* <Workflows /> */}
      {/* <Features /> */}
      {/* <Testimonials /> */}
      {/* <Cta /> */}
    </>
  );
}
