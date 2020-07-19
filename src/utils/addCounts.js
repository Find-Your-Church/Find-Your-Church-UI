const addCounts = (counts1, counts2) => {
	if(Object.keys(counts2).length === 0)
		return counts1;
	let ret_obj = {};

	for(const cnt1 of Object.keys(counts1)){
		if(ret_obj[cnt1]){
			ret_obj[cnt1] += counts1[cnt1];
		}
		else{
			ret_obj = {...ret_obj, [cnt1]: counts1[cnt1]}
		}
	}

	for(const cnt2 of Object.keys(counts2)){
		if(ret_obj[cnt2]){
			ret_obj[cnt2] += counts1[cnt2];
		}
		else{
			ret_obj = {...ret_obj, [cnt2]: counts1[cnt2]}
		}
	}

	return ret_obj;
};

export default addCounts;
