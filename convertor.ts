type ConvertorNode = import('./template').ConvertorNode;

function getValueByPath(srcObj: Object, path: string): any {
	if (typeof srcObj !== 'object') {
		throw new Error('Invalid parameter [srcObj]');
	}
	if (typeof path !== 'string') {
		throw new Error('Invalid parameter [path]');
	}
	const pathArray = path.split('.');
	let tmpObj: any = srcObj;
	for (let i = 0; i < pathArray.length; i++) {
		if (tmpObj[pathArray[i]] === undefined) {
			return undefined;
		}
		tmpObj = tmpObj[pathArray[i]];
	}

	return tmpObj;
}

function setValueByPath(targetObj: any, path: string, value: any) {
	if (typeof targetObj !== 'object') {
		throw new Error('Invalid parameter [targetObj]');
	}
	if (typeof path !== 'string') {
		throw new Error('Invalid parameter [path]');
	}
	const pathArray = path.split('.');
	let currentObj = targetObj;

	for (let i = 0; i < pathArray.length - 1; i++) {
		const currentPath = pathArray[i];
		if (currentObj[currentPath] === undefined) {
			currentObj[currentPath] = {};
		}
		currentObj = currentObj[currentPath];
	}

	currentObj[pathArray[pathArray.length - 1]] = value;
}

function convert(srcObj: any, convertors: ConvertorNode[]): any {
	let res: any = {};
	convertors.forEach((cfg) => {
		let fromArr = cfg.from.split('||');
		for (let i = 0; i < fromArr.length; i++) {
			const f = fromArr[i].trim();
			let v = getValueByPath(srcObj, f);
			if (v === undefined && i + 1 < fromArr.length) {
				continue;
			}
			if (cfg.map !== undefined && Array.isArray(v)) {
				v = v.map((item) => convert(item, cfg.map!));
			}
			if (!!cfg.render) {
				let render = new Function('val, srcObj', cfg.render);
				v = render.call(res, v, srcObj);
			}
			setValueByPath(res, cfg.to || f, v);
			break;
		}
	});
	return res;
}
