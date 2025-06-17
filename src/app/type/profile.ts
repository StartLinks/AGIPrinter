export type Contact = {
  type: unknown;
  content: string;
};

export type ContactArray = Array<Contact>;

export type SocialEntry = {
  title: string;
  type: string;
  button: string;
  color: string;
  content: string;
  placeholder: string;
  namePlaceholder?: string;
};

export interface ScrapeResult extends
  Partial<{
    avatar: string;
    bio: string;
    // Rectify in scrapers' logic
    following: number;
    followers: number;
    praises: number;
    posts: string[];
    uid: string;
  }> {
  name: string;
  copyContent: string;
  linkContent?: string;
}

export type Social = {
  type: unknown;
  content: string;
  detail?: ScrapeResult;
};

export type SocialArray = Social[];

export interface CreationType {
  key: string;
  value: string;
  color: string;
  btnTitle: string;
}

export type Creation = {
  image: string;
  title: string;
  description: string;
  url: string;
};

export type Education = {
  image: string;
  school: string;
  degree: string;
  start: string;
  end?: string;
};

export type Experience = {
  image: string;
  place: string;
  role: string;
  start: string;
  end?: string;
};

export type ProfileType = Partial<{
  avatar: string;
  name: string;
  bio: string;
  basicInfo: BasicInfo;
  canDo: CanDoArray;
  description: string;
  contacts: ContactArray;
  socials: SocialArray;
  creations: Creation[];
  profile_link: string;
  user_link: string;
  create_time: string;
  inflationKey: string;
  inflationInProgress: string;
  inflationRequired: boolean;
  gridItems: unknown[];
  memories: unknown[];
}>;

export type ProfileResponse = ProfileType & {
  inflationRequired?: boolean;
};

export type CanDo = {
  _id: string;
  emoji?: string;
  name: string;
  description?: string;
};

export type CanDoArray = Array<CanDo>;

export type BasicInfo = Partial<{
  current_doing: string;
  role: string;
  region: Region;
  gender: string;
}>;

export type Region = {
  countryName?: string; // 国家
  provinceName?: string; // 省份
  cityName?: string; // 城市
};
