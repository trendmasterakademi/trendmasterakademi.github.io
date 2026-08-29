import React from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const KVKKModal = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const isTr = i18n.language !== 'en';

  if (!isOpen) return null;

  return (
    <React.Fragment>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <div
          
          
          
          className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#0d121d] border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(0,229,255,0.15)] relative text-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isTr ? 'KVKK Aydınlatma Metni & Gizlilik Taahhüdü' : 'Privacy Policy & NDA Commitment'}
                </h3>
                <span className="text-xs font-mono text-cyan-400">Trend Master Akademi Studio & Labs</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-1 text-cyan-300">
              <strong className="block font-bold">
                {isTr ? '🔒 %100 White-Label & Katı Gizlilik Prensibi' : '🔒 100% White-Label & Strict Non-Disclosure'}
              </strong>
              <p className="text-xs">
                {isTr 
                  ? 'Ajansınızın ve müşterilerinizin teknik verileri, kaynak kodları ve iletişim bilgileri en üst düzey ticari sır ve resmi NDA kapsamında korunur.' 
                  : 'All agency and client source code, infrastructure, and technical data are protected under strict mutual NDA standards.'}
              </p>
            </div>

            <h4 className="text-white font-bold text-sm sm:text-base pt-2">
              {isTr ? '1. Veri Sorumlusu' : '1. Data Controller'}
            </h4>
            <p>
              {isTr 
                ? '6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca; Trend Master Akademi markası altında faaliyet gösteren Mehmet Şahin (Şahıs İşletmesi, Konak Vergi Dairesi, VKN: 7930336132, Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / İzmir), veri sorumlusu sıfatıyla hareket etmektedir.' 
                : 'Under applicable Data Protection regulations; Mehmet Şahin operating under the brand Trend Master Akademi (Sole Proprietorship, Konak Tax Office, Tax ID: 7930336132, Akdeniz Mah. Şehit Fethibey Cad. Heris Tower No: 55 İç Kapı No: 091 Konak / Izmir) operates as the Data Controller.'}
            </p>

            <h4 className="text-white font-bold text-sm sm:text-base pt-2">
              {isTr ? '2. Toplanan Veriler ve İşlenme Amacı' : '2. Data Collected & Purpose'}
            </h4>
            <p>
              {isTr 
                ? 'Web sitemiz üzerinden doldurulan iletişim formu ve Crash Test araçları vasıtasıyla toplanan ad-soyad, e-posta, telefon ve kriz özeti bilgileri; yalnızca acil teknik triyaj yapılması, teklif iletilmesi ve sizinle iletişime geçilmesi amacıyla işlenmektedir.' 
                : 'Contact details (name, email, phone, project scope) are processed solely for technical triage, quotation, and direct project communication.'}
            </p>

            <h4 className="text-white font-bold text-sm sm:text-base pt-2">
              {isTr ? '3. 3. Taraflarla Paylaşım Yasağı' : '3. Zero 3rd-Party Sharing'}
            </h4>
            <p>
              {isTr 
                ? 'Bilgileriniz hiçbir koşulda ticari pazarlama, reklam veya 3. taraf şirketlerle paylaşılmaz, satılmaz veya aktarılmaz.' 
                : 'Your information is never sold, shared, or transferred to third-party marketing entities.'}
            </p>

            <h4 className="text-white font-bold text-sm sm:text-base pt-2">
              {isTr ? '4. İletişim & Haklarınız' : '4. Inquiries & Rights'}
            </h4>
            <p>
              {isTr 
                ? 'Kişisel verilerinizin silinmesini veya güncellenmesini talep etmek için info@trendmasterakademi.com adresine e-posta gönderebilirsiniz.' 
                : 'To request removal or updates to your contact records, contact info@trendmasterakademi.com.'}
            </p>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-bg-dark font-bold text-xs sm:text-sm hover:bg-cyan-400 transition-colors cursor-pointer"
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
