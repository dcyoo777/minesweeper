import {useEffect, useMemo, useState} from 'react';

export type EditContent = {
    content: {
        [key: string]: any
    },
    setContent: Function,
    editedContent: {
        [key: string]: any
    },
    isEdit: boolean,
    setIsEdit: Function
}

const useEditContent = (initialContent: any, isCreate = false): EditContent => {
    const [content, setContent] = useState(initialContent);
    const [isEdit, setIsEdit] = useState(isCreate);

    const editedContent = useMemo(() => {
        const result: {
            [key: string]: any
        } = {};
        Object.keys(content).forEach(key => {
            if (initialContent[key] !== content[key]) {
                result[key] = content[key];
            }
        })
        return result;
    }, [content, initialContent])

    useEffect(() => {
        if (!isEdit) {
            setContent(content);
        }
    }, [content, isEdit]);

    useEffect(() => {
        setContent(initialContent)
    }, [initialContent]);

    return {
        content,
        setContent,
        editedContent,
        isEdit,
        setIsEdit,
    };
};

export default useEditContent;
