window._gaq = window._gaq || [];
window._gaq.push(['_setAccount', __GA_TRACK_ID__]);
window._gaq.push(['_trackPageview']);

const ga = document.createElement('script');
ga.type = 'text/javascript';
ga.async = true;
ga.src = 'https://ssl.google-analytics.com/ga.js';
const s = window.document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(ga, s);
