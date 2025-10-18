export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-600">
        © {new Date().getFullYear()} mybrandname. All rights reserved.
      </div>
    </footer>
  );
}
