import React, {ChangeEvent, Component} from "react";
import extLocalStorage from "../utils/ext.local.storage";
import Objects from "../utils/Objects";
import {Button, ButtonGroup} from "react-bootstrap";
import {withTranslation} from "react-i18next";
import {toast} from "react-toastify";
import Buttons from "../utils/Buttons";
import Strings from "../utils/Strings";
import AppStorage from "../AppStorage";

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
        if (extLocalStorage.isPresent(AppStorage.DATA_FILE)) {
            let file = extLocalStorage.getFile(AppStorage.DATA_FILE);
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

        extLocalStorage.removeFile(AppStorage.DATA_FILE);
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
        extLocalStorage.saveFile(AppStorage.DATA_FILE, file, () => {
            this.updateRemoveFileButtonState();
        });
        this.setState({
            file: file
        });
    }

    updateRemoveFileButtonState() {
        Buttons.updateState(
            document.getElementById("delete-file-button"),
            extLocalStorage.isPresent(AppStorage.DATA_FILE)
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