import React from "react";

interface StatusBarProps {
  statuses: { label: string; value: string }[];
  activeStatus?: string;
  className?: string;
}
const styles = `
.o_statusbar_status {
    display: flex;
    margin-left: auto;
    flex-flow: row-reverse wrap-reverse;
    align-self: stretch;
    align-items: stretch;
    margin-right: 10px;
    align-content: space-around;
}

.o_arrow_button {
    opacity: 1.0;
    color: #020817;
    pointer-events: none;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%);
    background-color: #e9ecef;
    margin-bottom: 2px;
    min-width: fit-content;
    opacity: 1.0;
    padding: 6px 15px;
    border-width: 0 0 0;
    border-radius: 0;
    transition: all 0.1s ease 0s;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    color: #020817;
}
.o_arrow_button.active {
    background-color: #1890ff;
    color: #ffffff;
}
.o_arrow_button:last-child {
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
}

.o_arrow_button:first-child {
    clip-path: polygon( 0 0, 100% 0, 100% 100%, 0 100%, 10px 50% );
}
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
export const StatusBar: React.FC<StatusBarProps> = ({ statuses = [], activeStatus, className = "" }) => {
  return (
    <div className={`o_statusbar_status ${className}`}>
      {statuses
        .slice()
        .reverse()
        .map((status, index) => (
          <div
            key={index}
            className={`o_arrow_button ${activeStatus === status.value ? "active" : ""}`}
          >
            {status.label}
          </div>
        ))}
    </div>
  );
};
