import React from "react";
import { AiFillHome } from "react-icons/ai";
import { RiArrowGoBackLine } from "react-icons/ri";
// import "styles/globals.scss"
import Image from 'next/image';
import Link from 'next/link';

export default function Custom404() {
    return <main
        className="notFound"
    >
        <h1>404 | Page Not Found</h1>
        <div
            className="image"
        >
            <Image
                layout="fixed"
                width={300}
                height={300}
                src="/image/sad_cat_meme_phone.jpg"
            />
        </div>
        <Link
            href="/"
        >
            <a><button>
                <span>Go back</span>
                <AiFillHome />
                <RiArrowGoBackLine />
            </button>
            </a>
        </Link>
    </main>
}