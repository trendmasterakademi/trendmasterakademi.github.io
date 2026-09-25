/**
 * Web3Forms endpoint shared by every form on the site (contact, SOS, Crash Test, handover audit).
 * The access key is public by design (it runs in the browser) and lives only here;
 * [BUILD GUARD FORM] stops the build if any other file posts to Web3Forms with its own key.
 */
export const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
export const WEB3FORMS_KEY = 'eceed7d8-2ec5-4ae2-86bb-71fec33a50af';
