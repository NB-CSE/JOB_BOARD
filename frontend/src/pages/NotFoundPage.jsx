import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] bg-[#F7F7F2] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-zinc-200 p-10 max-w-md text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-[#C5F36A] text-[#242424] font-black text-2xl flex items-center justify-center mx-auto">
          404
        </div>
        <h2 className="text-2xl font-extrabold text-[#242424]">Page Not Found</h2>
        <p className="text-xs text-zinc-500 leading-relaxed">
          The page you are looking for doesn't exist or may have been moved.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#242424] text-[#C5F36A] font-bold text-xs hover:bg-black transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
