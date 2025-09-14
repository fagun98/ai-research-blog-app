import { BRAND_NAME, TAGLINE } from "@/lib/constants";

export function Intro() {
  return (
    <section className="text-center mt-16 mb-20 md:mb-24">
      {/* Main Brand Section */}
      <div className="max-w-4xl mx-auto">
        {/* Brand Name */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-tight text-slate-900 dark:text-slate-100 mb-6">
          {BRAND_NAME}
        </h1>
        
        {/* Decorative Line */}
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-8 rounded-full"></div>
        
        {/* Tagline */}
        <h2 className="text-xl md:text-2xl lg:text-3xl text-slate-600 dark:text-slate-400 font-light leading-relaxed max-w-3xl mx-auto mb-8">
          {TAGLINE}
        </h2>
        
        {/* Subtle Description */}
        <p className="text-lg text-slate-500 dark:text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Join our community of AI enthusiasts and stay updated with the latest research explained in simple, accessible language.
        </p>
      </div>
      
      {/* Visual Elements */}
      <div className="mt-12 flex items-center justify-center gap-8 opacity-30">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      </div>
    </section>
  );
}
