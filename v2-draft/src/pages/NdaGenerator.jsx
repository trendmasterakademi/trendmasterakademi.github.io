import React, { useState } from "react";
import { ndaData } from "../data/ndaData";

export default function NdaGenerator({ lang = "tr" }) {
  const t = ndaData[lang] || ndaData.tr;
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    companyName: "",
    signatory: "",
    signatoryTitle: "",
    email: "",
    scope: "crisis_triage",
    effectiveDate: today
  });

  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedScopeObj = t.scopeTypes.find((s) => s.id === formData.scope) || t.scopeTypes[0];

  const clientCompanyDisplay = formData.companyName.trim() || (lang === "en" ? "[CLIENT COMPANY LEGAL NAME]" : "[MÜŞTERİ ŞİRKET UNVANI]");
  const clientSignatoryDisplay = formData.signatory.trim() || (lang === "en" ? "[AUTHORIZED SIGNATORY NAME]" : "[YETKİLİ ADI SOYADI]");
  const clientTitleDisplay = formData.signatoryTitle.trim() || (lang === "en" ? "[TITLE]" : "[UNVAN]");
  const clientEmailDisplay = formData.email.trim() || (lang === "en" ? "[CORPORATE EMAIL]" : "[KURUMSAL E-POSTA]");

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const clausesText = t.clauses
      .map((c) => `MADDE ${c.num}. ${c.title}\n${c.content}`)
      .join("\n\n");

    const fullText = `================================================================================
${t.hero.title.toUpperCase()}
================================================================================

TARAFLAR:

1. MÜŞTERİ / DANIŞAN TARAF:
   Şirket Unvanı: ${clientCompanyDisplay}
   Yetkili: ${clientSignatoryDisplay} (${clientTitleDisplay})
   E-posta: ${clientEmailDisplay}

2. YÜKLENİCİ / MÜHENDİSLİK MASASI:
   Şirket Unvanı: ${t.tmaParty.companyName}
   Yetkili: ${t.tmaParty.signatory} (${t.tmaParty.title})
   Adres: ${t.tmaParty.address}
   E-posta: ${t.tmaParty.email}
   Telefon: ${t.tmaParty.phone}

İŞBİRLİĞİ KAPSAMI: ${selectedScopeObj.label}
YÜRÜRLÜK TARİHİ: ${formData.effectiveDate}

SÖZLEŞME METNİ VE MADDELER:

${clausesText}

--------------------------------------------------------------------------------
TARAFLARIN İMZA VE ONAYI:

MÜŞTERİ TARAF:                           TREND MASTER AKADEMİ:
İmza / Kaşe:                             İmza / Kaşe:
Ad Soyad: ${clientSignatoryDisplay}      Ad Soyad: ${t.tmaParty.signatory}
Tarih: ${formData.effectiveDate}         Tarih: ${formData.effectiveDate}
================================================================================`;

    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const mailtoUrl = `mailto:${t.tmaParty.email}?subject=${encodeURIComponent(
    `[NDA İmza Talebi] ${formData.companyName.trim() || "Kurumsal İşbirliği"} - ${selectedScopeObj.label}`
  )}&body=${encodeURIComponent(
    `Merhaba Mehmet Bey,\n\nTrend Master Akademi ile yürüteceğimiz ${selectedScopeObj.label} çalışması için iki taraflı gizlilik sözleşmesi (NDA) nüshasını onaylamak istiyoruz.\n\nŞirket: ${formData.companyName}\nYetkili: ${formData.signatory} (${formData.signatoryTitle})\nE-posta: ${formData.email}\nYürürlük Tarihi: ${formData.effectiveDate}\n\nLütfen imzalı karşı nüshayı bu adrese iletiniz.\n\nSaygılarımızla.`
  )}`;

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[var(--accent)] selection:text-[var(--on-accent)]">
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-nda, #printable-nda * {
            visibility: visible;
          }
          #printable-nda {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 30px !important;
            box-shadow: none !important;
            border: none !important;
          }
          #printable-nda h1, #printable-nda h2, #printable-nda h3, #printable-nda p, #printable-nda span {
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* Screen Header (No Print) */}
      <div className="max-w-5xl mx-auto text-center mb-12 no-print">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--r-control)] bg-[var(--surface)] border border-[var(--rule)] text-[var(--ink-3)] text-xs font-mono font-medium uppercase tracking-widest mb-4">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
          {t.hero.badge}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold tracking-tight text-[var(--ink)] mb-4">
          {t.hero.title}
        </h1>
        <p className="text-base sm:text-lg text-[var(--ink-2)] max-w-[34rem] mx-auto mb-4">
          {t.hero.subtitle}
        </p>
        <p className="text-xs text-[var(--ink-3)] font-mono">
          {t.hero.notice}
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (No Print) */}
        <div className="lg:col-span-4 no-print space-y-5">
          <div className="bg-[var(--surface)] border border-[var(--rule)] rounded-2xl p-6 shadow-sm sticky top-[80px] max-h-[calc(100dvh-96px)] overflow-y-auto">
            <h2 className="text-base font-serif font-semibold text-[var(--ink)] mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]"></span>
              {lang === "en" ? "Agreement Parties & Scope" : "Sözleşme Tarafları ve Kapsam"}
            </h2>

            {/* Main Action CTAs (In first 480px) */}
            <div className="space-y-2 pb-4 mb-4 border-b border-[var(--rule)]">
              <a
                href={mailtoUrl}
                className="btn-primary min-h-[44px] w-full text-xs font-mono font-semibold flex items-center justify-center gap-2 text-center cursor-pointer"
              >
                {t.formLabels.requestSignedCta}
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handlePrint}
                  className="btn-secondary min-h-[44px] w-full font-mono font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {t.formLabels.printCta}
                </button>

                <button
                  onClick={handleCopyText}
                  className="btn-secondary min-h-[44px] w-full text-[var(--ink)] font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? t.formLabels.copiedNotice : t.formLabels.copyCta}
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label htmlFor="nda-sirket" className="block text-[var(--ink-2)] mb-1 font-medium">
                  {t.formLabels.companyName} *
                </label>
                <input
                  id="nda-sirket"
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder={t.formLabels.companyNamePlaceholder}
                  className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] placeholder-[var(--ink-3)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label htmlFor="nda-imzaci" className="block text-[var(--ink-2)] mb-1 font-medium">
                  {t.formLabels.signatory} *
                </label>
                <input
                  id="nda-imzaci"
                  type="text"
                  name="signatory"
                  value={formData.signatory}
                  onChange={handleChange}
                  placeholder={t.formLabels.signatoryPlaceholder}
                  className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] placeholder-[var(--ink-3)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label htmlFor="nda-unvan" className="block text-[var(--ink-2)] mb-1 font-medium">
                  {t.formLabels.signatoryTitle}
                </label>
                <input
                  id="nda-unvan"
                  type="text"
                  name="signatoryTitle"
                  value={formData.signatoryTitle}
                  onChange={handleChange}
                  placeholder={t.formLabels.signatoryTitlePlaceholder}
                  className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] placeholder-[var(--ink-3)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label htmlFor="nda-eposta" className="block text-[var(--ink-2)] mb-1 font-medium">
                  {t.formLabels.email} *
                </label>
                <input
                  id="nda-eposta"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.formLabels.emailPlaceholder}
                  className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] placeholder-[var(--ink-3)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label htmlFor="nda-kapsam" className="block text-[var(--ink-2)] mb-1 font-medium">
                  {t.formLabels.scope}
                </label>
                <select
                  id="nda-kapsam"
                  name="scope"
                  value={formData.scope}
                  onChange={handleChange}
                  className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] text-xs"
                >
                  {t.scopeTypes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="nda-tarih" className="block text-[var(--ink-2)] mb-1 font-medium">
                  {t.formLabels.effectiveDate}
                </label>
                <input
                  id="nda-tarih"
                  type="date"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleChange}
                  className="w-full bg-[var(--paper)] border border-[var(--rule)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Printable Live NDA Document */}
        <div className="lg:col-span-8">
          <div
            id="printable-nda"
            className="bg-[var(--surface)] border border-[var(--rule)] rounded-2xl p-8 sm:p-12 shadow-sm text-[var(--ink)] font-serif leading-relaxed"
          >
            {/* Document Header */}
            <div className="text-center border-b border-[var(--rule)] pb-8 mb-8">
              <span className="text-xs font-mono tracking-widest uppercase text-[var(--accent)] block mb-2 font-semibold">
                {lang === "en" ? "TREND MASTER AKADEMİ SOFTWARE SERVICES" : "TREND MASTER AKADEMİ YAZILIM HİZMETLERİ"}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[var(--ink)] tracking-tight mb-2 uppercase">
                {t.hero.title}
              </h2>
              <span className="text-xs font-mono text-[var(--ink-3)]">
                Ref: TMA-NDA-{formData.effectiveDate.replace(/-/g, "")}-{formData.scope.toUpperCase()}
              </span>
            </div>

            {/* Parties Info Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--paper)] p-6 rounded-xl border border-[var(--rule)] mb-8 text-xs font-sans">
              <div>
                <h3 className="font-mono font-semibold text-[var(--accent)] uppercase tracking-wider mb-2 border-b border-[var(--rule)] pb-1">
                  1. {lang === "en" ? "Client / Disclosing Party:" : "Müşteri / Danışan Taraf:"}
                </h3>
                <p className="font-bold text-[var(--ink)] text-sm mb-1">{clientCompanyDisplay}</p>
                <p className="text-[var(--ink-2)] mb-1">
                  {clientSignatoryDisplay} {formData.signatoryTitle ? `(${clientTitleDisplay})` : ""}
                </p>
                <p className="text-[var(--ink-2)] mb-1">{clientEmailDisplay}</p>
              </div>

              <div>
                <h3 className="font-mono font-semibold text-[var(--accent)] uppercase tracking-wider mb-2 border-b border-[var(--rule)] pb-1">
                  2. {lang === "en" ? "Engineering Studio / Receiving Party:" : "Yüklenici / Mühendislik Masası:"}
                </h3>
                <p className="font-bold text-[var(--ink)] text-sm mb-1">{t.tmaParty.companyName}</p>
                <p className="text-[var(--ink-2)] mb-1">
                  {t.tmaParty.signatory} ({t.tmaParty.title})
                </p>
                <p className="text-[var(--ink-2)] mb-1">{t.tmaParty.address}</p>
                <p className="text-[var(--ink-2)]">{t.tmaParty.email} • {t.tmaParty.phone}</p>
              </div>
            </div>

            {/* Scope & Date Banner */}
            <div className="bg-[var(--paper)] p-4 rounded-lg border border-[var(--rule)] mb-8 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div>
                <span className="text-[var(--ink-2)]">{lang === "en" ? "Scope: " : "Kapsam: "}</span>
                <span className="text-[var(--ink)] font-bold">{selectedScopeObj.label}</span>
              </div>
              <div>
                <span className="text-[var(--ink-2)]">{lang === "en" ? "Effective Date: " : "Yürürlük Tarihi: "}</span>
                <span className="text-[var(--accent)] font-bold">{formData.effectiveDate}</span>
              </div>
            </div>

            {/* Agreement Clauses */}
            <div className="space-y-6 text-sm">
              {t.clauses.map((clause) => (
                <div key={clause.num} className="space-y-1.5">
                  <h3 className="font-semibold text-[var(--ink)] tracking-wide font-sans text-xs uppercase flex items-center gap-2">
                    <span className="text-[var(--accent)] font-mono">MADDE {clause.num}.</span>
                    {clause.title}
                  </h3>
                  <p className="text-[var(--ink-2)] text-xs sm:text-sm leading-relaxed text-justify">
                    {clause.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Signature Block */}
            <div className="mt-12 pt-8 border-t border-[var(--rule)] grid grid-cols-2 gap-8 text-xs font-sans">
              <div>
                <p className="font-semibold text-[var(--ink)] mb-8">
                  {lang === "en" ? "FOR AND ON BEHALF OF CLIENT:" : "MÜŞTERİ / DANIŞAN ADINA:"}
                </p>
                <div className="border-b border-[var(--rule)] w-3/4 mb-2"></div>
                <p className="font-medium text-[var(--ink)]">{clientSignatoryDisplay}</p>
                <p className="text-[var(--ink-2)]">{clientTitleDisplay}</p>
                <p className="text-[var(--ink-3)] font-mono mt-1">{formData.effectiveDate}</p>
              </div>

              <div>
                <p className="font-semibold text-[var(--ink)] mb-8">
                  {lang === "en" ? "FOR AND ON BEHALF OF TMA:" : "TREND MASTER AKADEMİ ADINA:"}
                </p>
                <div className="border-b border-[var(--rule)] w-3/4 mb-2"></div>
                <p className="font-medium text-[var(--ink)]">{t.tmaParty.signatory}</p>
                <p className="text-[var(--ink-2)]">{t.tmaParty.title}</p>
                <p className="text-[var(--ink-3)] font-mono mt-1">{formData.effectiveDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
