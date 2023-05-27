import React, { Component } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai';
import {withTranslation} from "react-i18next";
import logger from "../../utils/Logger";

class EdgeItem extends Component {
    constructor(props) {
        super(props);

        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete(): void {
        this.props.onDeleteEdge(this.props.edge);
    };

    render() {
        const { edge } = this.props;
        logger.warn(JSON.stringify(edge));
        return (
            <ListGroup.Item>
                <span>{edge.getSource().getLabel()} → {edge.getTarget().getLabel()}</span>
                <Button variant="link" className="delete-button" onClick={this.handleDelete}>
                    <AiOutlineClose size={24} />
                </Button>
            </ListGroup.Item>
        );
    }
}

export default withTranslation()(EdgeItem);
