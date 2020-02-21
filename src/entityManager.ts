import { System } from "./lib/System";
import { Component } from "./lib/Component";
import { Motion } from "./components/Motion";
import uuid from "uuid";

// const entityId = ecs.createEntity() // unique id, stored in hashmap

// ecs.addComponent<Motion>(entityId, { x: 0, y: 0}) // component needs a type
// ecs.removeComponent<Motion>(entityId) // component needs a type

// ecs.removeEntity(entityId) // needs to remove all components for entity.

// empty entities can exist, its fine

// you always have to define what components you want to remove? No! not if you delete an entity, entities needs references to the types of components that is attached to it.

// deleting single entity should be O( nr of components in it),
// looping over component tuples should be be O(n) with each component lookup for single entity O(1)
// loop should only go over primary component (first in iterator args)
// should be able to get entityId from within itr
// should be able to delete entity from within itr
// should be able to get sibling components from within itr
// should be able to add sibling components from within itr
// should be able to remove sibling components from within itr

// update(ecs) {
//   const itr = ecs.query('motion', 'move')

//   // iterate component tuples
//   for (const entity of itr) {
//     entity.remove()
//     entity.removeComponent()
//   }
// }

type IteratorResult = {
  entityId: string;
  components: {
    [componentType: string]: Component;
  };
};

export class EntityManager {
  components = new Map<string, Map<string, Component>>();

  entities = new Map<string, Set<string>>();

  //  how do i delete an entity?

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
