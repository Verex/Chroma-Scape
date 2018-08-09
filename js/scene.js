/*
    Scene Node Class - Scene Graph Node
    A scene node contains all the children and a world and local matrix

*/
class SceneNode {
    constructor(entity) {
        this.localMatrix = mat4.create();
        this.worldMatrix = mat4.create();
        this.children = [];
        this.ent = entity;
    }
    attachTo(parent) {
        if(this.parent) {
            var cidx = this.parent.indexOf(this.ent);
            if(cidx >= 0) {
                this.parent.splice(cidx, 1);
            }
        }
        if(parent) {
            parent.children.push(this);
        }
        this.parent = parent;
    }
    update(worldMatrix) {
        if(this.ent.hasComponent(ComponentID.COMPONENT_TRANSFORM)) {
            var transformComp = this.ent.getComponent(ComponentID.COMPONENT_TRANSFORM);
            this.localMatrix = transformComp.localTransform;
            this.worldMatrix = transformComp.computeWorldTransform(worldMatrix);
        } else {
            if(worldMatrix !== undefined) {
                mat4.multiply(this.worldMatrix, worldMatrix, this.localMatrix);
            } else {
                mat4.copy(this.worldMatrix, this.localMatrix);
            }
        }
        var m = this.worldMatrix;
        this.children.forEach((child) => { child.update(m); });
    }
}

/*
    Scene Class - Recursive Node based rendering
    A scene object contains information that the renderer will render
    A scene will be a hierarchical collection of models, and cameras.
    A scene is ONLY responsible for RENDERING the data that is computed from the gameworld
    A scene will be composed of a scene graph
*/
class Scene {
    constructor() {
        this.rootNode = new SceneNode(); //Construct an empty scene node
        this.cameras = [];
        this.mainCameraID = 0;
    }
}

/*
    Scene object example top down view
    Solar System
    Anchor Points are used so that the World and Moon can spin on the yaw axis without interfering
    with their children's orbit
    Heirarchy:
        ROOT - Center of our world
         |
         |--- Sun - Sun
         |
         |---Earth Orbit - Earth Orbit Anchor Point
                  |
                  |---Earth - Actual Earth
                  |
                  |---Moon Orbit - Moon Orbit Anchor Point
                          |
                          |---Moon - Actual Moon
*/

class SolarSystemScene extends Scene {
    constructor() {
        super();

        /*
            Setup cameras and what not
        */

        //The root node will be the world origin at 0,0,0
        mat4.fromTranslation(
            this.rootNode.localMatrix,
            vec3.fromValues(0,0,0)
        );

        var sun = new SceneNode();
        mat4.fromScaling(
            sun.localMatrix,
            vec3.fromValues(6, 6, 6) //big sun
        );

        var earth = new SceneNode();
        mat4.fromScaling(
            earth.localMatrix,
            vec3.fromValues(1,1,1)
        );

        var moon = new SceneNode();
        mat4.fromScaling(
            earth.localMatrix,
            vec3.fromValues(0.3, 0.3, 0.3) // small moon
        );

        var earthorbit = new SceneNode();
        mat4.fromTranslation(
            earthorbit.localMatrix,
            vec3.fromValues(130, 0, 0) //Our earth orbit anchor point will be 130 'units' away in the x axis
        );

        var moonorbit = new SceneNode();
        mat4.fromTranslation(
            moonorbit.localMatrix,
            vec3.fromValues(30, 0, 0) //Our moon orbit will be 30 'units' away from the earth orbit anchor in the x axis
        );

        //Link up all of our nodes
        sun.attachTo(this.rootNode);
        earthorbit.attachTo(this.rootNode);
        earth.attachTo(earthorbit);
        moonorbit.attachTo(earthorbit);
        moon.attachTo(moonorbit);

    }
}
