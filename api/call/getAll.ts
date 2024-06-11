import api from "..";

export const getAll = async () => {
    const response = await api.get("/all");

    return response.data;
};
