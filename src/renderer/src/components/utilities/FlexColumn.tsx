import { makeStyles } from "@fluentui/react-components";
import { forceArray } from "@src/lib/common/forceArray";
import React from "react";

interface IFlexColumn {
    children: any;
    className?: string;
}

const useStyles = makeStyles({
    innerCassName: {
        display: "flex",
        flexDirection: "column"
    },
});

const FlexColumn: React.FC<IFlexColumn> = function ({ children, className }: IFlexColumn) {
    const { innerCassName } = useStyles();
    const elements = forceArray(children);
    return <div className={`${innerCassName} ${className ?? ""}`}>{elements}</div>;
};

export default FlexColumn;
