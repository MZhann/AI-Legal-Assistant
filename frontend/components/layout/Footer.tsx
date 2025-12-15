import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-700/50 bg-legal-darker/90">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Legal Disclaimer */}
        <div className="legal-disclaimer mb-8">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-gold-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="font-medium text-slate-300 mb-1">
                ⚖️ Маңызды ескерту / Важное уведомление
              </p>
              <p className="text-slate-400 text-xs leading-relaxed">
                <span className="block mb-2">
                  <strong>ҚАЗ:</strong> Бұл платформа тек ақпараттық мақсатта берілген. 
                  AI көмекші лицензияланған заңгерді алмастырмайды. 
                  Маңызды құқықтық мәселелер бойынша білікті заңгерге хабарласыңыз.
                </span>
                <span className="block">
                  <strong>РУС:</strong> Данная платформа предоставляется исключительно в информационных целях. 
                  AI-ассистент не заменяет лицензированного юриста. 
                  По важным правовым вопросам обращайтесь к квалифицированному специалисту.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Платформа</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/chat" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
                  AI Консультация
                </Link>
              </li>
              <li>
                <Link href="/documents" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
                  Құжат генерациясы
                </Link>
              </li>
              <li>
                <Link href="/lawyers" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
                  Заңгерлермен чат
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Ресурстар</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/laws" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
                  ҚР Заңнамасы
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
                  Жиі қойылатын сұрақтар
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Компания</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
                  Біз туралы
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
                  Байланыс
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Құқықтық</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
                  Құпиялылық саясаты
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
                  Пайдалану шарттары
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-700/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {currentYear} AI Legal Assistant. Барлық құқықтар қорғалған.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>🇰🇿</span>
            <span>Made in Kazakhstan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
