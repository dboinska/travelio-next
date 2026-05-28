import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col text-white">
      <Navbar />

      <main className="container mx-auto flex-1 px-4 py-10">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}
