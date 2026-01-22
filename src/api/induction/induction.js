import axios from "axios";
import { urlInduction } from "../helper/url-auth";

export const inductionApi = async () => {
    try {
        const response = await axios.get(urlInduction);
        const data = await response.data;
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const registerViewApi = async (id) => {
    try {
        const response = await axios.patch(`${urlInduction}/${id}/view`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
