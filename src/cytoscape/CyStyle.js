import Objects from "../utils/Objects";

class CyStyle {
    static DEFAULT_NODE_COLOR = "#229C53";
    static DEFAULT_NODE_BORDER_COLOR = "#000000";
    static DEFAULT_NODE_SIZE = 30;
    static DEFAULT_EDGE_COLOR = "#000000";
    static DEFAULT_EDGE_WIDTH = 1;
    static DEFAULT_LABEL_COLOR = "#0000ff";
    static DEFAULT_LABEL_MAX_WIDTH = 100;
    static DEFAULT_LABEL_FONT_SIZE = 12;
    static DEFAULT_CIRCULAR_COLOR = "#ff0000";

    constructor(nodeColor: String,
                nodeBorderColor: String,
                nodeSize: Number,
                edgeColor: String,
                edgeWidth: Number,
                labelColor: String,
                labelMaxWidth: Number,
                labelFontSize: Number,
                circularColor: String) {

        if (Objects.isNotCorrect(nodeColor)) {
            this.nodeColor = CyStyle.DEFAULT_NODE_COLOR;
        } else {
            this.nodeColor = nodeColor;
        }
        if (Objects.isNotCorrect(nodeBorderColor)) {
            this.nodeBorderColor = CyStyle.DEFAULT_NODE_BORDER_COLOR;
        } else {
            this.nodeBorderColor = nodeBorderColor;
        }
        if (Objects.isNotCorrect(nodeSize)) {
            this.nodeSize = CyStyle.DEFAULT_NODE_SIZE;
        } else {
            this.nodeSize = nodeSize;
        }
        if (Objects.isNotCorrect(edgeColor)) {
            this.edgeColor = CyStyle.DEFAULT_EDGE_COLOR;
        } else {
            this.edgeColor = edgeColor;
        }
        if (Objects.isNotCorrect(edgeWidth)) {
            this.edgeWidth = CyStyle.DEFAULT_EDGE_WIDTH;
        } else {
            this.edgeWidth = edgeWidth;
        }
        if (Objects.isNotCorrect(labelColor)) {
            this.labelColor = CyStyle.DEFAULT_LABEL_COLOR;
        } else {
            this.labelColor = labelColor;
        }
        if (Objects.isNotCorrect(labelMaxWidth)) {
            this.labelMaxWidth = CyStyle.DEFAULT_LABEL_MAX_WIDTH;
        } else {
            this.labelMaxWidth = labelMaxWidth;
        }
        if (Objects.isNotCorrect(labelFontSize)) {
            this.labelFontSize = CyStyle.DEFAULT_LABEL_FONT_SIZE;
        } else {
            this.labelFontSize = labelFontSize;
        }
        if (Objects.isNotCorrect(circularColor)) {
            this.circularColor = CyStyle.DEFAULT_CIRCULAR_COLOR;
        } else {
            this.circularColor = circularColor;
        }
    }

    reset(): CyStyle {
        return this
            .resetNodeColor()
            .resetNodeBorderColor()
            .resetNodeSize()
            .resetEdgeColor()
            .resetEdgeWidth()
            .resetLabelColor()
            .resetLabelMaxWidth()
            .resetLabelFontSize()
            .resetCircularColor();
    }

    setNodeColor(nodeColor: String): void {
        this.nodeColor = nodeColor;
    }

    withNodeColor(nodeColor: String): CyStyle {
        this.setNodeColor(nodeColor);
        return this;
    }

    withNodeColorIfValid(nodeColor: String): CyStyle {
        if (Objects.isNotCorrect(nodeColor)) {
            return this;
        }

        return this.withNodeColor(nodeColor);
    }

    resetNodeColor(): CyStyle {
        return this.withNodeColor(CyStyle.DEFAULT_NODE_COLOR);
    }

    setNodeBorderColor(nodeBorderColor: String): void {
        this.nodeBorderColor = nodeBorderColor;
    }

    withNodeBorderColor(nodeBorderColor: String): CyStyle {
        this.setNodeBorderColor(nodeBorderColor);
        return this;
    }

    withNodeBorderColorIfValid(nodeBorderColor: String): CyStyle {
        if (Objects.isNotCorrect(nodeBorderColor)) {
            return this;
        }

        return this.withNodeBorderColor(nodeBorderColor);
    }

