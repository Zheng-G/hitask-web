/* eslint-disable */
const config = {
	app_id: __INTERCOM_APP_ID__,
};

(function() {
	var w = window;
	var ic = w.Intercom;
	if (typeof ic === 'function') {
		ic('reattach_activator');
		ic('update', config);
	} else {
		var d = document;
		var i = function() {
			i.c(arguments);
		};
		i.q = [];
		i.c = function(args) {
			i.q.push(args);
		};
		w.Intercom = i;

		function l() {
			var s = d.createElement('script');
			s.type = 'text/javascript';
			s.async = true;
			s.src = `https://widget.intercom.io/widget/${__INTERCOM_APP_ID__}`;
			var x = d.getElementsByTagName('script')[0];
			x.parentNode.insertBefore(s, x);
		}
		if (w.attachEvent) {
			w.attachEvent('onload', l);
		} else {
			w.addEventListener('load', l, false);
		}
	}
})();
