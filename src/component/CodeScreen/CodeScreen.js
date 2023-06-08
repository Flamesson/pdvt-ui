import React, { Component } from 'react';
import {Button, Container} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { withTranslation } from 'react-i18next';
import CreateCodeModal from './CreateCodeModal';
import CopyButton from "../CopyButton/CopyButton";
import {toast} from "react-toastify";
import Code from "./Code";
import CodeDto from "./CodeDto";
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";
import TextComponent from "./TextComponent";
import AppEvents from "../../AppEvents";
import Base64 from "../../utils/Base64";
import logger from "../../utils/Logger";

const REACT_APP_SERVER_ADDRESS: String = process.env.REACT_APP_SERVER_ADDRESS;
const SERVER_URL = "http://" + REACT_APP_SERVER_ADDRESS;

class CodeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCreateModalOpen: false,
            code: Code.empty(),
            dto: CodeDto.empty()
        };
    }

    componentDidMount() {
        this.loadCodeFromLocalStorage();
    }

    loadCodeFromLocalStorage = () => {
        if (extLocalStorage.isPresent(AppStorage.SAVED_CODE)) {
            this.setState({
                code: new Code(extLocalStorage.getItem(AppStorage.SAVED_CODE))
            });
        }
    };

    saveCodeToLocalStorage = () => {
        extLocalStorage.setItem(AppStorage.SAVED_CODE, this.state.code.getRaw());
        this.props.hub.emit(AppEvents.CODE_CHANGED, this.state.code);
    }

    deleteCodeFromLocalStorage = () => {
        extLocalStorage.remove(AppStorage.SAVED_CODE);
    }

    handleCreateCode = () => {
        this.setState({ isCreateModalOpen: true });
    };

    handleCreate = (dto: CodeDto) => {
        const t = this.props.t;
        const generatedCode = this.generateCode(dto.codeword);
        this.setState({
            isCreateModalOpen: false,
            code: new Code(generatedCode),
            dto: dto
        }, () => {
            this.saveCodeToLocalStorage();
            toast.info(t("code-screen.good-response"));
            if (this.copyFunc) {
                this.copyFunc(this.state.code.getRaw());
            }
        });
    };

    handleGenerate = () => {
        this.handleCreate(new CodeDto(uuidv4().toString()));
    }

    generateCode = (specialValue): String => {
        return Base64.encodeText(`${specialValue.length}.${SERVER_URL.length}.${specialValue}${SERVER_URL}`);
    };

    closeCreateModal = () => {
        this.setState({ isCreateModalOpen: false });
    };

    clearCode = () => {
        this.deleteCodeFromLocalStorage();
        this.setState({
            code: Code.empty(),
            dto: CodeDto.empty()
        });
    }

    render() {
        const { code, isCreateModalOpen } = this.state;
        const { t } = this.props;

        return (
            <Container className={"mt-4"}>
                <div className={"mb-4"}>
                    {code.notEmpty() ?
                        <div className={"d-flex flex-column justify-content-center align-items-center"}>
                            <div className={"d-flex flex-row justify-content-center align-items-start"}>
                                <CopyButton content={code.getRaw()} size={24} copyFunc={func => this.copyFunc = func }/>
                                <h4 className={"ml-4 text-break"}>{t('code-screen.your-code')}: </h4>
                            </div>
                            <TextComponent text={code.getRaw()}/>
                        </div>
                        :
                        <h4>{t('code-screen.no-code')}</h4>
                    }
                </div>
                <div className={"d-flex flex-row justify-content-center"}>
                    <Button variant="primary" onClick={this.handleCreateCode} className={"mr-2"}>
                        {t('code-screen.create-button')}
                    </Button>
                    <Button variant={"secondary"} onClick={this.handleGenerate} className={"mr-2"}>
                        {t('code-screen.generate-button')}
                    </Button>
                    <Button variant={"danger"} onClick={this.clearCode}>
                        {t('code-screen.clear-button')}
                    </Button>
                </div>
                {isCreateModalOpen &&
                    <CreateCodeModal
                        show={isCreateModalOpen}
                        onClose={this.closeCreateModal}
                        onCreate={this.handleCreate}
                    />
                }
            </Container>
        );
    }
}

export default withTranslation()(CodeScreen);
