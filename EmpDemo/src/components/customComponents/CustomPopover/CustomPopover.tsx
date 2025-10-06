import React, { useState, useRef } from "react";
import "../../assets/styles/CustomPopover.css"; // Include styling for better UI
import { setSelectedTab } from "../../redux/reducer/combinedSlice.ts";
import { useDispatch } from "react-redux";
import { CalendarDays, Mail, UserPlus, Video } from "lucide-react";

interface CustomPopoverProps {
    rowId: number;
    name?: string;
    email?: string;
    profileImage?: string;
}

const CustomPopover: React.FC<CustomPopoverProps> = ({ name, email, profileImage, rowId }) => {
    const [isVisible, setIsVisible] = useState(false);
    const hideTimeout = useRef<NodeJS.Timeout | null>(null);
    const dispatch = useDispatch();

    const showPopover = () => {
        if (hideTimeout.current) {
            clearTimeout(hideTimeout.current);
        }
        setIsVisible(true);
    };

    const hidePopover = () => {
        hideTimeout.current = setTimeout(() => setIsVisible(false), 100);
    };

    return (

        <div className="popover-container">
            <span
                className="trigger-element"
                onMouseEnter={showPopover}
                onMouseLeave={hidePopover}
                onClick={() => {
                    dispatch(setSelectedTab(2));
                }}
            >
                {name}
            </span>

            {isVisible && (
                <div
                    className="custom-popover"
                    onMouseEnter={showPopover}
                    onMouseLeave={hidePopover}
                >
                    <div className="popover-header">
                        <div className="profile-container">
                            {profileImage ? (
                                <img src={profileImage} alt={name} className="profile-img" />
                            ) : (
                                <div className="profile-img-placeholder">
                                    {name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="heading">
                                <strong>{name}</strong>
                                <p className="email">{email}</p>
                            </div>
                        </div>

                        {/* Move the button to the top right */}
                        <button className="action-btn add-contact-btn"><UserPlus /></button>
                    </div>

                    <div className="popover-actions">
                        <button className="action-mail-btn"><Mail /> Send Mail</button>
                        <button className="action-btn"><Video /></button>
                        <button className="action-btn"><CalendarDays /></button>
                    </div>

                    <a href="#" className="detailed-view"
                        onClick={() => {
                            dispatch(setSelectedTab(2));
                        }}
                    >Open detailed view →</a>
                </div>
            )}

        </div>
    );
};

export default CustomPopover;
