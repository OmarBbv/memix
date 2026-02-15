
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div>
      <PageMeta
        title={`${title} | Memix Admin`}
        description={`This is the ${title} page for Memix Admin Panel`}
      />
      <PageBreadcrumb pageTitle={title} />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            {title}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Bu səhifə hələ yaradılmayıb. Tezliklə aktiv olacaq.
          </p>
        </div>
      </div>
    </div>
  );
}
