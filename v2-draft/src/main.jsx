import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n' // Initialize i18n
import { ilkSayfayiHazirla } from './utils/sayfaYukle'

// Açılışta yazılan harfler kaybolmaz: Ziyaretçi React gelmeden önce arama kutusuna yazdıysa değeri oku
if (typeof document !== 'undefined') {
  const existingInput = document.querySelector('input[role="combobox"]');
  if (existingInput && existingInput.value) {
    window.__TMA_INITIAL_SEARCH__ = existingInput.value;
  }
}

// Sayfanın kendi kodu inmeden çizme: ön-render HTML ekranda kalır, React sayfayı tek seferde içerikle çizer.
ilkSayfayiHazirla().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
