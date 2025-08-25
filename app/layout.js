export const metadata = {
  title: "Hearing Aid Management",
  description: "MVP for hearing aid order management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          margin: 0,
        }}
      >
        {children}
      </body>
    </html>
  );
}
