import * as React from "react";
import { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, Icon, Grid, List, Table, Image, Button } from "semantic-ui-react";

import ServerListRow from "./server";
import { ServerCore, ServerFull, blankServer } from "./interfaces";
import ServerDetails from "./details";

interface IServerModalProps {
    selectedAddress: string;
}

interface IServerModalState {
    full: ServerFull;
}

export default class ServerModal extends Component<IServerModalProps, IServerModalState> {
    async load(address: string) {
        let response: Response;
        try {
            response = await fetch("http://api.samp.southcla.ws/v2/server/" + address);
        } catch (error) {
            console.log("failed to GET server:", error);
            return;
        }

        if (response.status != 200) {
            console.log("failed to GET server:", response.status);
            return;
        }

        let data: ServerFull;
        try {
            data = await response.json();
        } catch (error) {
            console.log("failed to parse response as JSON:", error);
            return;
        }

        this.setState({ full: data });
    }

    render() {
        if (this.props.selectedAddress == null) {
            console.log("no address selected");
            return null;
        }

        let full: ServerFull;

        if (this.state == null) {
            this.load(this.props.selectedAddress);
            full = blankServer();
        } else {
            full = this.state.full;
        }

        let passwordIcon = full.core.pa ? <Icon name="lock" /> : <Icon name="unlock" disabled />;

        return (
            <Modal open>
                <Modal.Header>
                    {full.core.hn} {passwordIcon}
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <ServerDetails server={full} />
                        <Link to="/">
                            <Button>Close</Button>
                        </Link>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}
