// /agency/ ilk paragrafı ve "Yazılı SLA" güven kartı. React (Agency.jsx) ve ön-render (generate_static_pages.js) buradan okur.

export const agencyGiris = {
  tr: "Bir projede tıkandığınızda, ekibinizin kapasitesi dolduğunda ya da müşterinizin talebi uzmanlığınızın dışına çıktığında, müşterinizin görmediği kıdemli bir teknik masa devreye girer. Sizin markanızla çalışır, koda bakmadan önce gizlilik sözleşmesi imzalar ve yanıt sürelerini yazılı olarak taahhüt eder.",
  en: "When you are stuck on a project, your team is over capacity, or a client's request goes beyond your expertise, a senior technical desk your client never sees steps in. It works under your brand, signs a confidentiality agreement before looking at the code, and commits to response times in writing."
};

export const agencySlaKarti = {
  baslik: { tr: "Yazılı SLA", en: "Written SLA" },
  metin: {
    tr: "Yanıt süreleri önem seviyesine göre yazılı; kriz hattı her gün 09:00 – 24:00 açık.",
    en: "Response times are written down by severity; the response desk is open daily 09:00 – 24:00."
  },
  link: "/sla/"
};
