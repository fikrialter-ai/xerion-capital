import source from './original-content.json';
import { applyCapitalization } from './content-capitalization.js';

// Original wording with the capitalization cleanup requested by the user.
const original = applyCapitalization(source);
export { original };
export const WHATSAPP = '62881027154083';
export const whatsappLink = () => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Halo Xerion Capital, saya ingin tanya program mentorship.')}`;
export const programs = original.program.items;
export const faqs = original.faq.items;
