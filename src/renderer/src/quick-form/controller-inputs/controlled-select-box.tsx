
import { Select, SelectProps } from "@fluentui/react-components";
import { forceArray } from "@renderer/lib/force-array";
import { tryCall } from "@renderer/lib/try-call";
import { uniqueArray } from "@renderer/lib/uniqute-array";
import * as React from "react";
import { Controller } from "react-hook-form";

export type IControlledSelectSizes = "mini" | "default" | "compact" | "large";
export type IControlledSelectItem = { label: string; id: string };
export interface IControlledSelect {
    control: any;
    name: string;
    disabled: boolean;
    size?: IControlledSelectSizes;
    items: IControlledSelectItem[];
    multi?: boolean;
    value?: any[];
    autoFocus?: boolean;
    required?: boolean;
    onInputChange?: (e) => void;
    onSelectChange?: (e: any[]) => void;
    isLoading?: boolean;
    noResultsMsg?: string;
}


const ControlledSelectBox: React.FC<IControlledSelect> = function ({
    control,
    name,
    items,
    disabled,
    value,
    multi,
    required,
    autoFocus,

    onSelectChange,
}: IControlledSelect) {
    let defaultValue: any = null;
    if (multi) {
        defaultValue = value ?? [];
    }

    return (
        <Controller
            defaultValue={defaultValue}
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
                let selectedIds: string[] = forceArray(value ?? []);
                if (!Array.isArray(selectedIds)) {
                    selectedIds = [];
                }

                const innerChange: SelectProps["onChange"] = (event, data) => {
                    let newValues: (string | null)[] = [...selectedIds];
                    const selectedId = `${data.value}`;
                    if (event.type == "clear") {
                        if (multi) {
                            newValues = [];
                        } else {
                            newValues = [null];
                        }
                    } else {
                        if (event.type == "remove") {
                            if (multi) {
                                newValues = newValues.filter((item) => {
                                    return item != selectedId;
                                });
                            } else {
                                newValues = [null];
                            }
                        } else {
                            if (!multi) {
                                newValues = [selectedId];
                            } else {
                                newValues.push(selectedId);
                            }
                        }
                    }

                    let newValue: (string | null)[] | null | string = null;
                    if (multi) {
                        newValue = uniqueArray(newValues);
                    } else {
                        newValue = uniqueArray(newValues)?.[0];
                    }
                    tryCall(onSelectChange, newValue);
                    onChange(newValue);
                };

                return (
                    <Select
                        autoFocus={autoFocus}
                        required={required}
                        multiple={multi}
                        disabled={disabled}
                        onChange={innerChange}
                        onBlur={onBlur}
                        value={selectedIds}
                    >
                        {items.map((item) => {
                            return (
                                <option
                                    key={item?.id}
                                    id={item?.id}
                                    value={item?.label}
                                    label={item?.label}
                                    selected={selectedIds.includes(item?.id)}
                                >
                                    {item?.label}
                                </option>
                            );
                        })}
                    </Select>
                );
            }}
        />
    );
};

export default ControlledSelectBox;
