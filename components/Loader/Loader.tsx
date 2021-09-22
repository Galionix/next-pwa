import s from '../../styles/Home.module.scss'
// import 

export const Loader = ({ loading }: { loading: boolean }) => {
    return (
        loading ? <div
            className={` ${s.loader} `}

        >
            <svg
                className={` ${s.base} `}

                width="540" height="540" viewBox="0 0 540 540" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0)">
                    <circle cx="275.771" cy="265.916" r="145" transform="rotate(55.5827 275.771 265.916)" fill="url(#paint0_linear)" />
                    <path d="M224.63 254.258L232.847 253.71C241.611 253.199 247.674 249.145 251.033 241.549C252.348 238.555 253.553 234.026 254.649 227.964C255.817 221.902 256.402 217.3 256.402 214.16C256.402 211.968 255.708 210.289 254.32 209.12C252.932 207.878 251.399 207.257 249.719 207.257C249.061 207.257 248.112 207.257 246.87 207.257C245.702 207.184 244.095 207.148 242.05 207.148C240.005 207.075 238.215 207.038 236.681 207.038L224.63 254.258ZM205.895 206.819L198.336 206.819C196.51 206.819 195.159 206.198 194.282 204.957C193.406 203.715 193.187 202.254 193.625 200.574L197.679 185.017C197.971 183.702 198.665 182.643 199.76 181.84C200.856 180.963 201.878 180.525 202.828 180.525L218.056 180.525L237.119 180.525L250.595 180.525C260.748 180.525 268.964 182.936 275.246 187.756C281.527 192.577 284.668 199.881 284.668 209.668C284.668 219.017 282.732 229.023 278.861 239.687C275.063 250.35 271.009 257.727 266.7 261.817C266.554 261.963 266.372 262.11 266.152 262.256C266.006 262.402 265.824 262.621 265.605 262.913C263.633 264.812 261.77 266.419 260.017 267.734C258.264 268.975 255.635 270.472 252.129 272.225C248.623 273.905 244.022 275.22 238.325 276.17C232.701 277.046 226.127 277.521 218.604 277.594L203.266 338.07C202.39 341.357 200.125 343 196.473 343L177.41 343C175.584 343 174.27 342.343 173.466 341.028C172.663 339.64 172.48 337.997 172.918 336.098L205.895 206.819ZM351.686 343C351.686 343 335.069 343 301.837 343L284.417 343L282.774 343C280.948 343 279.633 342.343 278.829 341.028C278.026 339.64 277.843 337.997 278.282 336.098L316.737 185.455C317.613 182.169 319.841 180.525 323.42 180.525L342.483 180.525C344.309 180.525 345.623 181.219 346.427 182.607C347.23 183.995 347.413 185.638 346.975 187.537L314.217 316.268L357.273 316.268C361.802 316.268 363.518 318.678 362.422 323.499L359.355 336.755C359.063 338.435 358.113 339.896 356.506 341.138C354.972 342.379 353.366 343 351.686 343Z" fill="#FFFBFB" />
                </g>
                {/* <defs>
                    <linearGradient id="paint0_linear" x1="383.771" y1="177.916" x2="153.771" y2="356.916" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#4154FF" />
                        <stop offset="1" stop-color="#FF0000" stop-opacity="0" />
                    </linearGradient>
                    <clipPath id="clip0">
                        <rect width="388" height="388.692" fill="white" transform="translate(320.648) rotate(55.5827)" />
                    </clipPath>
                </defs> */}
            </svg>
            {/* <svg
                className={` ${s.orbit} `}
                width="540" height="326" viewBox="0 0 235 326" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M224.75 319.937C220.966 322.53 214.343 322.549 204.157 317.911C194.231 313.391 182.14 304.971 168.659 293.14C141.742 269.519 109.972 232.917 79.8241 188.916C49.6765 144.915 27.014 102.072 14.7051 68.4425C8.53986 51.5984 5.05352 37.2833 4.42253 26.3951C3.77497 15.221 6.18358 9.05202 9.96779 6.45924C13.752 3.86646 20.3745 3.84771 30.561 8.48609C40.4868 13.0058 52.5775 21.4256 66.0593 33.2567C92.9759 56.8775 124.746 93.4801 154.894 137.481C185.041 181.482 207.704 224.325 220.013 257.954C226.178 274.798 229.664 289.113 230.295 300.002C230.943 311.176 228.534 317.345 224.75 319.937Z" stroke="url(#paint0_linear)" stroke-width="8" />
                <defs>
                    <linearGradient id="paint0_linear" x1="76.5243" y1="191.177" x2="139.5" y2="149" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#5F37FF" />
                        <stop offset="1" stop-color="#FF0000" stop-opacity="0" />
                    </linearGradient>
                </defs>
            </svg> */}


        </div> : null
    )
}
