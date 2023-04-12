import React, {ChangeEvent, Component} from "react";
import extLocalStorage from "../utils/ext.local.storage";
import Constants from "../Constants";
import Objects from "../utils/Objects";
import {Button, ButtonGroup} from "react-bootstrap";
import {withTranslation} from "react-i18next";
import {toast} from "react-toastify";
import Buttons from "../utils/Buttons";
import Strings from "../utils/Strings";

class FileManage extends Component {
    constructor(props) {
        super(props);

        this.fileUploadInputId = "graph-file";

        this.handleFileChange = this.handleFileChange.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.updateRemoveFileButtonState = this.updateRemoveFileButtonState.bind(this);
    }

    componentDidMount() {
        if (extLocalStorage.isPresent(Constants.GRAPH_FILE_KEY)) {
            let file = extLocalStorage.getFile(Constants.GRAPH_FILE_KEY);
            this.setState({
                file: file
            });
        }

        this.updateRemoveFileButtonState();
    }

    uploadFile(ignored) {
        let element = document.getElementById(this.fileUploadInputId);
        element.click();
    }

    deleteFile(ignored) {
        let toDelete: File = this.state.file;

        extLocalStorage.removeFile(Constants.GRAPH_FILE_KEY);
        this.setState({
            file: null
        }, () => {
            const t = this.props.t;
            toast.success(Strings.format("{} {} {}",
                t('delete-file.success-1.toast'),
                toDelete.name,
                t('delete-file.success-2.toast')
            ));

            this.updateRemoveFileButtonState();
        });
    }

    handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (Objects.isNotCorrect(e.target.files)) {
            return;
        }

        let file = e.target.files[0];
        extLocalStorage.saveFile(Constants.GRAPH_FILE_KEY, file, () => {
            this.updateRemoveFileButtonState();
        });
        this.setState({
            file: file
        });
    }

    updateRemoveFileButtonState() {
        Buttons.updateState(
            document.getElementById("delete-file-button"),
            extLocalStorage.isPresent(Constants.GRAPH_FILE_KEY)
        );
    }

    render() {
        const state = this.state;
        let file;
        if (Objects.isCorrect(state)) {
            file = state.file;
        } else {
            file = null;
        }

        const t = this.props.t;
        return (
            <div>
                { file == null && <p>{t('p.nothing-is-upload.caption')}</p> }
                { file != null && <p>{t('p.uploaded-file.caption')} {file.name}</p> }
                <ButtonGroup>
                    <Button variant={"outline-secondary"} onClick={this.uploadFile}>
                        {t('button.upload.caption')}
                    </Button>
                    <Button id={"delete-file-button"} variant={"outline-danger"} onClick={this.deleteFile}>
                        {t('button.delete.caption')}
                    </Button>
                </ButtonGroup>
                <input id={"graph-file"} type="file" onChange={this.handleFileChange} accept={".txt, .pdvt"}
                       onInput={(e) => {
                           let file: File = e.target.files[0];
                           toast.success(Strings.format("{} {} {}",
                               t('upload-file.success-1.toast'),
                               file.name,
                               t('upload-file.success-2.toast')
                           ));
                       }}
                       hidden={true}/>
            </div>
        );
    }
}

export default withTranslation()(FileManage);