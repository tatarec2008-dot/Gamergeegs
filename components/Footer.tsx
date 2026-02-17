
import React from 'react';

interface FooterProps {
  authors: string[];
}

const Footer: React.FC<FooterProps> = ({ authors }) => {
  return (
    <footer className="bg-emerald-50 border-t-2 border-emerald-100 p-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h3 className="text-emerald-800 font-bold mb-4 uppercase tracking-tighter">Авторы проекта • 11 "Д" Класс</h3>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {authors.map((author, index) => (
            <span key={index} className="text-emerald-700 font-medium hover:text-emerald-900 transition-colors cursor-default">
              {author}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
