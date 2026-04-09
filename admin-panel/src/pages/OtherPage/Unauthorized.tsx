import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

export default function Unauthorized() {
  return (
    <>
      <PageMeta
        title="İcazə Yoxdur | Memix Admin"
        description="Bu səhifəyə giriş icazəniz yoxdur"
      />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
            <svg
              className="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>

          {/* Error Code */}
          <p className="text-6xl font-extrabold text-red-500 mb-2">403</p>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-3">
            Giriş İcazəsi Yoxdur
          </h1>

          {/* Description */}
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            Bu səhifəyə baxmaq üçün lazımi icazəniz yoxdur. Əgər bunun xəta
            olduğunu düşünürsünüzsə, sistem administratoru ilə əlaqə saxlayın.
          </p>

          {/* Action Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-600 active:scale-95"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
            Ana Səhifəyə Qayıt
          </Link>
        </div>
      </div>
    </>
  );
}
