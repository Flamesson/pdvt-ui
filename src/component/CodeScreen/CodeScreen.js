import React, { Component } from 'react';
import {Button, Container, Spinner} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { withTranslation } from 'react-i18next';
import CreateCodeModal from './CreateCodeModal';
import CopyButton from "../CopyButton/CopyButton";
import axios from "axios";
import {toast} from "react-toastify";
import Objects from "../../utils/Objects";
import Code from "./Code";
import CodeDto from "./CodeDto";
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";
import TextComponent from "./TextComponent";
import ApplyCodeModal from "./ApplyCodeModal";
import DeleteCodeModal from "./DeleteCodeModal";
import AppEvents from "../../AppEvents";

const REACT_APP_SERVER_ADDRESS: String = process.env.REACT_APP_SERVER_ADDRESS;
const SERVER_URL = "http://" + REACT_APP_SERVER_ADDRESS;
const PLAIN_TEXT_HEADERS = {
    headers: {
        'Content-Type': 'text/plain'
    }
};

class CodeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditModalOpen: false,
            isApplyModalOpen: false,
            isCreateModalOpen: false,
            isDeleteModalOpen: false,
            loading: false,
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
        extLocalStorage.remove(AppStorage.SAVED_PASS_LENGTH);
    }

    handleEditCode = () => {
        this.setState({ isEditModalOpen: true });
    };

    handleCreateCode = () => {
        this.setState({ isCreateModalOpen: true });
    };

    handleApplyCode = () => {
        this.setState({ isApplyModalOpen: true });
    }

    handleDeleteCode = () => {
        this.setState({ isDeleteModalOpen: true });
    }

    handleApply = (dto: CodeDto) => {
        const t = this.props.t;
        const generatedCode = this.generateCode(dto.codeword, dto.password);
        this.setState({
            isApplyModalOpen: false,
            loading: true
        }, () => {
            axios.post(SERVER_URL + `/client/${dto.codeword}/check-exists`, generatedCode, PLAIN_TEXT_HEADERS)
                .then(response => {
                    let result = response.data;
                    if (result === false) {
                        this.setState({
                            loading: false
                        }, () => {
                            toast.error(t("code-screen.code-not-exists", { position: "top-center" }));
                        });
                    } else if (result === true) {
                        this.setState({
                            code: new Code(generatedCode),
                            dto: dto,
                            loading: false
                        }, () => {
                            this.saveCodeToLocalStorage();
                            toast.info(t("code-screen.applied-code"));
                        });
                    }
                })
                .catch(this.onApplyError);
        });
    }

    handleCreate = (dto: CodeDto) => {
        const t = this.props.t;
        const generatedCode = this.generateCode(dto.codeword, dto.password);
        this.setState({
            isCreateModalOpen: false,
            isEditModalOpen: false,
            loading: true
        }, () => {
            axios.post(SERVER_URL + `/client/${dto.codeword}/create-if-absent`, generatedCode, PLAIN_TEXT_HEADERS)
                .then(ignored => {
                    this.setState({
                        code: new Code(generatedCode),
                        dto: dto,
                        loading: false
                    }, () => {
                        this.saveCodeToLocalStorage();
                        toast.info(t("code-screen.good-response"));
                    });
                })
                .catch(this.onCreateError);
        });
    };

    handleDelete = (dto: CodeDto) => {
        const t = this.props.t;
        const generatedCode = this.generateCode(dto.codeword, dto.password);
        this.setState({
            isDeleteModalOpen: false,
            loading: true
        }, () => {
            axios.post(SERVER_URL + `/client/${dto.codeword}/delete`, generatedCode, PLAIN_TEXT_HEADERS)
                .then(ignored => {
                    this.setState({
                        code: Code.empty(),
                        dto: CodeDto.empty(),
                        loading: false
                    }, () => {
                        this.deleteCodeFromLocalStorage();
                        toast.info(t("code-screen.successfully-deleted"));
                    });
                })
                .catch(this.onApplyError);
        });
    }

    onApplyError = (error) => {
        this.onError(error,
            "code-screen.no-connection-to-backend",
            "code-screen.apply-bad-request",
            "code-screen.apply-bad-request",
            "code-screen.request-failed"
        );
    }

    onCreateError = (error) => {
        this.onError(error,
            "code-screen.no-connection-to-backend",
            "code-screen.bad-request",
            "code-screen.bad-request",
            "code-screen.request-failed"
        );
    }

    onError = (error, onDisconnectedKey, onForbiddenKey, onBadRequestKey, onDefaultKey): void => {
        this.setState({
            loading: false
        }, () => {
            let disconnected = Objects.isNotCorrect(error.response);
            let badRequest = Objects.isCorrect(error.response) && error.response.status === 400;
            let forbidden = Objects.isCorrect(error.response) && error.response.status === 403;

            const t = this.props.t;
            let key;
            if (disconnected) {
                key = onDisconnectedKey;
            } else if (badRequest) {
                key = onBadRequestKey;
            } else if (forbidden) {
                key = onForbiddenKey;
            } else {
                key = onDefaultKey;
            }

            toast.error(t(key), { position: "top-center" })
        });
    }

    handleGenerate = () => {
        this.handleCreate(new CodeDto(uuidv4().toString(), null, 0));
    }

    generateCode = (specialValue, password): String => {
        let toEncode;
        if (password) {
            toEncode = `${specialValue.length}.${SERVER_URL.length}.${password.length}.${specialValue}${SERVER_URL}${password}`
        } else {
            toEncode = `${specialValue.length}.${SERVER_URL.length}.0.${specialValue}${SERVER_URL}`
        }

        return btoa(toEncode);
    };

    closeEditModal = () => {
        this.setState({ isEditModalOpen: false });
    };

    closeCreateModal = () => {
        this.setState({ isCreateModalOpen: false });
    };

    closeApplyModal = () => {
        this.setState({ isApplyModalOpen: false });
    };

    closeDeleteModal = () => {
        this.setState({ isDeleteModalOpen: false });
    }

    render() {
        const { code, dto, isEditModalOpen, isCreateModalOpen, isApplyModalOpen, isDeleteModalOpen, loading } = this.state;
        const { t } = this.props;

        return (
            <Container className={"mt-4"}>
                {loading ? <div className={"d-flex flex-row justify-content-center"}>
                    <Spinner as="span" className={"mr-4"} animation="border" size={"m"} role="status" aria-hidden="true" />
                    <p className="text-3">{t("code-screen.request-to-backend")}</p>
                </div> : <div/>}

                <div className={"mb-4"}>
                    {code.notEmpty() ?
                        <div className={"d-flex flex-column justify-content-center align-items-center"}>
                            <div className={"d-flex flex-row justify-content-center align-items-start"}>
                                <CopyButton content={code.getRaw()} size={24}/>
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
                    {/*<Button variant="primary" onClick={this.handleEditCode} className={"mr-2"}>
                        {t('code-screen.edit-button')}
                    </Button>*/}
                    <Button variant="primary" onClick={this.handleApplyCode} className={"mr-2"}>
                        {t('code-screen.apply-button')}
                    </Button>
                    <Button variant={"secondary"} onClick={this.handleGenerate} className={"mr-2"}>
                        {t('code-screen.generate-button')}
                    </Button>
                    <Button variant="danger" onClick={this.handleDeleteCode}>
                        {t('code-screen.delete-button')}
                    </Button>
                </div>
                {isCreateModalOpen &&
                    <CreateCodeModal
                        show={isCreateModalOpen}
                        onClose={this.closeCreateModal}
                        onCreate={this.handleCreate}
                    />
                }
                {isApplyModalOpen &&
                    <ApplyCodeModal
                        show={isApplyModalOpen}
                        onClose={this.closeApplyModal}
                        onApply={this.handleApply}
                    />
                }
                {isDeleteModalOpen &&
                    <DeleteCodeModal
                        show={isDeleteModalOpen}
                        onClose={this.closeDeleteModal}
                        onDelete={this.handleDelete}
                    />
                }
            </Container>
        );
    }
}

export default withTranslation()(CodeScreen);
