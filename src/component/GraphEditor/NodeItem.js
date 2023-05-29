import React, {Component} from "react";
import {Button, FormControl, ListGroup} from "react-bootstrap";
import { InputGroup } from 'react-bootstrap';
import {FaCheck} from "react-icons/fa";
import {FaTimes} from "react-icons/fa";
import {withTranslation} from "react-i18next";
import Node from "../../cytoscape/Node";

class NodeItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            newName: props.node.getLabel(),
        };
    }

    handleStartEditing = () => {
        this.setState({
            isEditing: true,
        });
    };

    handleFinishEditing = () => {
        const { node, onRenameNode } = this.props;
        const { newName } = this.state;

        if (newName.trim() === '') {
            return;
        }

        onRenameNode(node.id, newName);

        this.setState({
            isEditing: false,
        });
    };

    handleCancelEditing = () => {
        this.setState({
            isEditing: false,
            newName: this.props.node.getLabel(),
        });
    };

    handleChangeName = (e) => {
        this.setState({
            newName: e.target.value,
        });
    };

    render() {
        let node: Node = this.props.node;
        const t = this.props.t;
        let { isEditing, newName } = this.state;

        if (isEditing) {
            return (
                <InputGroup className="mb-3">
                    <FormControl value={newName} onChange={this.handleChangeName} />
                        <Button variant="outline-success" onClick={this.handleFinishEditing}>
                            <FaCheck />
                        </Button>
                        <Button variant="outline-secondary" onClick={this.handleCancelEditing}>
                            <FaTimes />
                        </Button>
                </InputGroup>
            );
        }

        return (
            <ListGroup.Item>
                <span>{node.getLabel()}</span>
                <Button variant="danger" onClick={() => this.props.onDeleteNode(node)}>
                    <FaTimes />
                </Button>
                <Button variant="primary" onClick={this.handleStartEditing}>
                    {t('graph-editor.rename-node')}
                </Button>
            </ListGroup.Item>
        );
    }
}

export default withTranslation()(NodeItem);