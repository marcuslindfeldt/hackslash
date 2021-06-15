import { EntityManager } from '../entityManager';

export interface System {
  // onAttach: () => void;
  update: (em: EntityManager, dt: Number) => void;
}
