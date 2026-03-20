export interface Resource {
  id: string;
  title: string;
  resourceUrl: string;
  sourceUrl: string;
  createdAt: string;
}

export interface ResourceFormData {
  title: string;
  resourceUrl: string;
  sourceUrl: string;
}
