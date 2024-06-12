import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "..";

export const getName = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
        const datas = await api.get("/auth/detail", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return datas;
    } catch (error) {
        console.log(error);
    }
};
