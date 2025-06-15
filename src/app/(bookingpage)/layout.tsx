export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <>
        <div className="bg-[var(--bg-1)] py-[3rem]">
          <div
              className="flex items-center justify-between flex-wrap px-2 py-[1.5rem] md:p-[25px] gap-4 lg:p-[50px] bg-[var(--dark)]">
            <h2 className="h2 text-white bigtitle">Booking page</h2>
          </div>
          <section
              className="grid z-[1] grid-cols-12 gap-3 mb-5 lg:gap-5 px-2 md:px-5 bg-[var(--bg-1)] relative after:absolute after:bg-[var(--dark)] after:w-full after:h-[50px] after:top-0 after:left-0 after:z-[-1] pb-8 xxl:pb-0">
            <div className="col-span-12">
              <div className="p-3 md:p-5 lg:p-8 rounded-2xl bg-[var(--bg-1)]">
                {children}
              </div>
            </div>
          </section>
        </div>

      </>

  );
}
