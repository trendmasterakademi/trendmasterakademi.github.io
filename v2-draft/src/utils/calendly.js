/**
 * Generates Calendly scheduling URL with proper UTM and box tracking parameters.
 * Target: https://calendly.com/trendmasterakademi/30min
 */
export const getCalendlyUrl = (defaultSource = 'site', customParams = {}) => {
  const baseUrl = 'https://calendly.com/trendmasterakademi/30min';
  
  if (typeof window === 'undefined') {
    return `${baseUrl}?utm_source=${defaultSource}`;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = customParams.utm_source || urlParams.get('utm_source') || defaultSource;
  const utmCampaign = customParams.utm_campaign || urlParams.get('utm_campaign') || (urlParams.get('utm_source') ? 'organik' : null);
  const rawBox = customParams.agency_code || urlParams.get('a') || urlParams.get('kutu');

  const params = new URLSearchParams();
  params.set('utm_source', utmSource);
  
  if (utmCampaign) {
    params.set('utm_campaign', utmCampaign);
  }
  
  if (rawBox) {
    const formatted = rawBox.startsWith('kutu-') ? rawBox : `kutu-${rawBox}`;
    params.set('utm_content', formatted);
  } else if (urlParams.get('utm_content')) {
    params.set('utm_content', urlParams.get('utm_content'));
  }

  return `${baseUrl}?${params.toString()}`;
};
