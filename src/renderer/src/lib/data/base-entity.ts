type BaseEntity = {
  id: number;
  created_at: string | null;
  modified_at: string | null;
  modified_by: string | null;
  created_by: string | null;
};

export type ClientEntity<T> = BaseEntity extends T ? T : T & BaseEntity;
