import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';

class NodeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodeName: '',
        };
    }

    handleNodeNameChange = (e) => {
        this.setState({ nodeName: e.target.value });
    };

    handleAddNode = () => {
        const { nodeName } = this.state;
        const { onAddNode, t } = this.props;

        if (nodeName.trim() === '') {
            // Show toast or error message indicating that the node name cannot be empty
            return;
        }

        onAddNode(nodeName);
        this.setState({ nodeName: '' });
    };

    render() {
        const { nodeName } = this.state;
        const { show, onHide, t } = this.props;

        return (
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('graph-editor.nodeModal.title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>{t('graph-editor.nodeModal.nodeNameLabel')}</Form.Label>
                        <Form.Control
                            type="text"
                            value={nodeName}
                            onChange={this.handleNodeNameChange}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        {t('graph-editor.nodeModal.cancelButton')}
                    </Button>
                    <Button variant="primary" onClick={this.handleAddNode}>
                        {t('graph-editor.nodeModal.addButton')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default withTranslation()(NodeModal);
