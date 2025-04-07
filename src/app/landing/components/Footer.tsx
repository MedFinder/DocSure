import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <section className="bg-white py-8 flex flex-col justify-center items-center">
      <Image
        src="/Vector (9).svg"
        alt="Logo"
        width={40}
        height={40}
        className=""
      />
      <p>© {new Date().getFullYear()} Docure AI Inc.</p>
      <div className="flex gap-2">
        <Link href="/terms" className="hover:underline">Terms</Link>
        <Link href="/privacy-policy" className="hover:underline">Privacy</Link>
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/contact-us" className="hover:underline">Contact Us</Link>
      </div>
    </section>
  );
};

export default Footer;
