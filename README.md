# Project dependencies visualization tool
UI-component of PDVT system.

Author - Aiden Izumi.

_________

## Checklist
* [ ] Add highlighting for most long path in graph (allow to configure the start node, by default - most depended node).
* [ ] Add highlighting for dangerous-license components (add license info input).
* [ ] Add highlighting for circular dependencies.
* [ ] Add showing only that nodes which label starts from value, specified in filter. Others must be blurred or removed temporary.
* [ ] Update data visualization - show current source in UI.
* [ ] Create React-plugin for generation pdvt-file.
* [ ] Remember input settings in storage.
* [ ] Add flexible context system for links, nodes. (f.e. - show as different api, implementation, runtime dependencies Gradle types)
* [ ] Add export -> png/jpg.
* [ ] Interpret input data as plain UML components diagram (without context).
* [ ] Allow to configure base properties:
    * [ ] Node color;
    * [ ] Node border color;
    * [ ] Line color;
    * [ ] Line width;
    * [ ] Node size;
    * [ ] Labels width;
    * [ ] Labels text size;
* [ ] Add deployment.
* [ ] **(Optional)** Add users (+ backend).
* [ ] **(Optional)** Allow to collapse header.
* [ ] **(Optional)** Add PlantUML gradle plugin.