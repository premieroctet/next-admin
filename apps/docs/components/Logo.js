const Logo = ({ width }) => (
  <svg
    width={width}
    viewBox="0 0 101 69"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>
      {`.selection-effect {
        stroke-dasharray: 10;
        animation-duration: 40s;
        animation-name: selectionEffect;
        animation-timing-function: linear;
        animation-direction: reverse;
        animation-iteration-count: infinite;
    }

    .selection-effect {
      stroke: #000;
    }

    .dark .selection-effect {
        stroke: #fff;
    }

    @keyframes selectionEffect {
        from {
            stroke-opacity: 1;
        }

        to {
            stroke-opacity: 1;
            stroke-dashoffset: 800;
        }
    }`}
    </style>
    <g clipPath="url(#clip0)">
      <rect width="101" height="69" />
      <path
        d="M46.7321 3C46.3748 2.3812 45.7145 2 45 2C44.2855 2 43.6252 2.3812 43.2679 3L9.49296 61.5C9.13569 62.1188 9.13569 62.8812 9.49296 63.5C9.85022 64.1188 10.5105 64.5 11.225 64.5H78.775C79.4895 64.5 80.1498 64.1188 80.507 63.5C80.8643 62.8812 80.8643 62.1188 80.507 61.5L46.7321 3Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M45.9312 11.7469C45.817 11.5523 45.5866 11.4583 45.3689 11.5175C45.1511 11.5767 45 11.7744 45 12V58C45 58.2761 45.2239 58.5 45.5 58.5H72.5C72.6793 58.5 72.8448 58.404 72.9339 58.2484C73.023 58.0929 73.022 57.9015 72.9312 57.7469L45.9312 11.7469Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="2"
        y1="32"
        x2="25"
        y2="32"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        className="selection-effect"
        x1="65"
        y1="32"
        x2="93"
        y2="32"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        className="selection-effect"
        x1="59"
        y1="22"
        x2="99"
        y2="22"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        className="selection-effect"
        x1="70"
        y1="42"
        x2="89"
        y2="42"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="101" height="69" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default Logo;
