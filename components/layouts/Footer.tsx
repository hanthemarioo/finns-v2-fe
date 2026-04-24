import Link from "next/link";

const Footer = () => {
    return (
        <p className="my-10 text-sm text-center text-gray-500">
            &copy; 2025 <Link href="/" className="hover:underline">Siternak</Link>. All rights reserved.
        </p>
    );
};

export default Footer;