import React from "react";
import SessionSetting from "./SettingItems/SessionSetting";

export default function ({
    children,
    empty,
}: {
    children: any;
    empty: boolean;
}) {
    if (empty) {
        return (
            <div className="object-container">
                Session is empty. Shot some shots or load previous session to
                begin.
                <SessionSetting></SessionSetting>
            </div>
        );
    }
    return <div className="object-container">{children}</div>;
}
