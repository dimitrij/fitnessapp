class Utils {

	static hasClass(elem, className) {
		return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
	}

	static addClass(elem, className) {
		if (!hasClass(elem, className)) {
			elem.className += ' ' + className;
		}
	}

	static removeClass(elem, className) {
		var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
		if (hasClass(elem, className)) {
			while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
				newClass = newClass.replace(' ' + className + ' ', ' ');
			}
			elem.className = newClass.replace(/^\s+|\s+$/g, '');
		}
	}

	static toggleClass(elem, className) {
		var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ' ) + ' ';
		if (hasClass(elem, className)) {
			while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
				newClass = newClass.replace( ' ' + className + ' ' , ' ' );
			}
			elem.className = newClass.replace(/^\s+|\s+$/g, '');
		} else {
			elem.className += ' ' + className;
		}
	}
}

export default Utils;

