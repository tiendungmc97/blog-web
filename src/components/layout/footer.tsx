"use client";

import { designTokens } from "@/utils/design-tokens";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { CurrentTime } from "../ui/display/date-components";

export default function AppFooter({ onHelpClick = () => {}}) {
  return (
    <footer className="fixed right-0 bottom-0 left-0 z-50 hidden h-[35px] w-full bg-white md:block">
      <div className="flex h-full w-full items-center justify-between px-6">
        {/* logo + text */}
        <div className="text-textSecondary flex items-center gap-2 text-[12px]">
          <span>Copyright @2026 VINDAS. All rights reserved.</span>
        </div>

        {/* help + time */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onHelpClick}
            aria-label="Help"
            className="bg-border text-textSecondary flex h-7 w-7 items-center justify-center rounded transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = designTokens.colors.textSecondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = designTokens.colors.border;
            }}
          >
            <QuestionCircleOutlined className="text-[16px]" />
          </button>
          <CurrentTime
            format="HH:mm:ss DD/MM/YYYY"
            className="text-[12px]"
          />
        </div>
      </div>
    </footer>
  );
}
