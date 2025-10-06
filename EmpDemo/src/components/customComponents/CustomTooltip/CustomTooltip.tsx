import React, { ReactNode, useState, useRef, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import "../../assets/styles/customTooltip.css";

interface TooltipProps {
    children: ReactNode;
    tooltipText: string;
    placement?: "top" | "right" | "bottom" | "left";
}

const CustomTooltip: React.FC<TooltipProps> = ({
    children,
    tooltipText,
    placement = "bottom"
}) => {
    const [visible, setVisible] = useState(false);
    const [coords, setCoords] = useState<{ top: number, left: number, transform: string }>({ top: 0, left: 0, transform: "" });

    const triggerRef = useRef<HTMLDivElement>(null);     // Ref for the element that triggers the tooltip
    const tooltipRef = useRef<HTMLSpanElement>(null);     // Ref for the tooltip element itself


    // Calculate and update tooltip position when visible or placement changes
    useLayoutEffect(() => {
        if (visible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            let top = 0, left = 0, transform = "";
            let preferred = placement;

            // Set default tooltip position based on placement
            switch (preferred) {
                case "top":
                    top = rect.top - 8;
                    left = rect.left + rect.width / 2;
                    transform = "translate(-50%, -100%)";
                    break;
                case "right":
                    top = rect.top + rect.height / 2;
                    left = rect.right + 8;
                    transform = "translate(0, -50%)";
                    break;
                case "left":
                    top = rect.top + rect.height / 2;
                    left = rect.left - 8;
                    transform = "translate(-100%, -50%)";
                    break;
                default: // bottom
                    top = rect.bottom + 8;
                    left = rect.left + rect.width / 2;
                    transform = "translate(-50%, 0)";
            }

            // After rendering, check for overflow and adjust position if needed
            setTimeout(() => {
                if (tooltipRef.current) {
                    const tipRect = tooltipRef.current.getBoundingClientRect();
                    const padding = 12;
                    let newTop = top, newLeft = left, newTransform = transform;

                    // Adjust horizontally if tooltip overflows left or right edge
                    if (tipRect.left < padding) {
                        newLeft = padding;
                        newTransform = "translate(0, 0)";
                    } else if (tipRect.right > window.innerWidth - padding) {
                        newLeft = window.innerWidth - padding;
                        newTransform = "translate(-100%, 0)";
                    }

                    // Adjust vertically if tooltip overflows top or bottom edge
                    if (tipRect.top < padding) {
                        newTop = rect.bottom + 8;
                        newTransform = "translate(-50%, 0)";
                    } else if (tipRect.bottom > window.innerHeight - padding) {
                        newTop = rect.top - tipRect.height - 8;
                        newTransform = "translate(-50%, -100%)";
                    }


                    setCoords({ top: newTop, left: newLeft, transform: newTransform });
                }
            }, 0);
            // Set initial calculated coordinates
            setCoords({ top, left, transform });
        }
    }, [visible, placement]);

    return (
        <div
            className="tooltip-container"
            ref={triggerRef}
            // Show tooltip on mouse enter or focus
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onFocus={() => setVisible(true)}
            onBlur={() => setVisible(false)}
            tabIndex={0}
            style={{ display: "inline-block" }}
        >
            {children}
            {/* Render tooltip in a portal when visible */}

            {visible && ReactDOM.createPortal(
                <span
                    ref={tooltipRef}
                    className={`tooltip-text tooltip-${placement} tooltip-fixed`}
                    style={{
                        top: coords.top,
                        left: coords.left,
                        transform: coords.transform
                    }}
                >
                    {tooltipText}
                </span>,
                document.body
            )}
        </div>
    );
};

export default CustomTooltip;