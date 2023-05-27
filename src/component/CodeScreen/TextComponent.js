import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

class TextComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontSize: 2,
            text: props.text
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const screenWidth = window.innerWidth;
        const thresholdWidth = Math.floor(screenWidth * 0.7);

        if (screenWidth < thresholdWidth) {
            this.setState({ fontSize: 1 });
        } else {
            this.setState({ fontSize: 2 });
        }
    };

    render() {
        const { fontSize } = this.state;

        return (
            <Container>
                <p style={{ fontSize: `${fontSize}ex` }} className={"align-self-center"}>
                    { this.props.text }
                </p>
            </Container>
        );
    }
}

export default TextComponent;
