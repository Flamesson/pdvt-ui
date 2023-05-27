import React, { Component } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import CodeDto from "./CodeDto";
import Objects from "../../utils/Objects";

class EditCodeModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            code: props.code,
            dto: props.dto,
            codeword: props.code.hasCodeword() ? props.code.getCodeword() : '',
            password: '',
            userTouchedPassword: false,
            validated: false,
            valid: false
        };
    }

    handleChangeCodeword = (event) => {
        this.setState({ codeword: event.target.value });
    };

    handleChangePassword = (event) => {
        this.setState({ password: event.target.value });
    };

    handleSave = () => {
        if (this.state.valid === false) {
            return;
        }

        const { onSave } = this.props;
        const { codeword } = this.state;

        let password;
        if (this.state.userTouchedPassword) {
            password = this.state.password;
        } else {
            password = this.state.code.getPassword();
        }

        onSave(new CodeDto(codeword, password, Objects.isCorrect(password) ? password.length : 0));
    };

    handleSubmit = (event) => {
        const form = event.currentTarget;
        let valid = form.checkValidity();
        event.preventDefault();
        if (valid === false) {
            event.stopPropagation();
            this.setState({
                validated: true,
                valid: false
            });
        } else {
            this.setState({
                validated: true,
                valid: true
            }, this.handleSave);
        }
    };

    render() {
        const { show, onClose, t } = this.props;
        const { specialValue } = this.state;

        let password;
        if (!this.state.userTouchedPassword && this.state.code.hasPassword()) {
            password = " ".repeat(this.state.dto.rawPasswordLength);
        } else {
            password = this.state.password;
        }

        return (
            <Modal show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('code-screen.edit-modal-title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id={"form"} noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                        <Form.Group className={"mb-4"}>
                            <Form.Label>{t('code-screen.special-value-label')}</Form.Label>
                            <Form.Control type="text" value={specialValue} onChange={this.handleChangeCodeword} required/>
                            <Form.Control.Feedback type="invalid">
                                {t("code-screen.fill-code")}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className={"mb-4"}>
                            <Form.Label>{t('code-screen.password-label')}</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={this.handleChangePassword}
                            />
                        </Form.Group>

                        <Button type={"submit"} variant="primary" onClick={this.handleSave} className={"mr-3"}>
                            {t('code-screen.save-button')}
                        </Button>
                        <Button variant="secondary" onClick={onClose}>
                            {t('code-screen.close-button')}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }
}

export default withTranslation()(EditCodeModal);
