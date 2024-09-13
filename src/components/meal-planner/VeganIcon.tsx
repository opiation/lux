import type { CSSProperties } from "react";

type VeganIconProps = {
  /**
   * @default defaultVeganIconProps.leafColor
   */
  leafColor?: CSSProperties["fill"]
  textColor?: CSSProperties["fill"]
}

const defaultVeganIconProps = Object.freeze({
  leafColor: "rgb(82,186,71)",
  textColor: "rgb(39,104,46)"
}) satisfies Required<VeganIconProps>

/** Renders 3 leaves and the literal text "VEGAN" below them */
export function VeganIcon(props: VeganIconProps) {
  const {
    leafColor = defaultVeganIconProps.leafColor,
    textColor = defaultVeganIconProps.textColor
  } = props;
  
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
      <g
        style={{
          fill: "none",
          fillRule: "nonzero",
          opacity: 1,
          stroke: "none",
          strokeDasharray: "none",
          strokeLinecap: "round",
          strokeLinejoin: "miter",
          strokeMiterlimit: 10,
          strokeWidth: 1
        }}
        transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
      >
        <g fill={leafColor} key="leaves">
	  <path
  d="M 79.492 21.504 c -3.872 8.409 -16.723 5.23 -25.527 12.419 c -5.103 4.366 -8.234 9.782 -7.005 17.521 l 1.058 4.289 c 4.121 -10.827 14.969 -16.155 23.802 -17.556 C 58.88 44.86 52.422 51.969 47.849 66.435 l 2.636 0.652 c 0.736 -2.813 1.759 -5.355 2.994 -7.697 c 9.025 3 17.252 2.091 23.952 -5.06 C 85.755 43.995 82.988 32.778 79.492 21.504 z"
  key="right"
          />
	  <path
  d="M 36.035 33.922 c -8.804 -7.189 -21.655 -4.009 -25.527 -12.419 c -3.496 11.275 -6.263 22.492 2.061 32.827 c 6.7 7.15 14.928 8.059 23.952 5.06 c 1.235 2.342 2.258 4.884 2.994 7.697 l 2.636 -0.652 C 37.578 51.969 31.12 44.86 18.18 38.175 c 8.833 1.401 19.681 6.729 23.802 17.556 l 1.058 -4.289 C 44.269 43.704 41.138 38.288 36.035 33.922 z"
  key="left"
          />
	  <path
  d="M 51.775 31.362 c 3.332 -2.722 7.008 -4.131 10.551 -5.118 c 0.014 -0.456 0.026 -0.914 0.015 -1.386 C 61.035 11.653 51.199 5.592 40.804 0 c 3.133 8.712 -8.262 15.451 -9.503 26.749 c -0.019 0.221 -0.029 0.44 -0.044 0.659 c 1.255 0.479 2.504 1.048 3.726 1.74 c 1.087 0.615 2.154 1.324 3.183 2.164 c 0.831 0.71 1.597 1.435 2.305 2.173 c 0.695 -6.192 3.389 -11.947 6.547 -16.217 c -2.672 8.135 -3.628 14.807 -2.576 21.671 c 0.2 0.383 0.386 0.77 0.559 1.161 C 46.386 36.956 48.63 34.054 51.775 31.362 z"
  key="center"
          />
        </g>
        <g fill={textColor} key="letters">
	  <path
  d="M 20.706 72.475 c -0.751 -0.297 -1.599 0.072 -1.896 0.823 l -4.444 11.261 L 9.922 73.298 c -0.296 -0.75 -1.144 -1.119 -1.896 -0.823 c -0.75 0.297 -1.119 1.145 -0.823 1.896 l 5.803 14.705 C 13.228 89.634 13.767 90 14.367 90 s 1.139 -0.366 1.359 -0.925 l 5.803 -14.705 C 21.825 73.62 21.457 72.772 20.706 72.475 z"
  key="v"
          />
	  <path
  d="M 33.845 75.295 c 0.807 0 1.461 -0.654 1.461 -1.461 s -0.654 -1.461 -1.461 -1.461 h -7.438 c -0.807 0 -1.461 0.654 -1.461 1.461 v 14.705 c 0 0.807 0.654 1.461 1.461 1.461 h 7.438 c 0.807 0 1.461 -0.654 1.461 -1.461 c 0 -0.807 -0.654 -1.461 -1.461 -1.461 h -5.977 v -4.43 h 3.722 c 0.807 0 1.461 -0.654 1.461 -1.461 c 0 -0.807 -0.654 -1.461 -1.461 -1.461 h -3.722 v -4.43 H 33.845 z"
  key="e"
          />
	  <path
  d="M 49.005 79.726 h -4.563 c -0.807 0 -1.461 0.654 -1.461 1.461 c 0 0.807 0.654 1.461 1.461 1.461 h 3.102 v 2.721 c 0 0.943 -0.767 1.709 -1.709 1.709 h -2.786 c -0.943 0 -1.709 -0.767 -1.709 -1.709 v -8.364 c 0 -0.943 0.767 -1.709 1.709 -1.709 h 3.584 c 0.807 0 1.461 -0.654 1.461 -1.461 s -0.654 -1.461 -1.461 -1.461 h -3.584 c -2.554 0 -4.631 2.077 -4.631 4.631 v 8.364 c 0 2.554 2.077 4.631 4.631 4.631 h 2.786 c 2.554 0 4.631 -2.077 4.631 -4.631 v -4.182 C 50.466 80.38 49.812 79.726 49.005 79.726 z"
  key="g"
          />
	  <path
  d="M 62.06 72.373 h -2.787 c -2.554 0 -4.631 2.077 -4.631 4.631 v 11.534 c 0 0.807 0.654 1.461 1.461 1.461 s 1.461 -0.654 1.461 -1.461 v -5.891 h 6.205 v 5.891 c 0 0.807 0.654 1.461 1.461 1.461 s 1.461 -0.654 1.461 -1.461 V 77.005 C 66.691 74.451 64.613 72.373 62.06 72.373 z M 57.564 79.726 v -2.721 c 0 -0.943 0.767 -1.709 1.709 -1.709 h 2.787 c 0.943 0 1.709 0.767 1.709 1.709 v 2.721 H 57.564 z"
  key="a"
          />
	  <path
  d="M 81.437 72.373 c -0.807 0 -1.461 0.654 -1.461 1.461 v 9.581 l -6.425 -10.351 c -0.344 -0.555 -1.018 -0.816 -1.642 -0.634 c -0.628 0.179 -1.061 0.752 -1.061 1.405 v 14.705 c 0 0.807 0.654 1.461 1.461 1.461 s 1.461 -0.654 1.461 -1.461 v -9.581 l 6.425 10.351 C 80.467 89.747 80.942 90 81.437 90 c 0.133 0 0.268 -0.018 0.4 -0.056 c 0.628 -0.179 1.061 -0.752 1.061 -1.405 V 73.834 C 82.898 73.028 82.244 72.373 81.437 72.373 z"
  key="n"
          />
        </g>
      </g>
    </svg>
  );
}