class Style {
    get(): * {
        return [
            {
                selector: 'edge',
                style: {
                    'curve-style': 'bezier'
                }
            },
            {
                selector: 'node.selected',
                style: {
                    'min-zoomed-font-size': 0,
                    'z-index': 9999
                }
            },
            {
                selector: 'edge.selected',
                style: {
                    opacity: 0.8,
                    width: 4,
                    'z-index': 9999
                }
            },
            {
                selector: '.faded',
                style: {
                    events: 'no'
                }
            },
            {
                selector: 'node.faded',
                style: {
                    opacity: 0.08
                }
            },
            {
                selector: 'edge.faded',
                style: {
                    opacity: 0.06
                }
            },
            {
                selector: '.hidden',
                style: {
                    display: 'none'
                }
            },
            {
                selector: 'node[NodeType="default"]',
                style: {
                    'background-color': 'green',
                    'font-size': '12px',
                    width: '30px',
                    height: '30px',
                    color: 'blue',
                    'text-wrap': 'wrap',
                    'text-max-width': '100px',
                    'text-overflow-wrap': 'anywhere',
                    'border-color': 'black',
                    'border-width': '1px',
                    'text-valign': 'top',
                    'text-halign': 'center',
                    'label': 'data(label)'
                }
            },
            {
                selector: 'edge[EdgeType="default"]',
                style: {
                    width: '1px',
                    'line-color': 'black',
                    'text-max-width': '10px',
                    'target-arrow-fill': 'hollow',
                    'target-arrow-color': 'black',
                    'target-arrow-shape': 'triangle',
                    'target-distance-from-node': '5px'
                }
            },
            {
                selector: '.hidden',
                style: {
                    "display": "none"
                }
            }
        ];
    }
}

export default Style;