# Project dependencies visualization tool
UI-component of PDVT system.

Author - Aiden Izumi.

_________

## Other components:
* [Gradle](https://github.com/Flamesson/pdvt-gradle)


_________

## Checklist
* [ ] Add highlighting for most long path in graph (allow to configure the start node, by default - most depended node).
* [ ] Add highlighting for dangerous-license components (add license info input).
* [X] Add highlighting for circular dependencies.
* [X] Add showing only that nodes which label starts from value, specified in filter. Others must be blurred or removed temporary.
* [X] Update data visualization - show current source in UI.
* [ ] Create React-plugin for generation pdvt-file.
* [X] Remember input settings in storage.
* [ ] Add flexible context system for links, nodes. (f.e. - show as different api, implementation, runtime dependencies Gradle types)
* [X] Add export -> png/jpg.
* [ ] Interpret input data as plain UML components diagram (without context).
* [ ] Add versioned components parser.
* [ ] Add highlighting for possible versions collisions.
* [X] Hide/show unlinked components
* [X] Update filtering logic. Now it is searching, must be filtering.
* [X] Allow to configure base properties:
    * [X] Node color;
    * [X] Node border color;
    * [X] Line color;
    * [X] Line width;
    * [X] Node size;
    * [X] Labels width;
    * [X] Labels text size;
* [ ] Add deployment.
* [ ] Fill help.
* [X] File is deleted when clear text-area.
* [ ] Add info about nodes and edges number.
* [ ] Node selection may work incorrect with filter and search.
* [ ] **(Optional)** Add users (+ backend).
* [ ] **(Optional)** Allow to collapse header.
* [ ] **(Optional)** Add PlantUML gradle plugin.
* [X] **(Optional)** Add search
* [X] **(Optional)** When first open app flag in left corner is not displayed. 
* [X] **(Optional)** Add sample data and show toast about that for first-open app.
* [X] **(Optional)** Filter and search queries are undefined on app first-open.