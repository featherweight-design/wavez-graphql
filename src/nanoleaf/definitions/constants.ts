const endpoints = {
  baseApi: (ipAddress: string): string => `http://${ipAddress}:16021/api/v1`,
  authenticate: (ipAddress: string): string =>
    `${endpoints.baseApi(ipAddress)}/new`,
  get: {
    effects: (ipAdress: string, authToken: string): string =>
      `${endpoints.baseApi(ipAdress)}/${authToken}/effects`,
    effectsList: (ipAddress: string, authToken: string): string =>
      `${endpoints.baseApi(ipAddress)}/${authToken}/effects/effectsList`,
    properties: (ipAddress: string, authToken: string): string =>
      `${endpoints.baseApi(ipAddress)}/${authToken}`,
  },
  update: {
    effect: (ipAddress: string, authToken: string): string =>
      `${endpoints.baseApi(ipAddress)}/${authToken}/effects`,
    state: (ipAddress: string, authToken: string): string =>
      `${endpoints.baseApi(ipAddress)}/${authToken}/state`,
  },
};

const constants = {
  endpoints,
};

export default constants;
