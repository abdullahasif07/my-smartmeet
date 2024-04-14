export const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : 'https://smart-meet-api.hammad-tariq.me';

export const AGORA_APP_ID =
  '23ec3cbb38b142f7b1cf5b76f01619a9';

export const USERS_URL = `${BASE_URL}/api/users`;

export const avatars: {
  src: string;
}[] = [
  {
    src: '/avatars/2754574_business_people_person_man_male_avatar_face_user.svg',
  },
  {
    src: '/avatars/2754575_male_people_business_user_face_avatar_man_avatar.svg',
  },
  {
    src: '/avatars/2754576_people_business_user_face_avatar_avatar_woman_female.svg',
  },
  {
    src: '/avatars/2754577_people_business_avatar_user_goatee_man_avatar_face_user.svg',
  },
  {
    src: '/avatars/2754578_face_user_avatar_male_man_avatar_user_business_people.svg',
  },
  {
    src: '/avatars/2754579_avatar_man_business man_avatar_face_user_business_people.svg',
  },
  {
    src: '/avatars/2754580_people_female_business_user_face_avatar_woman_business woman_avatar.svg',
  },
  {
    src: '/avatars/2754581_avatar_business_user_face_avatar_woman_people_user_female.svg',
  },
  {
    src: '/avatars/2754582_people_man_business man_avatar_face_user_business_avatar.svg',
  },
  {
    src: '/avatars/2754583_user_people_business_user_face_avatar_man_avatar.svg',
  },
  {
    src: '/avatars/2754584_avatar_people_business_user_face_avatar_woman_female.svg',
  },
] as const;
