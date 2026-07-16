export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted">
        © {new Date().getFullYear()} Travelio. All rights reserved.
      </div>
    </footer>
  );
}
