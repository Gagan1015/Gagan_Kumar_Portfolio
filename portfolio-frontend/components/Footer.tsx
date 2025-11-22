import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black dark:bg-black text-white py-20 px-6 md:px-12 border-t border-neutral-900 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-6">
            <h2 className="font-display text-3xl md:text-5xl tracking-tighter leading-none mb-8">
              LET'S BUILD<br />SOMETHING<br />SHARP.
            </h2>
            <a 
              href="mailto:hello@alexsterling.dev" 
              className="inline-block border border-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              Get in Touch
            </a>
          </div>
          
          <div className="md:col-span-3 md:col-start-8 space-y-6">
            <div>
              <h4 className="text-neutral-500 text-xs uppercase tracking-widest mb-4">Social</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-neutral-400 transition-colors">Twitter / X</a></li>
                <li><a href="#" className="text-sm hover:text-neutral-400 transition-colors">LinkedIn</a></li>
                <li><a href="#" className="text-sm hover:text-neutral-400 transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
           
           <div className="md:col-span-2 space-y-6">
            <div>
              <h4 className="text-neutral-500 text-xs uppercase tracking-widest mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><span className="text-sm text-neutral-600">© 2024</span></li>
                <li><span className="text-sm text-neutral-600">All Rights Reserved</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};