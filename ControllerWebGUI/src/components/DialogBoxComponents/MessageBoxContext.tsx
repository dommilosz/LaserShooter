import {createContext} from "../../api/hooks";
import React, {useContext, useState} from "react";
import MessageBox from "./MessageBox";
import PromptBox from "./PromptBox";
import ConfirmBox from "./ConfirmBox";

export type MessageBoxContextType = { setContent: (v: string) => any, open: boolean, setOpen: (v: boolean) => any, setType: (type: "info" | "error") => any, setTitle: (title: string) => any, setOnResult: (cb: (v: boolean) => any) => any };
export type ConfirmBoxContextType = { setContent: (v: string) => any, open: boolean, setOpen: (v: boolean) => any, setTitle: (title: string) => any, setOnResult: (cb: (v: boolean) => any) => any }
export type PromptBoxContextType = { setContent: (v: string) => any, open: boolean, setOpen: (v: boolean) => any, setTitle: (title: string) => any, setOnResult: (cb: (v: string | false) => any) => any, setFieldName: (v: string) => any };


export const MessageBoxContext = createContext<MessageBoxContextType>();
export const ConfirmBoxContext = createContext<ConfirmBoxContextType>();
export const PromptBoxContext = createContext<PromptBoxContextType>();

export function useShowMessageBox() {
    let ctx = useContext(MessageBoxContext);
    return async ({content, title, type}: { content: string, title: string, type: "info" | "error" }) => {
        ctx.setOpen(true);
        ctx.setTitle(title);
        ctx.setType(type);
        ctx.setContent(content);

        return await new Promise((r) => {
            ctx.setOnResult(r);
        })
    }
}

export function useShowConfirmBox() {
    let ctx = useContext(ConfirmBoxContext);
    return async ({content, title}: { content: string, title: string }) => {
        ctx.setOpen(true);
        ctx.setTitle(title);
        ctx.setContent(content);

        return await new Promise<boolean>((r) => {
            ctx.setOnResult(r);
        })
    }
}

export function useShowPromptBox() {
    let ctx = useContext(PromptBoxContext);
    return async ({content, title, fieldName}: { content: string, title: string, fieldName: string }) => {
        ctx.setOpen(true);
        ctx.setTitle(title);
        ctx.setContent(content);
        ctx.setFieldName(fieldName)

        return await new Promise<string | false>((r) => {
            ctx.setOnResult(r);
        })
    }
}

export function MessageBoxProvider({children}: { children: JSX.Element }) {
    let [content, setContent] = useState("");
    let [fieldName, setFieldName] = useState("");
    let [title, setTitle] = useState("");
    let [onResult, setOnResult] = useState<{cb:(v: any) => any}>();
    let [type, setType] = useState<any>("");
    let [open, setOpen] = useState(0);

    let MessageBoxData: MessageBoxContextType = {
        setContent, setTitle, setOnResult:(cb)=>setOnResult({cb}), setType, open: open === 1, setOpen: () => setOpen(1)
    };
    let PromptBoxData: PromptBoxContextType = {
        setContent, setTitle, setOnResult:(cb)=>setOnResult({cb}), open: open === 2, setOpen: () => setOpen(2), setFieldName
    };
    let ConfirmData: ConfirmBoxContextType = {
        setContent, setTitle, setOnResult:(cb)=>setOnResult({cb}), open: open === 3, setOpen: () => setOpen(3)
    };

    return <>
        <MessageBox
            setOpen={(open) => setOpen(open?1:0)} open={open === 1} content={content} type={type}
            title={title}
            onResult={function (v: boolean) {
                if (onResult?.cb)
                    onResult.cb(v)
            }}></MessageBox>
        <PromptBox
            setOpen={(open) => setOpen(open?1:0)} open={open === 2} content={content}
            title={title}
            onResult={function (v: string | false) {
                if (onResult?.cb)
                    onResult.cb(v)
            }}
            fieldName={fieldName}
        />
        <ConfirmBox
            setOpen={(open) => setOpen(open?1:0)} open={open === 3} content={content}
            title={title}
            onResult={function (v: boolean) {
                if (onResult?.cb)
                    onResult.cb(v)
            }}/>
        <MessageBoxContext.Provider value={MessageBoxData}>
            <PromptBoxContext.Provider value={PromptBoxData}>
                <ConfirmBoxContext.Provider value={ConfirmData}>
                    {children}
                </ConfirmBoxContext.Provider>
            </PromptBoxContext.Provider>
        </MessageBoxContext.Provider>
    </>
}