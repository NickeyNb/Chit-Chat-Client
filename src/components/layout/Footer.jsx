import React from "react";

const Footer = () => {
  return (
    <div className="bg-black py-4 text-center text-white">
      <div className="container mx-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} Chit-Chat. All rights reserved.
        </p>
        <p className="mt-2 text-sm">
          Made with ❤️ by <a href="https://yourwebsite.com">Your Name</a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
