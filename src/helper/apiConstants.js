export const BASE_URL = 'https://dev.admin.shiftable.ca/';

export const GET = 'get';
export const POST = 'post';
export const PUT = 'put';
export const DELETE = 'delete';

export const apiConst = {
  // clinicOwnerUri
  forgetPassowrd: `${BASE_URL}api/job-seeker/auth/forgot-password`,
  resendOtp: `${BASE_URL}api/job-seeker/auth/resend-otp`,
  updatePassword: `${BASE_URL}api/job-seeker/auth/update-password`,
  login: `${BASE_URL}api/job-seeker/auth/login`,
  refreshToken: `${BASE_URL}api/job-seeker/auth/refresh`,
  logout: `${BASE_URL}api/job-seeker/auth/logout`,
  googleLogin: `${BASE_URL}api/job-seeker/auth/login/google`,

  getOpenedJobs: (pageCount, date) =>
    `${BASE_URL}api/job-seeker/jobs/open?page=${pageCount}&date=${date}`,
  getAppliedJobs: (pageCount, date) =>
    `${BASE_URL}api/job-seeker/jobs/applied?page=${pageCount}&date=${date}`,
  applyForJob: jobId => `${BASE_URL}api/job-seeker/jobs/${jobId}`,
  jobDetails: jobId => `${BASE_URL}api/job-seeker/jobs/${jobId}`,
  cancelJobForClinic: jobId => `${BASE_URL}api/job-seeker/jobs/${jobId}/cancel`, //put

  getShifts: pageCount => `${BASE_URL}api/job-seeker/shifts?page=${pageCount}`,
  cancelShifts: shiftId => `${BASE_URL}api/job-seeker/shifts/${shiftId}/cancel`, //PUT
  sendInvoiceToShiftClinic: shiftId =>
    `${BASE_URL}api/job-seeker/shifts/${shiftId}/invoices/send`, //POST
  reviewShiftClinic: shiftId =>
    `${BASE_URL}api/job-seeker/shifts/${shiftId}/review`, //POst

  getFavorites: `${BASE_URL}api/job-seeker/favorites`,
  addFavorites: jobId => `${BASE_URL}api/job-seeker/favorites/job/${jobId}} `, //POST
  removeFavorites: jobId => `${BASE_URL}api/job-seeker/favorites/${jobId}} `, //DELETE

  getUserProfileDetails: `${BASE_URL}api/job-seeker/profile`, //get
  updateUserProfileDetails: `${BASE_URL}api/job-seeker/profile`, //post
  userAvatar: `${BASE_URL}api/job-seeker/profile/avatar`,

  getNotifications: `${BASE_URL}api/job-seeker/notifications`,
};
