import { useState, useEffect } from 'react';

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Istanbul',
  hour: '2-digit',
  hourCycle: 'h23'
});

export function krizHattiAcikMi(now = new Date()) {
  let h = parseInt(formatter.format(now), 10);
  if (h === 24) h = 0;
  return h >= 9 && h < 24;
}

export function useKrizHattiAcik() {
  const [acik, setAcik] = useState(() => krizHattiAcikMi());

  useEffect(() => {
    const update = () => setAcik(krizHattiAcikMi());
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return acik;
}
