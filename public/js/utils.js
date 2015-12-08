class Utils {

	static hasClass(elem, className) {
		return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
	}

	static addClass(elem, className) {
		if (!Utils.hasClass(elem, className)) {
			elem.className += ' ' + className;
		}
	}

	static removeClass(elem, className) {
		var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
		if (Utils.hasClass(elem, className)) {
			while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
				newClass = newClass.replace(' ' + className + ' ', ' ');
			}
			elem.className = newClass.replace(/^\s+|\s+$/g, '');
		}
	}

	static toggleClass(elem, className) {
		var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ' ) + ' ';
		if (Utils.hasClass(elem, className)) {
			while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
				newClass = newClass.replace( ' ' + className + ' ' , ' ' );
			}
			elem.className = newClass.replace(/^\s+|\s+$/g, '');
		} else {
			elem.className += ' ' + className;
		}
	}

	static $(str){
		var id = str.replace('#', '');
		return str.indexOf('#') !== -1 ? document.getElementById(id) : document.querySelectorAll(str);
	}
}

export default Utils;

