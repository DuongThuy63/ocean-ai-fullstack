function Footer() {
  return (
    <footer className="footer-bottom w-full py-3 bg-black border-t border-gray-800 text-center text-gray-400">
      &copy; {new Date().getFullYear()} Ocean AI. All rights reserved.
    </footer>
  );
}

export default Footer;
