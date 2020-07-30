import axios from "axios";
import app_config from "../conf/config";

export const getThumbnail = async (info) => {
	const res = await axios.post(app_config.FYC_API_URL + "/api/pub/get-thumbnail", info);

	return res.data;
};
