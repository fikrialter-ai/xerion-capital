import original from './original-content.json';

// Verbatim copy extracted from the supplied HTML. Preserve spelling, language and capitalization.
export { original };
export const WHATSAPP = '62881027154083';
export const whatsappLink = () => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Halo Xerion Capital, saya ingin tanya program mentorship.')}`;
export const programs = original.program.items;
export const faqs = original.faq.items;
