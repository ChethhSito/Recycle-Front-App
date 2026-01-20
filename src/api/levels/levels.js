import axios from "axios";
import { urlLevels } from "../helper/url-auth";

export const levelsApi = async () => {
    try {
        const response = await axios.get(urlLevels);
        const data = await response.data
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }

}   