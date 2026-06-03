import clienteAxios from "../api/clienteAxios";

export async function login(credentials) {
    const data = new URLSearchParams();

    data.append("username", credentials.username);
    data.append("password", credentials.password);

    const response = await clienteAxios.post(
        "/auth/login",
        data,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    return response.data;
}