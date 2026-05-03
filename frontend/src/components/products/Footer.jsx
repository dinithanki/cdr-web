function Footer() {
	return (
		<footer className="border-t border-gray-200 bg-white/90 px-4 py-6 text-sm text-gray-600 backdrop-blur">
			<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
				<p>© {new Date().getFullYear()} CDR Web. All rights reserved.</p>
				<div className="flex items-center gap-4">
					<a href="/products" className="transition-colors hover:text-gray-900">
						Products
					</a>
					<a href="/cart" className="transition-colors hover:text-gray-900">
						Cart
					</a>
					<a href="/orders" className="transition-colors hover:text-gray-900">
						Orders
					</a>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
