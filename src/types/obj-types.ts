export interface localStorageFuncInterface {
    name: string;
    data: string;
}

export interface data {
    data: string;
    error: string;
}

export interface ProviderProps {
    children: JSX.Element
}

export interface ChatFeatures {
    id: number;
    header: string;
    paragraph: string;
    icon: React.ReactElement
}
export interface ModalInterface {
    children?: React.ReactElement;
    show?: boolean;
    setShow: (data: boolean) => void;
}
