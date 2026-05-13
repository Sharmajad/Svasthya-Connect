import React, { useState, useEffect, useRef } from 'react';
import { Star, StarHalf, ChevronLeft, ChevronRight, MapPin, ShieldCheck, Sparkles, Building } from 'lucide-react';

const HospitalCard = ({ hospital, onSelect, isSelected }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [`https://picsum.photos/seed/${hospital._id}/600/400`];
  
  const carouselRef = useRef(null);

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase tracking-widest">New</span>;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={12} className="text-yellow-400 fill-current" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} size={12} className="text-yellow-400 fill-current" />);
      } else {
        stars.push(<Star key={i} size={12} className="text-gray-200 fill-current" />);
      }
    }
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-[10px] font-black text-gray-400 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div 
      onClick={() => onSelect(hospital)}
      className={`group relative bg-white rounded-[32px] border-2 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full ${
        isSelected ? 'border-teal-600 shadow-2xl shadow-teal-100 scale-[1.02]' : 'border-gray-50 hover:border-teal-200 hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      {/* ICON HEADER SECTION */}
      <div className="relative h-48 bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[32px] flex items-center justify-center border border-white/20 shadow-2xl">
          <Building size={48} className="text-white" />
        </div>
        
        {/* TOP BADGE */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-sm border border-white">
            <ShieldCheck size={14} className="text-teal-600" />
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-700">Verified</span>
          </div>
        </div>
      </div>

      {/* CONTENT MIDDLE SECTION */}
      <div className="p-6 flex-1 flex flex-col gap-4">
        <div className="space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="font-black text-xl text-gray-900 leading-tight group-hover:text-teal-600 transition-colors">
              {hospital.name}
            </h3>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin size={12} className="text-teal-500" />
              <span className="text-xs font-bold">{hospital.city}</span>
            </div>
            {renderStars(hospital.rating)}
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-auto space-y-4">
          <p className="text-xs text-gray-500 font-medium leading-relaxed truncate opacity-80">
            {hospital.address || "Modern medical facilities with expert care."}
          </p>

          <button 
            className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
              isSelected 
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' 
                : 'bg-gray-50 text-gray-400 group-hover:bg-teal-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-teal-50'
            }`}
          >
            {isSelected ? (
              <>Selected Facility <ShieldCheck size={14} /></>
            ) : (
              <>Book Appointment <Sparkles size={14} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;
