const endpoints = {
  baseApi: (ipAddress: string) => `http://${ipAddress}:16021/api/v1`,
  authenticate: (ipAddress: string) => `${endpoints.baseApi(ipAddress)}/new`,
  getAllProperties: (ipAddress: string, authToken: string) =>
    `${endpoints.baseApi(ipAddress)}/${authToken}`,
};

const constants = {
  endpoints,
};

export default constants;
