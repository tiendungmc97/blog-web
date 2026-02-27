import {
  ClockCircleOutlined,
  GlobalOutlined,
  SettingFilled,
  SwapOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";

export type MenuItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export type NavKey = "orders" | "trading" | "chart" | "history" | "news" | "settings" | "information" | "portfolio";

export const items: { key: NavKey; label: string; Icon: React.ComponentType<any> }[] = [
  // { key: "orders", label: "SỔ LỆNH", Icon: OrderedListOutlined },
  { key: "trading", label: "GIAO DỊCH", Icon: SwapOutlined },
  // { key: "chart", label: "ĐỒ THỊ", Icon: StockOutlined },
  { key: "history", label: "LỊCH SỬ", Icon: ClockCircleOutlined },
  { key: "news", label: "TIN TỨC", Icon: GlobalOutlined },
  { key: "portfolio", label: "TÀI SẢN", Icon: WalletOutlined },
  { key: "information", label: "THÔNG TIN", Icon: UserOutlined },
  { key: "settings", label: "CÀI ĐẶT", Icon: SettingFilled },
];

export const parentRoute: Record<NavKey, string> = {
  orders: "/orders",
  trading: "/trading",
  chart: "/chart",
  history: "/history",
  news: "/news",
  information: "/profile/general",
  settings: "/settings",
  portfolio: "/portfolio",
};

export const infoSub = [
  { label: "Thông tin chung", href: "/profile/general" },
  { label: "Giới thiệu", href: "/profile/referral" },
] as const;

export const historySub = [
  { label: "Nạp/Rút tài sản", href: "/history/token" },
  { label: "Nạp/Rút tiền ký quỹ", href: "/history/fiat" },
] as const;

export const portfolioSub = [
  { label: "Tài khoản", href: "/portfolio/assets/funding" },
  { label: "Tài sản thực", href: "/portfolio/assets/spot" },
] as const;
