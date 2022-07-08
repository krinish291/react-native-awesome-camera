/// <reference types="react" />
interface AwesomeCameraProps {
    setIsOpen: Function;
    getData: Function;
    zoom?: number;
    themeColor?: string;
}
declare const AwesomeCamera: (props: AwesomeCameraProps) => JSX.Element;
export default AwesomeCamera;
