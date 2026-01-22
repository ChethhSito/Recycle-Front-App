import axios from "axios";
import { urlPartners } from "../helper/url-auth";

export const partnersApi = async () => {
    try {
        const response = await axios.get(urlPartners);
        const data = await response.data;
        return data;
    } catch (error) {
        console.log(error);
    }
}
