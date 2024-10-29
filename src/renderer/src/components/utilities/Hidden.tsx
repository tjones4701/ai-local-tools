import React from "react";

type IHidden = {
    children: any;
    show?: boolean;
};

const Hidden: React.FC<IHidden> = function ({ show, children }: IHidden) {

    if (!show) {
        return <></>;
    }

    return <>{children}</>
};

export default Hidden;
