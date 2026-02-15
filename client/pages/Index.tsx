import React from 'react';

export default function Index() {
  const [formData, setFormData] = React.useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [emailCopied, setEmailCopied] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer для анимаций при скролле
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Наблюдаем за всеми элементами с классом animate-on-scroll
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const smoothScroll = (target: number, duration: number = 500) => {
    const start = window.scrollY || document.documentElement.scrollTop;
    const distance = target - start;
    const startTime = performance.now();

    const ease = (t: number): number => {
      // easeInOutCubic easing function
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentScroll = start + distance * ease(progress);

      window.scrollTo(0, currentScroll);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      smoothScroll(elementPosition - 80); // 80px offset for header
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('https://formspree.io/f/xwpkevon', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        alert('Спасибо! Ваше сообщение отправлено.');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
    }
    setIsSubmitting(false);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('horochevandrey@gmail.com');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <div className="bg-[#171717] text-white overflow-x-hidden">
      {/* Sticky Header on Scroll */}
      <header className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 lg:px-[260px] py-4 md:py-6 flex justify-between items-center transition-all duration-200 ${
        isScrolled 
          ? 'bg-[#171717]/95 backdrop-blur-md border-b border-[#313131] shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className={`text-sm md:text-base font-bold transition-opacity duration-200 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>Andrey Horochev</div>
        <nav className={`hidden md:flex gap-8 transition-opacity duration-200 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
          <button onClick={() => scrollToSection('projects')} className="text-sm font-medium hover:text-white transition-colors">Проекты</button>
          <button onClick={() => scrollToSection('skills')} className="text-sm font-medium hover:text-white transition-colors">Навыки</button>
          <button onClick={() => scrollToSection('contact')} className="text-sm font-medium hover:text-white transition-colors">Контакт</button>
        </nav>
      </header>

      {/* Regular Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 lg:px-[260px] py-4 md:py-8 flex justify-between items-center transition-all duration-200" style={{
        opacity: isScrolled ? 0 : 1,
        pointerEvents: isScrolled ? 'none' : 'auto'
      }}>
        <div className="text-sm md:text-base font-bold">Andrey Horochev</div>
        <div className="text-xs md:text-base font-bold hidden md:block">horochevandrey@gmail.com</div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen md:h-[1080px] overflow-hidden flex items-center justify-center section-centered">
        {/* Background Image with Blur */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url(https://api.builder.io/api/v1/image/assets/TEMP/6974cf6cc7ac95437e5f301c41c607b58af75ed6?width=3840)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(12.5px)',
          }}
        />
        
        {/* Dark overlay with blur */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[1074px] h-[70%] md:h-[766px] bg-black/60" style={{ filter: 'blur(50px)' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 md:gap-[60px] max-w-[895px] px-4 md:px-8">
          {/* Available Badge */}
          <div className="px-[15px] py-[14px] rounded-[15px] bg-white/10">
            <span className="text-[#F8F8F8] text-sm md:text-base font-normal">Доступен для новых проектов</span>
          </div>

          {/* Main Heading and Subheading */}
          <div className="flex flex-col gap-[10px] w-full animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-[96px] font-bold text-[#F8F8F8] text-center leading-none">
              Создаю цифровые впечатления
            </h1>
            <h2 className="text-lg md:text-2xl lg:text-[32px] text-[#F8F8F8] text-center leading-none mt-2 md:mt-0">
              <span className="font-normal">Привет! Я </span>
              <span className="font-bold">Андрей Хорошев</span>
              <span className="font-normal">, веб-дизайнер</span>
            </h2>
            <p className="text-base md:text-xl lg:text-2xl text-[#CFCFCF] text-center leading-[150%] mt-4">
              Специализируюсь на создании современных и функциональных интерфейсов, которые решают бизнес-задачи и радуют пользователей
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 lg:gap-[100px] w-full md:w-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <button 
              onClick={() => scrollToSection('projects')}
              className="w-full md:w-auto px-4 md:px-5 py-3 md:py-5 rounded-[25px] bg-transparent border-2 border-white text-white text-lg md:text-xl lg:text-[26px] font-bold hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              Посмотреть работы
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="w-full md:w-auto px-4 md:px-5 py-3 md:py-5 rounded-[20px] bg-white/10 border border-white/70 text-white text-lg md:text-xl lg:text-[26px] font-bold hover:bg-white/20 hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300 whitespace-nowrap"
            >
              Связаться со мной
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-4 md:px-8 lg:px-[260px] py-12 md:py-20 lg:py-[100px] flex flex-col lg:flex-row justify-between items-start gap-8 md:gap-12 section-centered">
        <div className="w-full lg:w-[711px] flex flex-col gap-8 md:gap-[61px] animate-on-scroll">
          <div className="flex flex-col gap-[35px]">
            <div className="px-5 py-[10px] rounded-[20px] bg-[#C2C2C2] inline-flex self-start shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
              <span className="text-[#171717] text-base font-normal">ОБО МНЕ</span>
            </div>
          </div>

          <div className="flex flex-col gap-8 md:gap-[58px]">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F8F8F8] leading-none">
              Делаю интерфейсы, которые продают и удерживают
            </h2>
            
            <div className="w-[257px] h-[3px] rounded-[2px] bg-[#D9D9D9]" />
            
            <p className="text-base md:text-lg lg:text-[22px] text-[#D3D3D3] leading-[150%]">
              Привет! Меня зовут Андрей. 4 года целенаправленного обучения веб-дизайну: от основ композиции и типографики до Figma mastery, user flows, accessibility и motion-дизайна.
              <br /><br />
              Всё это время - ежедневная практика на реальных кейсах (pet-проекты, редизайны популярных сервисов, учебные коммерческие задачи).
              <br /><br />
              Фокус - на том, чтобы дизайн не просто выглядел круто, а приносил пользу: повышал конверсию, упрощал онбординг, снижал отток.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-[572px] h-auto overflow-hidden rounded-[30px] md:rounded-[50px] shadow-[0_20px_40px_0_rgba(0,0,0,0.25)] flex-shrink-0 hover:shadow-[0_30px_60px_0_rgba(255,255,255,0.15)] transition-all duration-500 group animate-on-scroll opacity-0">
          <img 
            src="/images/About.png"
            alt="Andrey Horoshev"
            className="w-full h-auto object-cover display-block group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="px-4 md:px-8 lg:px-[260px] py-12 md:py-20 lg:py-[100px] section-centered">
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-[35px]">
            <div className="px-5 py-[10px] rounded-[20px] bg-[#C2C2C2] inline-flex">
              <span className="text-[#171717] text-base font-normal">ИЗБРАННЫЕ ПРОЕКТЫ</span>
            </div>
          </div>

          <div className="w-[257px] h-[3px] rounded-[2px] bg-[#D9D9D9]" />

          {/* Project Grid */}
          <div className="flex flex-col gap-4 md:gap-5 w-full mt-6 md:mt-8">
            <div className="flex flex-col lg:flex-row justify-center lg:justify-between gap-4 md:gap-5">
              <ProjectCard
                name="AM:Rent"
                year="2026"
                category="Web-design"
                image="/images/FirstProject.png"
                figmaLink="https://www.figma.com/design/mLYeS3ayi3XMqMN3tMg0qV/Aston-Martin-Rent?node-id=0-1&t=T2JHARgEnRFDoPbf-1"
              />
              <ProjectCard
                name="StroyLine"
                year="2026"
                category="Web-design"
                image="/images/SecondProject.png"
                figmaLink="https://www.figma.com/design/6IS36G8I8lRVjdRS7J234f/STROYLINE?node-id=77-485&t=T2JHARgEnRFDoPbf-1" 
              />
            </div>
            <div className="flex flex-col lg:flex-row justify-center lg:justify-between gap-4 md:gap-5">
              <ProjectCard
                name="ParkIt"
                year="2025"
                category="Mobile-App-Design"
                image="/images/ThirdProject.png"
                figmaLink="https://www.figma.com/design/6H9EblbkWg8WUqGLHCPTDp/Parkit?t=T2JHARgEnRFDoPbf-1"
              />
              <ProjectCard
                name="VolnaFest"
                year="2025"
                category="Web-Design"
                image="/images/FourthProject.png"
                figmaLink="https://www.figma.com/design/OHrdvbOQRVp13OnzNl82uf/VolnaFest?t=T2JHARgEnRFDoPbf-1"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="px-4 md:px-8 lg:px-[260px] py-12 md:py-20 lg:py-[100px] section-centered">
        <div className="flex flex-col gap-[60px] max-w-[1401px] mx-auto">
          <div className="flex flex-col gap-[35px]">
            <div className="px-5 py-[10px] rounded-[20px] bg-[#C2C2C2] inline-flex self-start">
              <span className="text-[#171717] text-base font-normal">МОИ НАВЫКИ</span>
            </div>
            <p className="text-xl md:text-2xl text-[#F8F8F8] font-normal">Мои сильные стороны в дизайне</p>
          </div>

          {/* Skills Grid */}
          <div className="flex flex-col gap-4 md:gap-5">
            {/* Row 1 */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-5">
              <SkillCard
                title="UI/UX Design"
                description="Создание интуитивных интерфейсов"
                icon={<UIUXIcon />}
              />
              <SkillCard
                title="Figma и Adobe"
                description="Лучшие инструмены для дизайна"
                icon={<FigmaIcon />}
              />
              <SkillCard
                title="HTML/CSS/JS"
                description="Понимание веб-технологий"
                icon={<CodeIcon />}
              />
            </div>
            {/* Row 2 */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-5">
              <SkillCard
                title="Responsive Design"
                description="Адаптивы для всех устройств"
                icon={<ResponsiveIcon />}
              />
              <SkillCard
                title="Design Systems"
                description="Создание масштабируемых систем"
                icon={<DesignSystemIcon />}
              />
              <SkillCard
                title="Prototyping"
                description="Быстрое прототипирование идей"
                icon={<PrototypingIcon />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="px-4 md:px-8 lg:px-[260px] py-12 md:py-20 lg:py-[100px] bg-[#1B1B1B] section-centered">
        <div className="flex flex-col gap-[60px] max-w-[1401px] mx-auto">
          <div className="flex flex-col gap-[35px]">
            <div className="px-5 py-[10px] rounded-[20px] bg-[#C2C2C2] inline-flex self-start">
              <span className="text-[#171717] text-base font-normal">МОЙ ПРОЦЕСС</span>
            </div>
            <p className="text-xl md:text-2xl text-[#F8F8F8] font-normal max-w-[600px]">Как я работаю с клиентами</p>
          </div>

          {/* Process Steps */}
          <div className="flex flex-col gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="flex gap-6 md:gap-8 group animate-on-scroll opacity-0">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center text-xl md:text-2xl font-bold flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">1</div>
                <div className="w-1 h-12 md:h-16 bg-[#313131] mt-4 group-hover:bg-white transition-colors duration-300" />
              </div>
              <div className="flex-1 pt-2 pb-8 md:pb-12 group-hover:translate-x-2 transition-transform duration-300">
                <h3 className="text-xl md:text-2xl font-semibold text-[#F8F8F8] mb-2">Discovery</h3>
                <p className="text-base md:text-lg text-[#D3D3D3] leading-[150%]">Обсуждение целей, аудитории, требований и вашего видения. Я изучаю конкурентов и создаю стратегию.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 md:gap-8 group animate-on-scroll opacity-0">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center text-xl md:text-2xl font-bold flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">2</div>
                <div className="w-1 h-12 md:h-16 bg-[#313131] mt-4 group-hover:bg-white transition-colors duration-300" />
              </div>
              <div className="flex-1 pt-2 pb-8 md:pb-12 group-hover:translate-x-2 transition-transform duration-300">
                <h3 className="text-xl md:text-2xl font-semibold text-[#F8F8F8] mb-2">Design</h3>
                <p className="text-base md:text-lg text-[#D3D3D3] leading-[150%]">Создание макетов, прототипов и интерактивных прототипов в Figma. Фокус на UX и визуальной иерархии.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 md:gap-8 group animate-on-scroll opacity-0">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center text-xl md:text-2xl font-bold flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">3</div>
                <div className="w-1 h-12 md:h-16 bg-[#313131] mt-4 group-hover:bg-white transition-colors duration-300" />
              </div>
              <div className="flex-1 pt-2 pb-8 md:pb-12 group-hover:translate-x-2 transition-transform duration-300">
                <h3 className="text-xl md:text-2xl font-semibold text-[#F8F8F8] mb-2">Feedback</h3>
                <p className="text-base md:text-lg text-[#D3D3D3] leading-[150%]">Презентация дизайна, сбор обратной связи и итерации. Все изменения согласовываются с вами.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6 md:gap-8 group animate-on-scroll opacity-0">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center text-xl md:text-2xl font-bold flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">4</div>
              </div>
              <div className="flex-1 pt-2 group-hover:translate-x-2 transition-transform duration-300">
                <h3 className="text-xl md:text-2xl font-semibold text-[#F8F8F8] mb-2">Launch</h3>
                <p className="text-base md:text-lg text-[#D3D3D3] leading-[150%]">Подготовка к разработке, передача файлов и поддержка после запуска.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-4 md:px-8 lg:px-[260px] py-12 md:py-20 lg:py-[100px] section-centered">
        <div className="flex flex-col gap-[56px] max-w-[1401px] mx-auto">
          <div className="flex flex-col items-center gap-[35px]">
            <div className="px-5 py-[10px] rounded-[20px] bg-[#C2C2C2] inline-flex">
              <span className="text-[#171717] text-base font-normal">СВЯЗЬ</span>
            </div>
            <p className="text-xl md:text-2xl text-[#F8F8F8] font-normal">Связаться со мной</p>
            <div className="w-[257px] h-[3px] rounded-[2px] bg-[#D9D9D9]" />
          </div>

          <div className="flex flex-col items-center gap-8 max-w-2xl w-full mx-auto">
            {/* Contact Form */}
            <form onSubmit={handleFormSubmit} className="w-full flex flex-col gap-6 animate-on-scroll opacity-0">
              <input
                type="text"
                name="name"
                placeholder="Ваше имя"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full px-6 py-4 rounded-[16px] bg-[#23272F] border border-white/20 text-[#F8F8F8] placeholder-[#808080] focus:border-white focus:outline-none focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] focus:ring-1 focus:ring-white/20 transition-all duration-300"
              />
              <input
                type="email"
                name="email"
                placeholder="Ваш email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full px-6 py-4 rounded-[16px] bg-[#23272F] border border-white/20 text-[#F8F8F8] placeholder-[#808080] focus:border-white focus:outline-none focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] focus:ring-1 focus:ring-white/20 transition-all duration-300"
              />
              <textarea
                name="message"
                placeholder="Ваше сообщение"
                value={formData.message}
                onChange={handleFormChange}
                rows={5}
                className="w-full px-6 py-4 rounded-[16px] bg-[#23272F] border border-white/20 text-[#F8F8F8] placeholder-[#808080] focus:border-white focus:outline-none focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] focus:ring-1 focus:ring-white/20 transition-all duration-300 resize-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 rounded-[20px] bg-white text-black font-semibold hover:bg-white/90 hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:scale-103 transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
              </button>
            </form>

            {/* Or divider */}
            <div className="w-full flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-[#313131]" />
              <span className="text-[#808080] text-sm">или</span>
              <div className="flex-1 h-px bg-[#313131]" />
            </div>

            {/* Telegram and Email Quick Links */}
            <div className="w-full flex flex-col md:flex-row gap-4 justify-center animate-on-scroll opacity-0">
              <a
                href="https://t.me/andrey8473868"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-initial px-6 py-3 rounded-[16px] bg-white text-black font-semibold hover:bg-white/90 hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition-all duration-300 text-center"
              >
                Telegram
              </a>
              <button
                onClick={handleCopyEmail}
                className="flex-1 md:flex-initial px-6 py-3 rounded-[16px] bg-[#23272F] border border-white/30 text-[#F8F8F8] font-semibold hover:border-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300 text-center"
              >
                {emailCopied ? '✓ Скопирована!' : 'Email'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1B1B1B] border-t border-[#313131] px-4 md:px-8 lg:px-[260px] py-8 md:py-10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center md:items-center justify-between gap-6 md:gap-0">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-[#F8F8F8]">Andrey Horochev</span>
            <span className="text-sm md:text-base text-[#A0A0A0] font-normal">© 2026. Все права защищены</span>
          </div>
          <div className="hidden md:block w-px h-10 bg-[#313131] mx-8" />
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <button onClick={() => scrollToSection('hero')} className="text-base md:text-lg font-medium text-[#F8F8F8] hover:text-[#C2C2C2] transition-colors">Главная</button>
            <button onClick={() => scrollToSection('projects')} className="text-base md:text-lg font-medium text-[#F8F8F8] hover:text-[#C2C2C2] transition-colors">Проекты</button>
            <button onClick={() => scrollToSection('skills')} className="text-base md:text-lg font-medium text-[#F8F8F8] hover:text-[#C2C2C2] transition-colors">Навыки</button>
            <button onClick={() => scrollToSection('contact')} className="text-base md:text-lg font-medium text-[#F8F8F8] hover:text-[#C2C2C2] transition-colors">Связь</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Skill Card Component
function SkillCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="w-full md:w-[453.667px] h-auto md:h-[255px] rounded-[20px] bg-white/8 border border-white/10 p-6 md:p-[35px] flex flex-col justify-center gap-3 md:gap-4 hover:bg-white/12 hover:border-white/30 hover:scale-103 hover:shadow-[0_10px_30px_rgba(255,255,255,0.15)] transition-all duration-300 group animate-on-scroll opacity-0">
      <div className="flex justify-center md:justify-start group-hover:[&_svg]:text-white transition-all duration-300">{icon}</div>
      <h3 className="text-xl md:text-2xl font-semibold text-[#F8F8F8] text-center md:text-left">{title}</h3>
      <p className="text-base md:text-xl text-[#F8F8F8] text-center md:text-left">{description}</p>
    </div>
  );
}

// Icon Components
function UIUXIcon() {
  return (
    <svg className="w-16 h-16 md:w-20 md:h-20" viewBox="0 0 80 80" fill="none">
      <rect width="80" height="80" rx="13" fill="url(#paint0_linear_ui)"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M52.5075 55.4444C52.5075 52.3378 51.4966 50.5014 50.3757 49.3827C48.5184 47.5287 46.1803 47.5557 46.1582 47.5557C46.1582 47.5557 44.8503 47.5526 43.5408 47.0652C42.5012 46.6773 41.3964 45.9512 41.3964 44.4005C41.3964 42.657 42.8169 41.245 44.571 41.245C48.7963 41.245 54.8636 41.245 58.6252 41.207C59.9949 41.207 61.3111 40.6026 62.2078 39.5519C63.1062 38.5027 63.4953 37.1143 63.2712 35.7543C61.3269 24.5894 51.5539 16 39.8095 16C26.6687 16 16 26.6047 16 39.6666C16 52.7286 26.6687 63.3333 39.8095 63.3333C46.0729 63.3333 49.1605 61.4179 50.7272 59.6398C52.562 57.5542 52.5081 55.4446 52.5081 55.4446L52.5075 55.4444ZM49.3329 55.4444C49.3329 55.4444 49.2502 56.9969 47.5583 58.2798C46.1377 59.3544 43.7536 60.1779 39.809 60.1779C28.4204 60.1779 19.1743 50.9872 19.1743 39.6671C19.1743 28.3469 28.4205 19.1562 39.809 19.1562C49.9897 19.1562 58.4565 26.6112 60.1402 36.2788C60.2099 36.7094 60.0831 37.1655 59.7878 37.5096C59.494 37.8536 59.0623 38.0521 58.6083 38.0521C54.8385 38.0901 48.7858 38.0901 44.5702 38.0901C41.064 38.0901 38.2209 40.916 38.2209 44.4013C38.2209 47.5835 40.2908 49.2245 42.4258 50.0199C44.2909 50.7155 46.1577 50.7124 46.1577 50.7124C46.1671 50.7124 47.2514 50.7394 48.126 51.6116C48.8274 52.3108 49.3323 53.502 49.3323 55.4456L49.3329 55.4444Z" fill="#ADADAD"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M23.1429 35.7221C23.1429 34.4158 24.2093 33.3554 25.5239 33.3554C26.8381 33.3554 27.905 34.4154 27.905 35.7221C27.905 37.0284 26.8385 38.0889 25.5239 38.0889C24.2097 38.0889 23.1429 37.0288 23.1429 35.7221ZM52.7172 28.6065C53.6458 29.5296 53.6458 31.0301 52.7172 31.9532C51.787 32.8762 50.279 32.8762 49.3488 31.9532C48.4202 31.0301 48.4202 29.5296 49.3488 28.6065C50.279 27.6819 51.787 27.6819 52.7172 28.6065ZM30.2698 25.2583C31.1984 24.3353 32.708 24.3353 33.6366 25.2583C34.5653 26.183 34.5653 27.6819 33.6366 28.6065C32.708 29.5296 31.1984 29.5296 30.2698 28.6065C29.3396 27.6819 29.3396 26.1829 30.2698 25.2583ZM42.1907 22.311C43.5048 22.311 44.5717 23.3711 44.5717 24.6778C44.5717 25.9841 43.5052 27.0446 42.1907 27.0446C40.8765 27.0446 39.8096 25.9845 39.8096 24.6778C39.8096 23.3715 40.8761 22.311 42.1907 22.311Z" fill="#ADADAD"/>
      <defs>
        <linearGradient id="paint0_linear_ui" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#303030"/>
          <stop offset="1" stopColor="#3C3C3C"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function FigmaIcon() {
  return (
    <svg className="w-16 h-16 md:w-20 md:h-20" viewBox="0 0 80 80" fill="none">
      <rect width="80" height="80" rx="13" fill="url(#paint0_linear_figma)"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M38.1986 16.2802H31.9008C28.4227 16.2802 25.6031 19.1067 25.6031 22.5934C25.6031 26.0801 28.4227 28.9066 31.9008 28.9066H38.1986V16.2802ZM38.1986 12H42.4683H48.7661C54.6026 12 59.3334 16.7428 59.3334 22.5934C59.3334 26.0459 57.6861 29.1127 55.1358 31.0467C57.6861 32.9807 59.3334 36.0475 59.3334 39.5C59.3334 45.3506 54.6026 50.0934 48.7661 50.0934C46.4063 50.0934 44.2271 49.318 42.4683 48.0075V50.0934V56.4066C42.4683 62.2572 37.7371 67 31.9008 67C26.0646 67 21.3334 62.2572 21.3334 56.4066C21.3334 52.9538 22.981 49.8873 25.531 47.9533C22.981 46.0193 21.3334 42.9525 21.3334 39.5C21.3334 36.0475 22.981 32.9807 25.5311 31.0467C22.981 29.1127 21.3334 26.0459 21.3334 22.5934C21.3334 16.7428 26.0646 12 31.9008 12H38.1986ZM42.4683 16.2802V28.9066H48.7661C52.2444 28.9066 55.0637 26.0801 55.0637 22.5934C55.0637 19.1067 52.2444 16.2802 48.7661 16.2802H42.4683ZM31.9008 45.8132H38.1986V39.5163V39.5V39.4838V33.1868H31.9008C28.4227 33.1868 25.6031 36.0133 25.6031 39.5C25.6031 42.9784 28.4092 45.7997 31.8759 45.8132L31.9008 45.8132ZM25.6031 56.4066C25.6031 52.9281 28.4092 50.1069 31.8759 50.0934L31.9008 50.0934H38.1986V56.4066C38.1986 59.8932 35.379 62.7198 31.9008 62.7198C28.4227 62.7198 25.6031 59.8932 25.6031 56.4066ZM42.4683 39.4874C42.4751 36.0065 45.2921 33.1868 48.7661 33.1868C52.2444 33.1868 55.0637 36.0133 55.0637 39.5C55.0637 42.9867 52.2444 45.8132 48.7661 45.8132C45.2921 45.8132 42.4751 42.9935 42.4683 39.5126V39.4874Z" fill="#ADADAD"/>
      <defs>
        <linearGradient id="paint0_linear_figma" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#303030"/>
          <stop offset="1" stopColor="#3C3C3C"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className="w-16 h-16 md:w-20 md:h-20" viewBox="0 0 80 80" fill="none">
      <rect width="80" height="80" rx="13" fill="url(#paint0_linear_code)"/>
      <path d="M29.381 27L15.6667 39.4615L29.381 54M49.9525 27L63.6667 39.4615L49.9525 54" stroke="#ADADAD" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="paint0_linear_code" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#303030"/>
          <stop offset="1" stopColor="#3C3C3C"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function ResponsiveIcon() {
  return (
    <svg className="w-16 h-16 md:w-20 md:h-20" viewBox="0 0 80 80" fill="none">
      <rect width="80" height="80" rx="13" fill="url(#paint0_linear_responsive)"/>
      <path d="M49.25 11H29.75C24.3652 11 20 15.3279 20 20.6667V59.3333C20 64.6721 24.3652 69 29.75 69H49.25C54.6348 69 59 64.6721 59 59.3333V20.6667C59 15.3279 54.6348 11 49.25 11Z" stroke="#ADADAD" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M39.4999 61C39.0994 61 38.7226 60.844 38.4395 60.5608C38.156 60.2773 38 59.9008 38 59.5C38 59.2024 38.0873 58.9141 38.2529 58.6666C38.4182 58.4191 38.651 58.228 38.9257 58.1143C39.1087 58.0384 39.3019 58 39.4999 58C39.598 58 39.6964 58.0096 39.7924 58.0288C40.0845 58.087 40.35 58.2289 40.5606 58.4392C40.7709 58.6498 40.9128 58.9153 40.971 59.2075C41.0292 59.4994 40.9995 59.7991 40.8855 60.0739C40.7718 60.349 40.5807 60.5818 40.3332 60.7471C40.0857 60.9127 39.7975 61 39.4999 61Z" fill="black"/>
      <path d="M39.5 63C38.5718 63 37.6814 62.6311 37.0251 61.9749C36.3689 61.3186 36 60.4282 36 59.5C36 58.8078 36.2051 58.1312 36.5897 57.5555C36.9744 56.9801 37.5211 56.5314 38.1605 56.2664C38.8 56.0015 39.5038 55.9322 40.1828 56.0673C40.8618 56.2024 41.4855 56.5356 41.9748 57.0252C42.4644 57.5145 42.7976 58.1382 42.9327 58.8172C43.0678 59.4962 42.9985 60.2 42.7336 60.8395C42.4686 61.4789 42.0199 62.0256 41.4445 62.4103C40.8688 62.7949 40.1922 63 39.5 63Z" fill="#ADADAD"/>
      <defs>
        <linearGradient id="paint0_linear_responsive" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#303030"/>
          <stop offset="1" stopColor="#3C3C3C"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function DesignSystemIcon() {
  return (
    <svg className="w-16 h-16 md:w-20 md:h-20" viewBox="0 0 80 80" fill="none">
      <rect width="80" height="80" rx="13" fill="url(#paint0_linear_system)"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M37.7789 17.6798C39.6444 16.7734 41.8399 16.7734 43.7052 17.6798L60.098 25.6454C64.1675 27.6228 64.1675 33.2668 60.098 35.2444L43.7052 43.2098C41.8399 44.1162 39.6444 44.1162 37.7789 43.2098L21.3862 35.2444C17.3166 33.2668 17.3166 27.6228 21.3862 25.6454L37.7789 17.6798ZM41.7299 21.5194C41.1081 21.2172 40.3762 21.2172 39.7544 21.5194L23.3616 29.4849C22.5477 29.8804 22.5477 31.0092 23.3616 31.4047L39.7544 39.3702C40.3762 39.6725 41.1081 39.6725 41.7299 39.3702L58.1225 31.4047C58.9366 31.0092 58.9364 29.8804 58.1225 29.4849L41.7299 21.5194Z" fill="#ADADAD"/>
      <path d="M18.5704 50.2025C19.1239 49.0956 20.4699 48.647 21.5768 49.2005L39.7399 58.2818C40.3707 58.5973 41.1133 58.5973 41.7441 58.2818L59.9071 49.2005C61.0139 48.647 62.3599 49.0956 62.9134 50.2025C63.4669 51.3093 63.0183 52.6553 61.9113 53.2088L43.7482 62.2903C41.8557 63.2366 39.6281 63.2366 37.7355 62.2903L19.5725 53.2088C18.4656 52.6553 18.017 51.3093 18.5704 50.2025Z" fill="#ADADAD"/>
      <path d="M21.5773 39.645C20.4704 39.0916 19.1244 39.5402 18.5709 40.6471C18.0175 41.7541 18.4661 43.1001 19.573 43.6534L37.7361 52.7349C39.6285 53.6812 41.8563 53.6812 43.7487 52.7349L61.9117 43.6534C63.0187 43.1001 63.4673 41.7541 62.9138 40.6471C62.3603 39.5402 61.0145 39.0916 59.9076 39.645L41.7445 48.7266C41.1137 49.0419 40.3711 49.0419 39.7403 48.7266L21.5773 39.645Z" fill="#ADADAD"/>
      <defs>
        <linearGradient id="paint0_linear_system" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#303030"/>
          <stop offset="1" stopColor="#3C3C3C"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function PrototypingIcon() {
  return (
    <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
      <svg className="w-full h-full absolute" viewBox="0 0 80 80" fill="none">
        <rect width="80" height="80" rx="13" fill="url(#paint0_linear_proto)"/>
        <defs>
          <linearGradient id="paint0_linear_proto" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#303030"/>
            <stop offset="1" stopColor="#3C3C3C"/>
          </linearGradient>
        </defs>
      </svg>
      <svg className="relative z-10 w-[23px] h-[42px] md:w-[29px] md:h-[52px]" viewBox="0 0 29 52" fill="none">
        <path d="M25.967 17.88H19.1276L25.7863 0H3.74272L0 29.1441H7.4418L4.16622 50.251C4.07542 50.8376 4.40276 51.4077 4.95454 51.6252C5.50722 51.8417 6.13484 51.647 6.46754 51.1563L29 17.8801H25.967V17.88ZM8.68069 42.1482L11.1976 25.9261H3.65798L6.5748 3.21811H21.1538L14.4952 21.0981H22.9348L8.68069 42.1482Z" fill="#ADADAD"/>
      </svg>
    </div>
  );
}

// Project Card Component
function ProjectCard({ 
  name, 
  year, 
  category, 
  image, 
  figmaLink 
}: { 
  name: string; 
  year: string; 
  category: string; 
  image: string;
  figmaLink: string;
}) {
  return (
    <a 
      href={figmaLink}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full lg:w-[690px] h-auto overflow-hidden rounded-[30px] md:rounded-[50px] shadow-[0_20px_40px_0_rgba(0,0,0,0.25)] group relative hover:shadow-[0_30px_60px_0_rgba(255,255,255,0.15)] hover:scale-103 hover:-translate-y-1 transition-all duration-300 animate-on-scroll opacity-0"
    >
      <img
        src={image}
        alt={name}
        className="w-full h-auto object-cover display-block brightness-75 group-hover:brightness-50 transition-all duration-300"
      />
      {/* Overlay на hover */}
      <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
        <h3 className="text-2xl md:text-3xl font-bold text-[#F8F8F8] text-center">{name}</h3>
        <p className="text-base md:text-lg text-[#D3D3D3] mt-2">{year}</p>
        <p className="text-sm md:text-base text-[#CFCFCF] mt-1">{category}</p>
        <p className="text-base md:text-lg text-white font-semibold mt-6 px-4 py-2 rounded-lg border border-white/50 hover:bg-white/10 transition-all">→ Перейти в Figma</p>
      </div>
    </a>
  );
}
