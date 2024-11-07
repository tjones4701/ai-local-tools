
import React from "react";
import Detail from "@renderer/components/detail";
import { useQuickFormContext } from "@renderer/quick-form/use-quick-form";
import ControlledSelectBox, { IControlledSelectSizes, IControlledSelectItem } from "@renderer/quick-form/controller-inputs/controlled-select-box";

export interface IFESelect {
    label?: React.ReactChild;
    name: string;
    disabled?: boolean;
    onChange?: (e: any) => void;
    size?: IControlledSelectSizes;
    items: IControlledSelectItem[];
    onSelectChange?: (e: any[]) => void;
    multi?: boolean;
    hasEmpty?: boolean;
    required?: boolean;
    readOnly?: boolean;
}

const FESelect: React.FC<IFESelect> = function ({ disabled, readOnly, name, label, items, size, multi, required, onSelectChange, hasEmpty }: IFESelect) {
    const context = useQuickFormContext();
    const control = context?.control;
    if (hasEmpty) {
        items = [{ label: "-- Select a Value --", id: "" }, ...items];
    }
    if (context?.readOnly || readOnly) {
        const value = context?.getValue(name);
        return <Detail label={label}>{value}</Detail>;
    } else {
        return (
            <>
                <label htmlFor={name}>{label}</label>
                <ControlledSelectBox
                    onSelectChange={onSelectChange}
                    required={required}
                    items={items}
                    size={size}
                    multi={multi}
                    control={control}
                    name={name}
                    disabled={disabled || context?.disabled}
                />
            </>
        );
    }
};

export default FESelect;
