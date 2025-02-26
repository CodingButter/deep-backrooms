export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="flex flex-col p-12 space-y-4">{children}</div>
}
