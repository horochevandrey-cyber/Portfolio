import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface MobileMenuProps {
  onNavigate: (id: string) => void;
}

export function MobileMenu({ onNavigate }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (id: string) => {
    // Небольшая задержка чтобы меню успело закрыться
    setTimeout(() => {
      onNavigate(id);
    }, 100);
    setIsOpen(false);
  };

  // Блокируем скролл когда меню открыто и компенсируем ширину скроллбара
  useEffect(() => {
    if (isOpen) {
      // Сохраняем текущий отступ
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Кнопка бургера */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 hover:border-white/40 transition-all duration-300 z-50 relative flex-shrink-0"
        aria-label="Меню"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Полноэкранное меню */}
      <div
        className={`fixed inset-0 bg-[#171717]/98 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        <nav className="flex flex-col items-center gap-6 relative z-50">
          <button
            onClick={() => handleNavigate("hero")}
            className="text-2xl font-bold text-white hover:text-gray-300 transition-colors relative group"
          >
            Главная
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
          </button>
          <button
            onClick={() => handleNavigate("projects")}
            className="text-2xl font-bold text-white hover:text-gray-300 transition-colors relative group"
          >
            Проекты
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
          </button>
          <button
            onClick={() => handleNavigate("about")}
            className="text-2xl font-bold text-white hover:text-gray-300 transition-colors relative group"
          >
            О себе
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
          </button>
          <button
            onClick={() => handleNavigate("skills")}
            className="text-2xl font-bold text-white hover:text-gray-300 transition-colors relative group"
          >
            Навыки
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
          </button>
          <button
            onClick={() => handleNavigate("process")}
            className="text-2xl font-bold text-white hover:text-gray-300 transition-colors relative group"
          >
            Процесс
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
          </button>
          <button
            onClick={() => handleNavigate("contact")}
            className="text-2xl font-bold text-white hover:text-gray-300 transition-colors relative group"
          >
            Контакты
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
          </button>
        </nav>

        {/* Декоративные элементы */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>
    </>
  );
}
