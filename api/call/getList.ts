import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "..";

export const getList = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
        const res = await api.get("/list", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        console.log(error);
    }
};
