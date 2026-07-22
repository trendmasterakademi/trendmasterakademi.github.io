import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FolderGit2, Star, GitFork } from 'lucide-react';
import { motion } from 'framer-motion';

const fallbackRepos = [
  {
    name: "tma-pine-alerts-connector",
    description_tr: "TradingView Pine Script alarmlarını gerçek zamanlı olarak Binance, Bybit ve OKX vadeli işlemler borsalarına yönlendiren webhook konnektörü.",
    description_en: "TradingView Pine Script alert webhook connector to automate Binance, Bybit, and OKX futures trading in real-time.",
    stargazers_count: 14,
    forks_count: 5,
    language: "Python",
    langColor: "#3572A5",
    html_url: "https://github.com/trendmasterakademi/tma-pine-alerts-connector"
  },
  {
    name: "tma-fintech-saas-dashboard",
    description_tr: "Finansal verileri, trading alarmlarını ve kullanıcı portföy yönetimini tek bir arayüzde birleştiren Next.js & Tailwind CSS tabanlı SaaS paneli.",
    description_en: "A Next.js & Tailwind CSS based SaaS dashboard integrating financial analytics, trading alerts, and user portfolio tracking.",
    stargazers_count: 31,
    forks_count: 12,
    language: "TypeScript",
    langColor: "#3178c6",
    html_url: "https://github.com/trendmasterakademi/tma-fintech-saas-dashboard"
  },
  {
    name: "tma-mobile-trading-companion",
    description_tr: "Kullanıcıların trading sinyallerini anlık bildirim olarak aldığı ve API anahtarlarını yönettikleri şık Flutter tabanlı mobil uygulama.",
    description_en: "A sleek Flutter-based iOS/Android mobile companion app for real-time alert notifications and API credential management.",
    stargazers_count: 19,
    forks_count: 4,
    language: "Dart",
    langColor: "#00B4AB",
    html_url: "https://github.com/trendmasterakademi/tma-mobile-trading-companion"
  },
  {
    name: "price-action-backtester",
    description_tr: "Market yapısı kırılımları (MSB), order block (emir blokları) ve FVG modellerini geriye dönük test eden yüksek performanslı Pandas tabanlı backtest motoru.",
    description_en: "A high-performance algorithmic backtesting engine that simulates market structure breaks, order blocks, and FVG patterns.",
    stargazers_count: 22,
    forks_count: 8,
    language: "Python",
    langColor: "#3572A5",
    html_url: "https://github.com/trendmasterakademi/price-action-backtester"
  }
];

const getLanguageColor = (lang) => {
  const colors = {
    "Python": "#3572A5",
    "JavaScript": "#f1e05a",
    "TypeScript": "#3178c6",
    "Dart": "#00B4AB",
    "HTML": "#e34c26",
    "CSS": "#563d7c",
    "Pine Script": "#00b0ff"
  };
  return colors[lang] || "#8b949e";
};

const GithubRepos = () => {
  const { t, i18n } = useTranslation();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/users/trendmasterakademi/repos')
      .then(res => {
        if (!res.ok) throw new Error('API failed');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.slice(0, 4).map(r => ({
            name: r.name,
            description: r.description,
            stargazers_count: r.stargazers_count,
            forks_count: r.forks,
            language: r.language || 'Pine Script',
            html_url: r.html_url,
            langColor: getLanguageColor(r.language || 'Pine Script')
          }));
          setRepos(formatted);
        } else {
          setRepos(fallbackRepos);
        }
        setLoading(false);
      })
      .catch(() => {
        setRepos(fallbackRepos);
        setLoading(false);
      });
  }, []);

  const getDesc = (repo) => {
    if (repo.description_tr && repo.description_en) {
      return i18n.language === 'tr' ? repo.description_tr : repo.description_en;
    }
    return repo.description || (i18n.language === 'tr' ? 'Açıklama bulunmuyor.' : 'No description available.');
  };

  return (
    <section className="py-24 px-6 md:px-12 relative overflow-hidden border-t border-white/5">
      <div className="absolute -right-[20%] top-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h4 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">{t('github-subtitle')}</h4>
            <h2 className="text-4xl font-bold mb-4">{t('github-title')}</h2>
            <p className="text-slate-400 max-w-xl text-lg">{t('github-desc')}</p>
          </div>
          <a href="https://github.com/trendmasterakademi" target="_blank" rel="noreferrer" className="inline-block px-6 py-3 rounded-full border border-white/20 font-bold hover:bg-white/5 transition-colors whitespace-nowrap">
            {t('github-view-profile')}
          </a>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">{t('github-loading')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {repos.map((repo, idx) => (
              <motion.a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel p-6 rounded-2xl flex flex-col hover:-translate-y-2 hover:border-primary/40 transition-all group"
              >
                <FolderGit2 className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2 text-white group-hover:text-primary transition-colors">{repo.name}</h3>
                <p className="text-slate-400 text-sm mb-6 flex-grow line-clamp-3">{getDesc(repo)}</p>
                
                <div className="flex justify-between items-center text-sm font-medium pt-4 border-t border-white/10 mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: repo.langColor }}></span>
                    <span className="text-slate-300">{repo.language}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <span className="flex items-center gap-1 hover:text-white transition-colors"><Star className="w-4 h-4" /> {repo.stargazers_count}</span>
                    <span className="flex items-center gap-1 hover:text-white transition-colors"><GitFork className="w-4 h-4" /> {repo.forks_count}</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GithubRepos;
