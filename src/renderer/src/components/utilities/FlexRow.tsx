import { makeStyles } from "@fluentui/react-components";
import { forceArray } from "@src/lib/common/forceArray";
import React from "react";

interface IFlexRow {
    children: any;
}

const useStyles = makeStyles({
    className: {
        display: "flex",
        flexDirection: "row"
    },
});

const FlexRow: React.FC<IFlexRow> = function ({ children }: IFlexRow) {
    const { className } = useStyles();
    const elements = forceArray(children);
    return <div className={className}>{elements}</div>;
};

export default FlexRow;
