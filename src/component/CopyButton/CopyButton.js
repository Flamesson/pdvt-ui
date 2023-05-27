import React from 'react';
import { withTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BsFillClipboard2CheckFill, BsFillClipboard2Fill, BsFillClipboard2XFill} from "react-icons/bs";
import AbstractComponent from "../AbstractComponent";

class CopyButton extends AbstractComponent {
    constructor(props) {
        super(props);

        this.state = {
            icon: <BsFillClipboard2Fill size={this.getSize()}/>
        }
    }

    handleCopy = () => {
        const { t, content } = this.props;

        navigator.clipboard.writeText(content).then(() => {
            toast.success(t('copy-button.success'));

            this.setState(() => {
                this.setState({
                    icon: <BsFillClipboard2CheckFill size={this.getSize()}/>
                });
            }, () => {
                setTimeout(() => {
                    this.setState({
                        icon: <BsFillClipboard2Fill size={this.getSize()}/>
                    });
                }, 5000);
            });
        }).catch((error) => {
            toast.error(t('copy-button.error'));

            this.setState(() => {
                this.setState({
                    icon: <BsFillClipboard2XFill size={this.getSize()}/>
                });
            }, () => {
                setTimeout(() => {
                    this.setState({
                        icon: <BsFillClipboard2Fill size={this.getSize()}/>
                    });
                }, 5000);
            });
        });
    };

    getSize = () => {
        return this.props.size ? this.props.size : 16;
    }

    render() {
        let icon = this.getOrElse(state => state.icon, <BsFillClipboard2Fill size={this.getSize()}/>)

        return (
            <button className="copy-button border-0 bg-transparent p-0" onClick={this.handleCopy}>
                {icon}
            </button>
        );
    }
}

export default withTranslation()(CopyButton);
