export type EventType =
  | "lock"
  | "release"
  | "scrolldown"
  | "append"
  | "checkfailed"
  | "removechild"
  | "imageload"
  | "windowresize";

export default class _default {
  constructor(opts: any);
  target: HTMLElement;
  interval: number;
  max: number;
  callback: () => void;
  userScroll: boolean;
  spinner: string;
  spin_img: HTMLImageElement;
  stickyHeight: number;
  intend_down: boolean;
  mo: MutationObserver;
  append(newel: HTMLElement): void;
  checkdown(): void;
  emit(type: EventType, msg: string): void;
  isdown(): boolean;
}
