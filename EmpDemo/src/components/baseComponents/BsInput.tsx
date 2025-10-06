import React, { useState, useEffect } from 'react';

const BsInput = ({
    type = '',
    placeholder = '',
    value,
    onChange,
    className = '',
    disabled = false,
    name = '',
    required = false,
    onDirty,
    border,
    resetDirtyState,
    myCheckbox = false,
}) => {
    const [isFieldDirty, setIsFieldDirty] = useState(false);
    const [initialValue, setInitialValue] = useState(value);


    // Reset dirty state when requested
    useEffect(() => {
        setIsFieldDirty(false);
    }, [resetDirtyState]);

    const handleChange = (event) => {
        const inputValue = myCheckbox ? event.target.checked : event.target.value;
        let newValue = inputValue;
        let prevValue = initialValue;

        // Normalize values based on type
        if (type === 'number') {
            newValue = Number(newValue);
            prevValue = Number(prevValue);
        } else if (type === 'text') {
            newValue = String(newValue);
            prevValue = String(prevValue);
        } else if (type === 'date') {
            const formatDate = (val) => {
                if (!val) return null;
                const d = new Date(val);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            };
            newValue = formatDate(newValue);
            prevValue = formatDate(prevValue);
        } else if (myCheckbox) {
            newValue = !!newValue;
            prevValue = !!prevValue;
        }

        // Compare for dirty check
        const dirtyState = newValue !== prevValue;

        // Update dirty state only if changed
        if (isFieldDirty !== dirtyState) {
            setIsFieldDirty(dirtyState);
            onDirty?.(name, dirtyState);
        }

        // Pass normalized value back
        onChange?.({
            target: {
                name,
                value: newValue,
            },
        });
    };


    return (
        <input
            type={myCheckbox ? 'checkbox' : type}
            checked={myCheckbox ? !!value : undefined}
            value={myCheckbox ? undefined : value}
            onChange={handleChange}
            name={name}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`custom-input-container ${className}`}
            style={{ border }}
        />
    );
};

export default BsInput;
