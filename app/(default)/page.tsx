export const metadata = {
  title: "Home - Open PRO",
  description: "Page description",
};

import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/hero-home";
import Workflows from "@/components/workflows";
import Features from "@/components/features";
import Testimonials from "@/components/testimonials";
import Cta from "@/components/cta";
import Screens from "@/components/screens";
import Navbar from "@/components/ui/navbar";

export default function Home() {
  const cameras: { id: number; status: 'Active' | 'Inactive' | 'Alert'; feed: string }[] = [
    { id: 1, status: 'Active', feed: 'http://192.168.18.178:8080/video' },
    { id: 2, status: 'Inactive', feed: 'https://via.placeholder.com/300x150' },
    { id: 3, status: 'Alert', feed: 'https://via.placeholder.com/300x150' },
    { id: 4, status: 'Active', feed: 'https://via.placeholder.com/300x150' },
    { id: 5, status: 'Inactive', feed: 'https://via.placeholder.com/300x150' },
    { id: 6, status: 'Active', feed: 'https://via.placeholder.com/300x150' },
];

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
