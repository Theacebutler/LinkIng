export interface Resource {
  id: string;
  title: string;
  owner: string;
  resourceUrl: string;
  sourceUrl: string;
  sourceImage?: string;
  createdAt: string;
}

export interface ResourceFormData {
  title: string;
  resourceUrl: string;
  sourceUrl: string;
  owner: string;
}
