import Objects from "../utils/Objects";
import GraphStyle from "./GraphStyle";

class CyStyle {
    static DEFAULT_NODE_COLOR = "#229C53";
    static DEFAULT_NODE_BORDER_COLOR = "#000000";
    static DEFAULT_NODE_SIZE = 30;
    static DEFAULT_EDGE_COLOR = "#000000";
    static DEFAULT_EDGE_WIDTH = 1;
    static DEFAULT_LABEL_COLOR = "#0000ff";
    static DEFAULT_LABEL_MAX_WIDTH = 100;
    static DEFAULT_LABEL_FONT_SIZE = 12;

    constructor() {
        this.nodeColor = CyStyle.DEFAULT_NODE_COLOR;
        this.nodeBorderColor = CyStyle.DEFAULT_NODE_BORDER_COLOR;
        this.nodeSize = CyStyle.DEFAULT_NODE_SIZE;
        this.edgeColor = CyStyle.DEFAULT_EDGE_COLOR;
        this.edgeWidth = CyStyle.DEFAULT_EDGE_WIDTH;
        this.labelColor = CyStyle.DEFAULT_LABEL_COLOR;
        this.labelMaxWidth = CyStyle.DEFAULT_LABEL_MAX_WIDTH;
        this.labelFontSize = CyStyle.DEFAULT_LABEL_FONT_SIZE;
        this.graphStyle = new GraphStyle();
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
            .resetGraphStyle();
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

    withGraphStyle(graphStyle: GraphStyle): CyStyle {
        this.graphStyle = graphStyle;
        return this;
    }

    resetGraphStyle(): CyStyle {
        return this.withGraphStyle(new GraphStyle());
    }
}

export default CyStyle;