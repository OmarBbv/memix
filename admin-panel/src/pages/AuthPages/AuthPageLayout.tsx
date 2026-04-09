import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="relative items-center hidden w-full h-full lg:w-1/2 lg:flex justify-center overflow-hidden">
          {/* Unsplash E-commerce Image Background */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
              className="object-cover w-full h-full"
              alt="E-commerce Dashboard"
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-[2px]"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
            <h2 className="mb-5 text-4xl font-bold text-white shadow-sm">
              Memix E-Commerce
            </h2>
            <p className="text-lg text-white/80 leading-relaxed font-medium">
              Sifarişlərinizi, müştərilərinizi və satışlarınızı tək sadə paneldən peşəkar şəkildə idarə edin.
            </p>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
