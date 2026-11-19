import "./globals.css";

// Each section renders its own <html>: [locale]/layout (site), panel/layout, braino/layout.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
