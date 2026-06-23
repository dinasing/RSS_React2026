export type BookDescriptionType =
  | string
  | {
      type?: string;
      value?: string;
    };

export type BookDetailsType = {
  title: string;
  description?: BookDescriptionType;
  subjects?: string[];
  covers?: number[];
  first_publish_date?: string;
};
