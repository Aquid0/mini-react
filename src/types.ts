export type VNode = {
  type: string | Function;
  props: Record<string, any> | null;
  children: Array<VNode | string>;
  key?: string | number | null;
};

export type Fiber = {
  type: Function;
  props: any;
  dom: Node | null;
  alternate: Fiber | null;
  hooks: any[] | null;
};
