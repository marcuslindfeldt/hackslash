import { System } from "./lib/System";
import { Component } from "./lib/Component";
import uuid from "uuid";

type IteratorResult = {
  entityId: string;
  components: {
    [componentType: string]: Component;
  };
};

export class EntityManager {
  components = new Map<string, Map<string, Component>>();

  entities = new Map<string, Set<string>>();

  addComponent<K extends Component>(
    entityId: string,
    componentType: string,
    component
  ) {
    if (!this.entities.get(entityId)) {
      console.log("no entity found!");
      return false;
    }

    // add componentType to entity
    this.entities.get(entityId).add(componentType);

    const componentTypeMap =
      this.components.get(componentType) || new Map<string, K>();

    componentTypeMap.set(entityId, component);

    this.components.set(componentType, componentTypeMap);
  }

  removeComponent(entityId: string, componentType: string) {
    const componentTypeMap = this.components.get(componentType);

    if (!componentTypeMap) {
      return false;
    }

    return componentTypeMap.delete(entityId);
  }

  getComponent(entityId: string, componentType: string) {
    const map = this.components.get(componentType);
    if (map) {
      return map.get(entityId);
    }

    return null;
  }

  createEntity(): string {
    const id = uuid();

    this.entities.set(id, new Set<string>());

    return id;
  }

  deleteEntity(entityId: string) {
    const componentTypes = this.entities.get(entityId);
    this.entities.delete(entityId);

    for (const type of componentTypes) {
      const map = this.components.get(type);
      if (map) {
        map.delete(entityId);
      }
    }
  }

  *componentIterator(componentType, ...siblingTypes) {
    const cType = this.components.get(componentType);

    if (!cType) {
      return;
    }
    const typeMap = cType.entries();

    let c = typeMap.next();

    while (!c.done) {
      const [entityId, component] = c.value;

      const siblingComponents = siblingTypes.reduce((acc, siblingType) => {
        const component = this.getComponent(entityId, siblingType);

        if (component) {
          acc[siblingType] = component;
        }

        return acc;
      }, {});

      if (Object.keys(siblingComponents).length === siblingTypes.length) {
        yield {
          entityId,
          components: {
            [componentType]: component,
            ...siblingComponents
          }
        } as IteratorResult;
      }

      c = typeMap.next();
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
