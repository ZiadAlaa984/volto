import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <Navbar />
        <div className=" w-full max-w-5xl  mx-auto p-3 px-5 flex flex-col gap-20 ">
          {children}
        </div>

        <Footer />
      </div>
    </main>
  );
}
