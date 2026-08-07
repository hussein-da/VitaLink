"use client";

import { useState } from "react";
import { ShieldCheck, Database, Lightbulb, Zap, ChevronRight } from "lucide-react";
import { useT } from "@/i18n/useT";
import type { Language } from "@/context/SettingsContext";

interface Slide {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  desc: string;
  dark: boolean;
}

const SLIDES: Record<Language, Slide[]> = {
  de: [
    {
      icon: <ShieldCheck size={52} strokeWidth={1.3} />,
      title: "VitaLink",
      subtitle: "Erklärbare Vorsorge für dich",
      desc: "Deine Gesundheit – transparent, nachvollziehbar und jederzeit in deiner Hand.",
      dark: true,
    },
    {
      icon: <Database size={52} strokeWidth={1.3} />,
      title: "Deine Datenquellen",
      subtitle: "Alles an einem Ort",
      desc: "VitaLink verbindet Wearable-Daten und deine elektronische Patientenakte zu einem vollständigen Bild deiner Gesundheit.",
      dark: false,
    },
    {
      icon: <Lightbulb size={52} strokeWidth={1.3} />,
      title: "KI, die erklärt",
      subtitle: "Kein Rätsel, nur Klarheit",
      desc: "Du erfährst nicht nur was, sondern auch warum eine Maßnahme für dich empfohlen wird – quellenbelegt und verständlich.",
      dark: false,
    },
    {
      icon: <Zap size={52} strokeWidth={1.3} />,
      title: "Bereit loszulegen?",
      subtitle: "Verbinde deine Geräte",
      desc: "Im nächsten Schritt verknüpfst du deine Apple Watch Series 12 und deine ePA und erhältst deine ersten Vorsorge-Empfehlungen.",
      dark: true,
    },
  ],
  en: [
    {
      icon: <ShieldCheck size={52} strokeWidth={1.3} />,
      title: "VitaLink",
      subtitle: "Explainable prevention for you",
      desc: "Your health – transparent, understandable, and always in your hands.",
      dark: true,
    },
    {
      icon: <Database size={52} strokeWidth={1.3} />,
      title: "Your Data Sources",
      subtitle: "Everything in one place",
      desc: "VitaLink connects your wearable data and electronic health record for a complete picture of your health.",
      dark: false,
    },
    {
      icon: <Lightbulb size={52} strokeWidth={1.3} />,
      title: "AI that explains",
      subtitle: "No mystery, just clarity",
      desc: "You learn not only what, but why a measure is recommended – with sources and easy to understand.",
      dark: false,
    },
    {
      icon: <Zap size={52} strokeWidth={1.3} />,
      title: "Ready to begin?",
      subtitle: "Connect your devices",
      desc: "In the next step, connect your wearable and ePA to receive your first health recommendations.",
      dark: true,
    },
  ],
  tr: [
    {
      icon: <ShieldCheck size={52} strokeWidth={1.3} />,
      title: "VitaLink",
      subtitle: "Senin için açıklanabilir önlem",
      desc: "Sağlığın – şeffaf, anlaşılır ve her zaman senin elinde.",
      dark: true,
    },
    {
      icon: <Database size={52} strokeWidth={1.3} />,
      title: "Veri Kaynaklarınız",
      subtitle: "Her şey tek bir yerde",
      desc: "VitaLink, giyilebilir verilerini ve elektronik sağlık kaydını birleştirerek sağlığının tam resmini sunar.",
      dark: false,
    },
    {
      icon: <Lightbulb size={52} strokeWidth={1.3} />,
      title: "Açıklayan Yapay Zeka",
      subtitle: "Gizem yok, sadece netlik",
      desc: "Sadece ne önerildiğini değil, neden önerildiğini de öğrenirsin – kaynaklı ve anlaşılır.",
      dark: false,
    },
    {
      icon: <Zap size={52} strokeWidth={1.3} />,
      title: "Başlamaya hazır mısınız?",
      subtitle: "Cihazlarınızı bağlayın",
      desc: "Sonraki adımda giyilebilir cihazınızı ve ePA'nızı bağlayarak ilk önerilerinizi alacaksınız.",
      dark: true,
    },
  ],
  ar: [
    {
      icon: <ShieldCheck size={52} strokeWidth={1.3} />,
      title: "VitaLink",
      subtitle: "رعاية وقائية قابلة للتفسير",
      desc: "صحتك – شفافة، مفهومة، ودائماً في يدك.",
      dark: true,
    },
    {
      icon: <Database size={52} strokeWidth={1.3} />,
      title: "مصادر بياناتك",
      subtitle: "كل شيء في مكان واحد",
      desc: "يربط VitaLink بيانات جهازك القابل للارتداء وسجلك الصحي الإلكتروني لصورة كاملة عن صحتك.",
      dark: false,
    },
    {
      icon: <Lightbulb size={52} strokeWidth={1.3} />,
      title: "ذكاء اصطناعي يشرح",
      subtitle: "لا غموض، فقط وضوح",
      desc: "لا تعرف فقط ماذا، بل لماذا يُوصى لك بإجراء ما – موثق وسهل الفهم.",
      dark: false,
    },
    {
      icon: <Zap size={52} strokeWidth={1.3} />,
      title: "مستعد للبدء؟",
      subtitle: "اربط أجهزتك",
      desc: "في الخطوة التالية، ستربط جهازك القابل للارتداء وسجلك الصحي للحصول على أول توصياتك.",
      dark: true,
    },
  ],
};

