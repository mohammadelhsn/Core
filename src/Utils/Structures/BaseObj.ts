import Responses from './Interfaces/Response';

export default class BaseObj {
	error: boolean;
	error_type?: string | null;
	error_message?: string | null;
	file?: string | null;
	text?: string | null;
	id?: string | null | number;
	author?: string | null;
	title?: string | null;
	link?: string | null;
	misc?: any;
	constructor(options: Responses.opts) {
		this.error = options.error ? options.error : false;
		this.error_type = options.error_type ? options.error_type : null;
		this.error_message = options.error_message ? options.error_message : null;
		this.file = options.file ? options.file : null;
		this.text = options.text ? options.text : null;
		this.id = options.id ? options.id : null;
		this.author = options.author ? options.author : null;
		this.title = options.title ? options.title : null;
		this.link = options.link ? options.link : null;
		this.misc = options.misc ? options.misc : null;
	}
}
