export default function Footer() {
  return (
    <footer className="border-t border-slate-800">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Travelio. All rights reserved.
      </div>
    </footer>
  );
}
