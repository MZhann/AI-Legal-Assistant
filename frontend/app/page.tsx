import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 mb-8">
              <span className="h-2 w-2 rounded-full bg-primary-400 animate-pulse-subtle" />
              <span className="text-sm text-primary-300">
                Қазақстан Республикасының заңнамасы
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-slate-100">AI </span>
              <span className="text-gradient">Legal Assistant</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-400 mb-4">
              Құқықтық сұрақтарыңызға жауап беретін жасанды интеллект көмекшісі
            </p>
            <p className="mx-auto max-w-2xl text-base text-slate-500 mb-10">
              Интеллектуальный помощник для ответов на ваши правовые вопросы
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/chat" className="legal-button flex items-center gap-2 text-lg px-8 py-4">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                AI-мен сөйлесу
              </Link>
              <Link href="/documents" className="legal-button-outline flex items-center gap-2 text-lg px-8 py-4">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Құжат жасау
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-slate-700/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Платформа мүмкіндіктері
            </h2>
            <p className="text-slate-400">
              Возможности платформы
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="legal-card group hover:border-primary-500/50 transition-all duration-300 animate-slide-up">
              <div className="h-12 w-12 rounded-lg bg-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-500/30 transition-colors">
                <svg className="h-6 w-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                AI Консультация
              </h3>
              <p className="text-slate-400 text-sm">
                ҚР заңнамасына негізделген сұрақтарыңызға нақты жауаптар. 
                Заң бабына сілтемелермен.
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Точные ответы на основе законодательства РК с ссылками на статьи.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="legal-card group hover:border-primary-500/50 transition-all duration-300 animate-slide-up animate-delay-100">
              <div className="h-12 w-12 rounded-lg bg-gold-500/20 flex items-center justify-center mb-4 group-hover:bg-gold-500/30 transition-colors">
                <svg className="h-6 w-6 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                Құжат генерациясы
              </h3>
              <p className="text-slate-400 text-sm">
                E-Otinish шағымдары мен өтініштерін автоматты түрде жасау.
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Автоматическое создание жалоб и заявлений для E-Otinish.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="legal-card group hover:border-primary-500/50 transition-all duration-300 animate-slide-up animate-delay-200">
              <div className="h-12 w-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                Заңгерлермен чат
              </h3>
              <p className="text-slate-400 text-sm">
                Нақты заңгерлермен тікелей байланыс. Алғашқы 15 хабарлама тегін.
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Прямая связь с реальными юристами. Первые 15 сообщений бесплатно.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="legal-card group hover:border-primary-500/50 transition-all duration-300 animate-slide-up animate-delay-100">
              <div className="h-12 w-12 rounded-lg bg-violet-500/20 flex items-center justify-center mb-4 group-hover:bg-violet-500/30 transition-colors">
                <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                Көптілді қолдау
              </h3>
              <p className="text-slate-400 text-sm">
                Қазақ, орыс және ағылшын тілдерінде қызмет көрсету.
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Поддержка казахского, русского и английского языков.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="legal-card group hover:border-primary-500/50 transition-all duration-300 animate-slide-up animate-delay-200">
              <div className="h-12 w-12 rounded-lg bg-rose-500/20 flex items-center justify-center mb-4 group-hover:bg-rose-500/30 transition-colors">
                <svg className="h-6 w-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                Заң түсіндірмесі
              </h3>
              <p className="text-slate-400 text-sm">
                Күрделі заң терминдерін қарапайым тілде түсіндіру.
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Объяснение сложных юридических терминов простым языком.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="legal-card group hover:border-primary-500/50 transition-all duration-300 animate-slide-up animate-delay-300">
              <div className="h-12 w-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                Деректер қауіпсіздігі
              </h3>
              <p className="text-slate-400 text-sm">
                Сіздің құпия ақпаратыңыз қорғалған және шифрланған.
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Ваша конфиденциальная информация защищена и зашифрована.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-slate-700/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">
            Құқықтық сұрағыңыз бар ма?
          </h2>
          <p className="text-slate-400 mb-8">
            Есть правовой вопрос? Начните прямо сейчас — это бесплатно.
          </p>
          <Link href="/chat" className="legal-button inline-flex items-center gap-2 text-lg px-8 py-4">
            Қазір бастау
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}




