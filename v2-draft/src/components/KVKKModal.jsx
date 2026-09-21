import React from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { isTurkish } from '../i18n';

const KVKKModal = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);

  if (!isOpen) return null;

  return (
    <React.Fragment>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-black/50 overflow-y-auto">
        <div 
          className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-[var(--surface)] border border-[var(--rule)] rounded-[var(--r-panel)] shadow-xl relative text-[var(--ink-2)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-[var(--rule)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[var(--r-control)] bg-[var(--paper)] text-[var(--accent)] border border-[var(--rule)] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--ink)]">
                  {isTr ? 'KVKK Aydınlatma Metni & Gizlilik Taahhüdü' : 'Privacy Policy & NDA Commitment'}
                </h3>
                <span className="text-xs font-mono text-[var(--ink-3)]">Trend Master Akademi Studio & Labs</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-[var(--r-control)] hover:bg-[var(--paper)] text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
            <div className="p-4 rounded-[var(--r-control)] bg-[var(--paper)] border border-[var(--rule)] space-y-1 text-[var(--ink)]">
              <strong className="block font-semibold">
                {isTr ? '%100 White-Label & Katı Gizlilik Prensibi' : '100% White-Label & Strict Non-Disclosure'}
              </strong>
              <p className="text-xs text-[var(--ink-2)]">
                {isTr 
                  ? 'Ajansınızın ve müşterilerinizin teknik verileri, kaynak kodları ve iletişim bilgileri en üst düzey ticari sır ve resmi NDA kapsamında korunur.' 
                  : 'All agency and client source code, infrastructure, and technical data are protected under strict mutual NDA standards.'}
              </p>
            </div>

            <h4 className="text-[var(--ink)] font-semibold text-sm sm:text-base pt-2">
              {isTr ? '1. Veri Sorumlusu' : '1. Data Controller'}
            </h4>
            <p>
              {isTr 
                ? '6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca; Trend Master Akademi markası altında faaliyet gösteren Mehmet Şahin (Şahıs İşletmesi, Konak Vergi Dairesi, VKN: 7930336132, Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / İzmir), veri sorumlusu sıfatıyla hareket etmektedir.' 
                : 'Under applicable Data Protection regulations; Mehmet Şahin operating under the brand Trend Master Akademi (Sole Proprietorship, Konak Tax Office, Tax ID: 7930336132, Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / Izmir) operates as the Data Controller.'}
            </p>

            <h4 className="text-[var(--ink)] font-semibold text-sm sm:text-base pt-2">
              {isTr ? '2. Toplanan Veriler ve İşlenme Amacı' : '2. Data Collected & Purpose'}
            </h4>
            <p>
              {isTr 
                ? 'Web sitemiz üzerinden doldurulan iletişim formu ve Crash Test araçları vasıtasıyla toplanan ad-soyad, e-posta, telefon ve kriz özeti bilgileri; yalnızca acil teknik triyaj yapılması, teklif iletilmesi ve sizinle iletişime geçilmesi amacıyla işlenmektedir.' 
                : 'Contact details (name, email, phone, project scope) are processed solely for technical triage, quotation, and direct project communication.'}
            </p>

            <h4 className="text-[var(--ink)] font-semibold text-sm sm:text-base pt-2">
              {isTr ? '3. 3. Taraflarla Paylaşım Yasağı' : '3. Zero 3rd-Party Sharing'}
            </h4>
            <p>
              {isTr 
                ? 'Bilgileriniz hiçbir koşulda ticari pazarlama, reklam veya 3. taraf şirketlerle paylaşılmaz, satılmaz veya aktarılmaz.' 
                : 'Your information is never sold, shared, or transferred to third-party marketing entities.'}
            </p>

            <h4 className="text-[var(--ink)] font-semibold text-sm sm:text-base pt-2">
              {isTr ? '4. İletişim & Haklarınız' : '4. Inquiries & Rights'}
            </h4>
            <p>
              {isTr 
                ? 'Kişisel verilerinizin silinmesini veya güncellenmesini talep etmek için info@trendmasterakademi.com adresine e-posta gönderebilirsiniz.' 
                : 'To request removal or updates to your contact records, contact info@trendmasterakademi.com.'}
            </p>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[var(--rule)] flex justify-end">
            <button
              onClick={onClose}
              className="btn-primary px-6 py-2.5 rounded-[var(--r-control)] font-medium text-xs sm:text-sm cursor-pointer"
            >
              {isTr ? 'Anladım ve Kapat' : 'Got it & Close'}
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default KVKKModal;
