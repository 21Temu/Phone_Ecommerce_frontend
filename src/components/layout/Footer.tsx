export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} PhoneStore. All rights reserved.
      </div>
    </footer>
  );
}