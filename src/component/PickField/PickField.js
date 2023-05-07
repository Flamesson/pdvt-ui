import React from "react";
import { Component } from 'react';
import {withTranslation} from "react-i18next";

import Select from 'react-select';
import { defaultTheme } from 'react-select';
import {Button} from "react-bootstrap";
import Objects from "../../utils/Objects";
import Optional from "../../utils/Optional";

import "./PickField.css";
import AppEvents from "../../AppEvents";

const { colors } = defaultTheme;

const selectStyles = {
    control: provided => ({ ...provided, minWidth: 240, margin: 8 }),
    menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
};

class PickField extends Component {
    static RESET_VALUE = "reset";

    constructor(props) {
        super(props);

        this.optionsSupplier = props.optionsSupplier;
        this.options = props.options;
        this.onValueChanged = props.onValueChanged;

        this.toggleOpen = this.toggleOpen.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.hasOption = this.hasOption.bind(this);
    }

    componentDidMount() {
        this.setState({
            isOpen: false,
            option: undefined
        });

        if (Objects.isCorrect(this.props.reference)) {
            this.props.reference(this);
        }

        if (!this.hasOption(PickField.RESET_VALUE)) {
            const t = this.props.t;
            let resetOption = { option: PickField.RESET_VALUE, label: t("pick-field.reset.caption") };
            this.options.push(resetOption);
        }

        this.props.hub.on(AppEvents.LOCALE_CHANGED, ignored => {
            this.options = this.optionsSupplier();
            if (Objects.isCorrect(this.state) && Objects.isCorrect(this.state.option)) {
                this.pickByValue(this.state.option.value);
            } else {
                this.forceUpdate();
            }
        });
    }

    hasOption(value) {
        return this.findOptionByValue(value).isPresent();
    }

    pickByValue(value, emitEvent: Boolean) {
        this.findOptionByValue(value)
            .ifPresent(option => this.pick(option, emitEvent));
    }

    pick(option, emitEvent: Boolean) {
        this.setState({ option: option }, () => {
            if (Objects.isCorrect(emitEvent) && emitEvent && Objects.isCorrect(this.onValueChanged)) {
                this.onValueChanged(option.value);
            }
        });
    }

    toggleOpen() {
        if (Objects.isNotCorrect(this.state)) {
            return;
        }

        let wasOpen = this.state.isOpen;
        this.setState({
            isOpen: !wasOpen
        });
    }

    onSelectChange(value) {
        if (value.value === PickField.RESET_VALUE) {
            this.toggleOpen();
            this.setState({
                option: undefined
            });
        } else {
            this.toggleOpen();
            this.setState({
                option: value
            });
            this.onValueChanged(value.value);
        }
    }

    getAttr(func): * {
        let state = this.state;
        if (Objects.isNotCorrect(state)) {
            return undefined;
        }

        return func(state);
    }

    findOptionByValue(value): Optional<*> {
        for (let option of this.options) {
            if (option.value === value) {
                return Optional.of(option);
            }
        }

        return Optional.empty();
    }

    render() {
        let isOpen = this.getAttr(state => state.isOpen);
        let value = this.getAttr(state => state.option);
        const t = this.props.t;

        return (
            <Dropdown
                isOpen={isOpen}
                onClose={this.toggleOpen}
                target={
                    <Button className={"pick-field-toggle"} variant={"primary"}
                            onClick={ignored => this.toggleOpen()}>
                        {value ? t("pick-field.chosen-appendix.caption") + value.label : t("pick-field.nothing-chosen.caption")}
                    </Button>
                }
            >
                <Select className={"pick-field-select"}
                    autoFocus
                    backspaceRemovesValue={false}
                    components={{ DropdownIndicator, IndicatorSeparator: null }}
                    controlShouldRenderValue={false}
                    hideSelectedOptions={false}
                    isClearable={false}
                    menuIsOpen
                    onChange={this.onSelectChange}
                    options={this.options}
                    placeholder={t("search.caption")}
                    noOptionsMessage={(ignored) => t("pick-field.no-options.caption")}
                    styles={selectStyles}
                    tabSelectsValue={false}
                    value={value}
                />
            </Dropdown>
        );
    }
}

// styled components

const Menu = props => {
    const shadow = 'hsla(218, 50%, 10%, 0.1)';
    return (
        <div style={{
                backgroundColor: 'white',
                borderRadius: 4,
                boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
                marginTop: 8,
                position: 'absolute',
                zIndex: 2,
            }}
            {...props}
        />
    );
};
const Blanket = props => (
    <div style={{
            bottom: 0,
            left: 0,
            top: 0,
            right: 0,
            position: 'fixed',
            zIndex: 1,
        }}
        {...props}
    />
);
const Dropdown = ({ children, isOpen, target, onClose }) => (
    <div style={{ position: 'relative' }}>
        {target}
        {isOpen ? <Menu>{children}</Menu> : null}
        {isOpen ? <Blanket onClick={onClose} /> : null}
    </div>
);
const Svg = p => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        focusable="false"
        role="presentation"
        {...p}
    />
);
const DropdownIndicator = () => (
    <div style={{ color: colors.neutral20, height: 24, width: 32 }}>
        <Svg>
            <path
                d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </Svg>
    </div>
);

export default withTranslation()(PickField);
