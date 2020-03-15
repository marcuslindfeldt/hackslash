import { System } from "./lib/System";
import { Component } from "./lib/Component";
import uuid from "uuid";
import { Components } from './components';

type EntityId = string;
type ComponentType = keyof Components;

type EntitySlice<T extends ComponentType> = {
  entityId: EntityId;
  components: Pick<Components, T>;
};

export class EntityManager {
  components = new Map<ComponentType, Map<EntityId, Component>>();

  entities = new Map<EntityId, Set<ComponentType>>();

  addComponent<T extends ComponentType>(
    entityId: EntityId,
    componentType: T,
    component: Components[T]
  ) {
    if (!this.entities.get(entityId)) {
      console.log("no entity found!");
      return false;
    }

    // add componentType to entity
    this.entities.get(entityId).add(componentType);

    const componentTypeMap =
      this.components.get(componentType) || new Map<string, Components[T]>();

    componentTypeMap.set(entityId, component);

    this.components.set(componentType, componentTypeMap);
  }

  removeComponent(entityId: EntityId, componentType: ComponentType) {
    const componentTypeMap = this.components.get(componentType);

    if (!componentTypeMap) {
      return false;
    }

    return componentTypeMap.delete(entityId);
  }

  getComponent<T extends ComponentType>(entityId: string, componentType: T): Components[T] {
    const map = this.components.get(componentType);
    if (map) {
      return map.get(entityId) as Components[T];
    }

    return null;
  }

  createEntity(): EntityId {
    const id = uuid();

    this.entities.set(id, new Set<ComponentType>());

    return id;
  }

  deleteEntity(entityId: EntityId) {
    const componentTypes = this.entities.get(entityId);
    this.entities.delete(entityId);

    for (const type of componentTypes) {
      const map = this.components.get(type);
      if (map) {
        map.delete(entityId);
      }
    }
  }

  *componentIterator<T extends ComponentType>(componentType: T, ...siblingTypes: T[]): IterableIterator<EntitySlice<T>> {
    const entityComponentMap = this.components.get(componentType);

    if (!entityComponentMap) {
      return;
    }

    for (const [entityId, component] of entityComponentMap) {
      const siblingComponents = siblingTypes.reduce<Partial<Pick<Components, T>>>((acc, siblingType) => {
        const siblingComponent = this.getComponent(entityId, siblingType);

        if (siblingComponent) {
          acc[siblingType] = siblingComponent;
        }

        return acc;
      }, {});

      if (Object.keys(siblingComponents).length === siblingTypes.length) {
        yield {
          entityId,
          components: {
            [componentType]: component as Components[T],
            ...siblingComponents as any
          }
        };
      }
    }
  }

  constructor() {}
}

export class ECS {
  systems: System[] = [];
  entityManager = new EntityManager();

  constructor() {}

  addSystem(system: System) {
    // system.onAttach();

    this.systems.push(system);
  }

  update(dt: Number) {
    this.systems.forEach(system => system.update(this.entityManager, dt));
  }
}
