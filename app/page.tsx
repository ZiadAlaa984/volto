import Hero from "@/components/hero";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen  flex flex-col items-center">
      <div className="flex-1 w-full   flex flex-col gap-5 md:gap-20 ">
        <Navbar />
        <div className=" w-full max-w-5xl mx-auto p-3 px-5 flex flex-col gap-20 ">
          <Hero />
        </div>
        <Footer />
      </div>
    </main>
  );
}
