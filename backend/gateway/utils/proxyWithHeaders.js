import proxy from "express-http-proxy";

export const proxyWithHeaders = (serviceUrl) => {
  return proxy(serviceUrl, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
      }

      return proxyReqOpts;
    },
  });
};

/* 

- Creates a proxy middleware that forwards requests to another microservice and adds the authenticated user's ID to the forwarded request headers.

- refer doc

 */
