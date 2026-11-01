export const server_base_endpoints = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    use_coins: "/api/auth/use-coins",
    add_coins: "/api/auth/add-coins",
  },
  user: {
    me: "/api/me",
  },
  resume: {
    upload: "/api/resume/upload",
    get_resume: "/api/resume/get-resume",
  },
  interview: {
    start: "/api/interview/start",
    answer: "/api/interview/answer",
    get: "/api/interview",
    get_all: "/api/interview/all",
  },
  billing: {
    create_order: "/api/billing/create",
    verify_payment: "/api/billing/verify",
  },
};
