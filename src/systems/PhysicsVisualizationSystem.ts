import { System } from "../lib/System";
import { EntityManager } from "../entityManager";
import { Physics } from "../components/Physics";
import * as PIXI from "pixi.js";
import { PolygonShape, Vec2 } from "planck-js";
import { PPM } from "../constants";

export class PhysicsVisualizationSystem implements System {
  graphics: PIXI.Graphics;

  constructor(pixi) {
    this.graphics = new PIXI.Graphics();
    pixi.stage.addChild(this.graphics);
  }

  update(em: EntityManager, dt: number) {
    const itr = em.componentIterator(Physics.typeName);
    this.graphics.clear();

    for (const { components: { physics }} of itr) {
      const body = physics.body;
      this.graphics.lineStyle(1, 0xff2cb4);

      // Convert physics body meter values to pixels
      const pos = body
        .getPosition()
        .clone()
        .mul(PPM);

      const angle = body.getAngle();
      // TODO: This should be calculated from size of bounding box
      const dist = 64;

      let xx = pos.x + dist * Math.cos(angle);
      let yy = pos.y + dist * Math.sin(angle);

      this.graphics.moveTo(pos.x, pos.y);
      this.graphics.lineTo(xx, yy);

      for (
        var fixture = body.getFixtureList();
        fixture;
        fixture = fixture.getNext()
      ) {
        // draw or update fixture

        var type = fixture.getType();
        var shape = fixture.getShape();

        if (type == "polygon") {
          const polygon = shape as PolygonShape;

          const vertices = polygon.m_vertices.map(v =>
            Vec2(v.x * PPM, v.y * PPM)
          );

          let a = Vec2.add(pos, vertices[0]);

          this.graphics.moveTo(a.x, a.y);

          for (var i = 1; i < vertices.length; ++i) {
            let p = Vec2.add(pos, vertices[i]);

            this.graphics.lineTo(p.x, p.y);
          }

          this.graphics.lineTo(a.x, a.y);
        } else {
          console.log("physics body type graphics not implemented!", type);
        }
      }
    }
  }
}
