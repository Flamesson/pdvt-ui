import Objects from "../utils/Objects";

class GraphStyle {
    static DEFAULT_CIRCULAR_COLOR = "#ff0000";
    static DEFAULT_MOST_LONG_PATH_START_COLOR = "#FFAAAA";
    static DEFAULT_MOST_LONG_PATH_COLOR = "#FFFF00";
    static DEFAULT_MOST_LONG_PATH_END_COLOR = "#00FFFF";
    static DEFAULT_VERSIONS_COLLISION_COLOR = "#FF00FF";
    static DEFAULT_VERSIONS_COLLISION_END_NODE_COLOR = "#D1FF52";
    static DEFAULT_POTENTIALLY_DANGEROUS_COLOR = "#5050FF";
    static DEFAULT_POTENTIALLY_DANGEROUS_INFECTED_COLOR = "#FFC000"

    constructor() {
        this.circularColor = GraphStyle.DEFAULT_CIRCULAR_COLOR;
        this.mostLongPathStartColor = GraphStyle.DEFAULT_MOST_LONG_PATH_START_COLOR;
        this.mostLongPathColor = GraphStyle.DEFAULT_MOST_LONG_PATH_COLOR;
        this.mostLongPathEndColor = GraphStyle.DEFAULT_MOST_LONG_PATH_END_COLOR;
        this.versionsCollisionColor = GraphStyle.DEFAULT_VERSIONS_COLLISION_COLOR;
        this.versionsCollisionEndNodeColor = GraphStyle.DEFAULT_VERSIONS_COLLISION_END_NODE_COLOR;
        this.potentiallyDangerousColor = GraphStyle.DEFAULT_POTENTIALLY_DANGEROUS_COLOR;
        this.potentiallyDangerousInfectedColor = GraphStyle.DEFAULT_POTENTIALLY_DANGEROUS_INFECTED_COLOR;
    }

    reset(): GraphStyle {
        return this
            .resetPotentiallyDangerousInfectedColor()
            .resetPotentiallyDangerousColor()
            .resetVersionsCollisionEndNodeColor()
            .resetVersionsCollisionColor()
            .resetMostLongPathEndColor()
            .resetMostLongPathColor()
            .resetMostLongPathStartColor()
            .resetCircularColor();
    }

    withPotentiallyDangerousInfectedColor(potentiallyDangerousInfectedColor: String): GraphStyle {
        this.potentiallyDangerousInfectedColor = potentiallyDangerousInfectedColor;
        return this;
    }

    withPotentiallyDangerousInfectedColorIfValid(potentiallyDangerousInfectedColor: String): GraphStyle {
        if (Objects.isNotCorrect(potentiallyDangerousInfectedColor)) {
            return this;
        }

        return this.withPotentiallyDangerousInfectedColor(potentiallyDangerousInfectedColor);
    }

    resetPotentiallyDangerousInfectedColor(): GraphStyle {
        return this.withPotentiallyDangerousInfectedColor(GraphStyle.DEFAULT_POTENTIALLY_DANGEROUS_INFECTED_COLOR);
    }

    withPotentiallyDangerousColor(potentiallyDangerousColor: String): GraphStyle {
        this.potentiallyDangerousColor = potentiallyDangerousColor;
        return this;
    }

    withPotentiallyDangerousColorIfValid(potentiallyDangerousColor: String): GraphStyle {
        if (Objects.isNotCorrect(potentiallyDangerousColor)) {
            return this;
        }

        return this.withPotentiallyDangerousColor(potentiallyDangerousColor);
    }

    resetPotentiallyDangerousColor(): GraphStyle {
        return this.withPotentiallyDangerousColor(GraphStyle.DEFAULT_POTENTIALLY_DANGEROUS_COLOR);
    }

    withVersionsCollisionEndNodeColor(versionsCollisionEndNodeColor: String): GraphStyle {
        this.versionsCollisionEndNodeColor = versionsCollisionEndNodeColor;
        return this;
    }

    withVersionsCollisionEndNodeColorIfValid(versionsCollisionEndNodeColor: String): GraphStyle {
        if (Objects.isNotCorrect(versionsCollisionEndNodeColor)) {
            return this;
        }

        return this.withVersionsCollisionEndNodeColor(versionsCollisionEndNodeColor);
    }

    resetVersionsCollisionEndNodeColor(): GraphStyle {
        return this.withVersionsCollisionEndNodeColor(GraphStyle.DEFAULT_VERSIONS_COLLISION_END_NODE_COLOR);
    }

    withVersionsCollisionColor(versionsCollisionColor: String): GraphStyle {
        this.versionsCollisionColor = versionsCollisionColor;
        return this;
    }

    withVersionsCollisionColorIfValid(versionsCollisionColor: String): GraphStyle {
        if (Objects.isNotCorrect(versionsCollisionColor)) {
            return this;
        }

        return this.withVersionsCollisionColor(versionsCollisionColor);
    }

    resetVersionsCollisionColor(): GraphStyle {
        return this.withVersionsCollisionColor(GraphStyle.DEFAULT_VERSIONS_COLLISION_COLOR);
    }

    withMostLongPathEndColor(mostLongPathEndColor: String): GraphStyle {
        this.mostLongPathEndColor = mostLongPathEndColor;
        return this;
    }

    withMostLongPathEndColorIfValid(mostLongPathEndColor: String): GraphStyle {
        if (Objects.isNotCorrect(mostLongPathEndColor)) {
            return this;
        }

        return this.withMostLongPathEndColor(mostLongPathEndColor);
    }

    resetMostLongPathEndColor(): GraphStyle {
        return this.withMostLongPathEndColor(GraphStyle.DEFAULT_MOST_LONG_PATH_END_COLOR);
    }

    withMostLongPathColor(mostLongPathStartColor: String): GraphStyle {
        this.mostLongPathStartColor = mostLongPathStartColor;
        return this;
    }

    withMostLongPathColorIfValid(mostLongPathStartColor: String): GraphStyle {
        if (Objects.isNotCorrect(mostLongPathStartColor)) {
            return this;
        }

        return this.withMostLongPathColor(mostLongPathStartColor);
    }

    resetMostLongPathColor(): GraphStyle {
        return this.withMostLongPathColor(GraphStyle.DEFAULT_MOST_LONG_PATH_COLOR);
    }

    withMostLongPathStartColor(mostLongPathStartColor: String): GraphStyle {
        this.mostLongPathStartColor = mostLongPathStartColor;
        return this;
    }

    withMostLongPathStartColorIfValid(mostLongPathStartColor: String): GraphStyle {
        if (Objects.isNotCorrect(mostLongPathStartColor)) {
            return this;
        }

        return this.withMostLongPathStartColor(mostLongPathStartColor);
    }

    resetMostLongPathStartColor(): GraphStyle {
        return this.withMostLongPathStartColor(GraphStyle.DEFAULT_MOST_LONG_PATH_START_COLOR);
    }

    setCircularColor(circularColor: String): void {
        this.circularColor = circularColor;
    }

    withCircularColor(circularColor: String): GraphStyle {
        this.setCircularColor(circularColor);
        return this;
    }

    withCircularColorIfValid(circularColor: String): GraphStyle {
        if (Objects.isNotCorrect(circularColor)) {
            return this;
        }

        return this.withCircularColor(circularColor);
    }

    resetCircularColor(): GraphStyle {
        return this.withCircularColor(GraphStyle.DEFAULT_CIRCULAR_COLOR);
    }
}

export default GraphStyle;