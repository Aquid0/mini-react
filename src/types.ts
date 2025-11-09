export type VNode = {
  type: string | Function;
  props: Record<string, any> | null;
  children: Array<VNode | string>;
  key?: string | number | null;
  dom?: Node | null;
  fiber?: Fiber | null;
};

export type Fiber = {
  type: Function;
  props: any;
  dom: Node | null;
  alternate: Fiber | null;
  hooks: any[] | null;
};

export type UpdateOperation = "MOUNT" | "UNMOUNT" | "UPDATE" | "REPLACE";
