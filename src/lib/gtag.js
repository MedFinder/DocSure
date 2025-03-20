export const GA_CONVERSION_ID = 'AW-108087795189'; // Replace with your ID

export function trackConversion(eventName, params = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${GA_CONVERSION_ID}/${params.label || ''}`,
      value: params.value || 1.0,
      currency: params.currency || 'USD',
      ...params,
    });
  }
}