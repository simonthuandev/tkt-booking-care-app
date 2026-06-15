export const getRoleLandingPath = (role) => {
  if (role === "admin") return "/app/admin/dashboard";
  if (role === "doctor") return "/app/doctor/appointments";
  return "/app/user/appointments";
};

export const getRoleSettingsPath = (role) => {
  if (role === "admin") return "/app/admin/settings";
  if (role === "doctor") return "/app/doctor/settings";
  return "/app/user/settings";
};