    resetNodeBorderColor(): CyStyle {
        return this.withNodeBorderColor(CyStyle.DEFAULT_NODE_BORDER_COLOR);
    }

    setNodeSize(nodeSize: Number): void {
        this.nodeSize = nodeSize;
    }

    withNodeSize(nodeSize: Number): CyStyle {
        this.setNodeSize(nodeSize);
        return this;
    }

    withNodeSizeIfValid(nodeSize: Number): CyStyle {
        if (Objects.isNotCorrect(nodeSize)) {
            return this;
        }

        return this.withNodeSize(nodeSize);
    }

    resetNodeSize(): CyStyle {
        return this.withNodeSize(CyStyle.DEFAULT_NODE_SIZE);
    }

    setEdgeColor(edgeColor: String): void {
        this.edgeColor = edgeColor;
    }

    withEdgeColor(edgeColor: String): CyStyle {
        this.setEdgeColor(edgeColor);
        return this;
    }

    withEdgeColorIfValid(edgeColor: String): CyStyle {
        if (Objects.isNotCorrect(edgeColor)) {
            return this;
        }

        return this.withEdgeColor(edgeColor);
    }

    resetEdgeColor(): CyStyle {
        return this.withEdgeColor(CyStyle.DEFAULT_EDGE_COLOR);
    }

    setEdgeWidth(edgeWidth: Number): void {
        this.edgeWidth = edgeWidth;
    }

    withEdgeWidth(edgeWidth: Number): CyStyle {
        this.setEdgeWidth(edgeWidth);
        return this;
    }

    withEdgeWidthIfValid(edgeWidth: Number): CyStyle {
        if (Objects.isNotCorrect(edgeWidth)) {
            return this;
        }

        return this.withEdgeWidth(edgeWidth);
    }

    resetEdgeWidth(): CyStyle {
        return this.withEdgeWidth(CyStyle.DEFAULT_EDGE_WIDTH);
    }

    setLabelColor(labelColor: String): void {
        this.labelColor = labelColor;
    }

    withLabelColor(labelColor: String): CyStyle {
        this.setLabelColor(labelColor);
        return this;
    }

    withLabelColorIfValid(labelColor: String): CyStyle {
        if (Objects.isNotCorrect(labelColor)) {
            return this;
        }

        return this.withLabelColor(labelColor);
    }

    resetLabelColor(): CyStyle {
        return this.withLabelColor(CyStyle.DEFAULT_LABEL_COLOR);
    }

    setLabelMaxWidth(labelMaxWidth: Number): void {
        this.labelMaxWidth = labelMaxWidth;
    }

    withLabelMaxWidth(labelMaxWidth: Number): CyStyle {
        this.setLabelMaxWidth(labelMaxWidth);
        return this;
    }

    withLabelMaxWidthIfValid(labelMaxWidth: Number): CyStyle {
        if (Objects.isNotCorrect(labelMaxWidth)) {
            return this;
        }

        return this.withLabelMaxWidth(labelMaxWidth);
    }

    resetLabelMaxWidth(): CyStyle {
        return this.withLabelMaxWidth(CyStyle.DEFAULT_LABEL_MAX_WIDTH);
    }

    setLabelFontSize(labelFontSize: Number): void {
        this.labelFontSize = labelFontSize;
    }

    withLabelFontSize(labelFontSize: Number): CyStyle {
        this.setLabelFontSize(labelFontSize);
        return this;
    }

    withLabelFontSizeIfValid(labelFontSize: Number): CyStyle {
        if (Objects.isNotCorrect(labelFontSize)) {
            return this;
        }

        return this.withLabelFontSize(labelFontSize);
    }

    resetLabelFontSize(): CyStyle {
        return this.withLabelFontSize(CyStyle.DEFAULT_LABEL_FONT_SIZE);
    }

    setCircularColor(circularColor: String): void {
        this.circularColor = circularColor;
    }

    withCircularColor(circularColor: String): CyStyle {
        this.setCircularColor(circularColor);
        return this;
    }

    withCircularColorIfValid(circularColor: String): CyStyle {
        if (Objects.isNotCorrect(circularColor)) {
            return this;
        }

        return this.withCircularColor(circularColor);
    }

    resetCircularColor(): CyStyle {
        return this.withCircularColor(CyStyle.DEFAULT_CIRCULAR_COLOR);
    }
}

export default CyStyle;