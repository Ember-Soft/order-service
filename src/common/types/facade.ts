export interface Facade {
  getHealth: () => Promise<boolean>;
}