const BTN_NEXT: Record<Language, string> = {
  de: "Weiter",
  en: "Next",
  tr: "İleri",
  ar: "التالي",
};
const BTN_START: Record<Language, string> = {
  de: "Los geht's",
  en: "Let's go",
  tr: "Hadi başlayalım",
  ar: "لنبدأ",
};

interface Props {
  onComplete: () => void;
}

export default function AnimatedIntro({ onComplete }: Props) {
  // Hydrations-gegatete Sprache (siehe useT): der erste Client-Render muss zum
  // statisch deutschen HTML passen, sonst bricht die Hydration.
  const { language } = useT();
  const [current, setCurrent] = useState(0);

  const slides = SLIDES[language] ?? SLIDES.de;
  const slide = slides[current];
  const isLast = current === slides.length - 1;
  const rtl = language === "ar";

  const next = () => {
    if (isLast) { onComplete(); return; }
    setCurrent((c) => c + 1);
  };

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className={`flex flex-1 flex-col transition-colors duration-500 ${slide.dark ? "bg-primary" : "bg-bg"}`}
    >
      {/* Slide content – keyed so animate-screen-in fires on every slide change */}
      <div
        key={current}
        className="flex flex-1 flex-col items-center justify-center px-8 text-center animate-screen-in"
      >
        <div
          className={`mb-8 flex h-28 w-28 items-center justify-center rounded-2xl ${
            slide.dark ? "bg-white/15 text-white" : "bg-primary-soft text-primary"
          }`}
        >
          {slide.icon}
        </div>

        <h1
          className={`font-display text-[2rem] font-semibold leading-tight ${
            slide.dark ? "text-white" : "text-ink"
          }`}
        >
          {slide.title}
        </h1>
        <p
          className={`mt-2 text-base font-medium ${
            slide.dark ? "text-white/70" : "text-primary"
          }`}
        >
          {slide.subtitle}
        </p>
        <p
          className={`mt-4 max-w-xs text-sm leading-relaxed ${
            slide.dark ? "text-white/55" : "text-muted"
          }`}
        >
          {slide.desc}
        </p>
      </div>

      {/* Navigation */}
      <div className="px-8 pb-10">
        {/* Progress dots */}
        <div className="mb-6 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? `w-6 ${slide.dark ? "bg-white" : "bg-primary"}`
                  : `w-2 ${slide.dark ? "bg-white/30" : "bg-border"}`
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className={`tap flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-lg font-semibold ${
            slide.dark ? "bg-white text-primary" : "bg-primary text-primary-ink"
          }`}
        >
          {isLast ? BTN_START[language] : BTN_NEXT[language]}
          {!isLast && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
}
