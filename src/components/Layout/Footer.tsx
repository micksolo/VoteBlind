export function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center text-sm text-gray-500">
          {/* Electoral Authorisation - Required by Commonwealth Electoral Act 1918 */}
          <p className="mb-4 text-xs">
            Authorised by [Your Name], [Street Address], [Suburb], [State] [Postcode]
          </p>

          <p className="mb-2">
            Informed Vote is an independent, non-partisan tool.
            Not affiliated with the AEC or any political party.
          </p>

          <p className="mb-4">
            This tool provides general information only and does not constitute voting advice.
          </p>

          <div className="flex justify-center gap-4 text-gray-400">
            <a href="/privacy" className="hover:text-gray-600">Privacy</a>
            <span>|</span>
            <a href="/methodology" className="hover:text-gray-600">Methodology</a>
            <span>|</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600"
            >
              Source Code
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
