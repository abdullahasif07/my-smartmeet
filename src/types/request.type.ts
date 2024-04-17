export type RegisterUserRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginUserRequest = {
  email: string;
  password: string;
};

export type UpdateProfileRequest = {
  name?: string;
  avatar?: number;
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type CreateMeetingRequest = {
  meeting_name: string;
};

export type askGPTRequest = {
  message: string;
};
