// Google Analytics Event Tracking Utilities

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const trackKeyPageView = (pageName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'Key Page View', {
      page_title: pageName,
      page_location: window.location.href
    });
  }
};

export const trackPilotLead = (source: string, formType: string) => {
  const eventMap: { [key: string]: string } = {
    'dgca': 'DGCA Pilot Lead',
    'helicopter': 'Heli Pilot Lead', 
    'abroad': 'Pilot Abroad Lead'
  };
  
  const eventName = eventMap[source] || 'Pilot Web Lead'; // fallback
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      form_type: formType,
      source: source,
      page_location: window.location.href
    });
  }
};

