import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import {toast} from "react-toastify";
import Edge from "../../cytoscape/Edge";

class EdgeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sourceNode: '',
            targetNode: ''
        };
    }

    handleSourceNodeChange = (event) => {
        this.setState({ sourceNode: event.target.value });
    };

    handleTargetNodeChange = (event) => {
        this.setState({ targetNode: event.target.value });
    };

    handleAddEdge = () => {
        const { sourceNode, targetNode } = this.state;
        const { onAddEdge, nodes, edges, t } = this.props;

        // Check for duplicate edge
        const isDuplicate = edges.some((edge) => edge.sourceNode.id === sourceNode && edge.targetNode.id === targetNode);
        if (isDuplicate) {
            // Display error toast
            toast.error(t('graph-editor.toast.duplicateEdgeError'));
            return;
        }

        let source: Node = this.getById(nodes, sourceNode);
        let target: Node = this.getById(nodes, targetNode);

        onAddEdge(new Edge(source, target));

        // Clear the selected source and target nodes
        this.setState({ sourceNode: '', targetNode: '' });
    };

    getById(nodes: Node[], id): Node {
        return nodes.find(node => node.getId() === id);
    }

    render() {
        const { show, onHide, nodes, t } = this.props;
        const { sourceNode, targetNode } = this.state;

        return (
            <Modal show={show} onHide={onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{t('graph-editor.edgeModal.title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>{t('graph-editor.edgeModal.sourceNodeLabel')}</Form.Label>
                        <Form.Control as="select" value={sourceNode} onChange={this.handleSourceNodeChange}>
                            <option value="">{t('graph-editor.edgeModal.sourceNodePlaceholder')}</option>
                            {nodes.map((node) => (
                                <option key={node.id} value={node.id}>
                                    {node.getLabel()}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{t('graph-editor.edgeModal.targetNodeLabel')}</Form.Label>
                        <Form.Control as="select" value={targetNode} onChange={this.handleTargetNodeChange}>
                            <option value="">{t('graph-editor.edgeModal.targetNodePlaceholder')}</option>
                            {nodes
                                .filter((node) => node.id !== sourceNode) // Exclude the selected source node from the target node options
                                .map((node) => (
                                    <option key={node.id} value={node.id}>
                                        {node.getLabel()}
                                    </option>
                                ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        {t('graph-editor.edgeModal.cancelButton')}
                    </Button>
                    <Button variant="primary" onClick={this.handleAddEdge} disabled={!sourceNode || !targetNode}>
                        {t('graph-editor.edgeModal.addButton')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default withTranslation()(EdgeModal);
