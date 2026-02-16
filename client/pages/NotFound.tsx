import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Sparkles } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate glow position relative to center
  const glowX = (mousePosition.x / window.innerWidth - 0.5) * 20;
  const glowY = (mousePosition.y / window.innerHeight - 0.5) * 20;

  return (
    <div className="min-h-screen bg-[#171717] text-white overflow-hidden relative flex items-center justify-center">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Mouse-following Glow */}
      <div
        className="absolute w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl transition-transform duration-300 ease-out pointer-events-none"
        style={{
          left: mousePosition.x - 300,
          top: mousePosition.y - 300,
        }}
      />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center max-w-2xl mx-auto"
           style={{
             transform: `perspective(1000px) rotateX(${glowY * 0.05}deg) rotateY(${glowX * 0.05}deg)`,
             transition: 'transform 0.3s ease-out'
           }}>
        
        {/* Animated 404 Number */}
        <div className="relative">
          <h1 className="text-[120px] md:text-[200px] lg:text-[280px] font-bold leading-none select-none">
            <span className="bg-gradient-to-b from-white via-gray-400 to-gray-600 bg-clip-text text-transparent animate-float">
              404
            </span>
          </h1>
          
          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 md:-right-8 animate-spin-slow">
            <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-white/30" />
          </div>
          <div className="absolute -bottom-4 -left-4 md:-left-8 animate-spin-slow" style={{ animationDirection: 'reverse' }}>
            <Sparkles className="w-6 h-6 md:w-10 md:h-10 text-white/20" />
          </div>
        </div>

        {/* Error Message */}
        <div className="flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F8F8F8]">
            Упс! Страница не найдена
          </h2>
          <p className="text-base md:text-lg text-[#CFCFCF] leading-relaxed">
            Похоже, вы заблудились в цифровом пространстве. 
            <br />
            Не волнуйтесь, даже лучшие дизайнеры иногда теряются!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => navigate(-1)}
            className="group px-6 py-3 md:px-8 md:py-4 rounded-[20px] bg-white/10 border border-white/30 text-white text-base md:text-lg font-semibold hover:bg-white/20 hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Назад
          </button>
          <button
            onClick={() => navigate("/")}
            className="group px-6 py-3 md:px-8 md:py-4 rounded-[20px] bg-white text-black text-base md:text-lg font-semibold hover:bg-white/90 hover:shadow-[0_10px_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            На главную
          </button>
        </div>

        {/* Fun Fact / Easter Egg */}
        <div className="mt-8 px-6 py-4 rounded-[16px] bg-white/5 border border-white/10 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm md:text-base text-[#A0A0A0]">
            💡 <span className="text-[#CFCFCF]">Факт:</span> Эта страница могла бы быть крутым 404 дизайном... 
            <br className="hidden md:block" />
            но мы оставили её минималистичной, чтобы вы скорее вернулись к портфолио!
          </p>
        </div>
      </div>

      {/* Bottom Decoration Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
};

export default NotFound;
