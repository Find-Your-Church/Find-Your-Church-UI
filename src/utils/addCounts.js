const addCounts = (counts1, counts2) => {
	let ret_obj = {};

	for(const cnt1 of Object.keys(counts1)){
		ret_obj[cnt1] = [...counts1[cnt1]];
	}

	console.log(ret_obj);
	console.log(counts2);

	for(const cnt2 of Object.keys(counts2)){
		if(ret_obj[cnt2]){
			for(let i = 0; i < counts2[cnt2].length; i++)
				ret_obj[cnt2][i] += counts2[cnt2][i];
		}
		else{
			ret_obj[cnt2] = [...counts1[cnt2]];
		}
	}
	console.log(ret_obj);

	return ret_obj;
};

export default addCounts;
