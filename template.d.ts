export type JsFuncBodyString = string;

export type ConvertorNode = {
	from: string;
	to: string;
	render?: JsFuncBodyString;
	map?: ConvertorNode[];
};

export type ConvertorConfigure = {
	convertors: ConvertorNode[];
};
